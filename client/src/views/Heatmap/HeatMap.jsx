import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, HeatmapLayer, Marker } from "@react-google-maps/api";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";

import HeatMapFilterModal from "../../components/HeatMapFunctionality/HeatMapFilterModal.jsx";
import HeatMapBusinessInfoWindow from "../../components/HeatMapFunctionality/HeatMapBusinessInfoWindow.jsx";
import "./HeatMap.css";

const getFilteredPositionsFromReports = async (
  date,
  includeInside,
  includeOutside
) => {
  let positions;

  return axios
    .get("/api/heatmap/coords", {
      params: {
        date: date,
        inside: includeInside.toString(),
        outside: includeOutside.toString(),
      },
    })
    .then((res) => {
      positions = res.data;
      return positions;
    })
    .catch((err) => {
      console.log(err);
    });
};

const convertFilteredPositionsToHeatMapData = async (date, inside, outside) => {
  let currPositions = await getFilteredPositionsFromReports(
    date,
    inside,
    outside
  );
  let heatMapData = [];

  currPositions.map((position) => {
    const dataPoint = {};
    dataPoint.location = new window.google.maps.LatLng(
      position.lat,
      position.lng
    );
    dataPoint.weight = position.num_maskless * 10;
    heatMapData.push(dataPoint);
  });

  return heatMapData;
};

const getAverageRatingsFromAllReviews = async () => {
  return axios
    .get("/api/review/rating")
    .then((res) => {
      let reviews = res.data;
      return reviews;
    })
    .catch((err) => {
      console.log(err);
    });
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

const HeatMapContainer = () => {
  const mapStyle = {
    width: "100vw",
    height: "91vh", // HACK  Accounting for the navbar manually
  };
  const heatMapOptions = {
    radius: 20,
    opacity: 1,
  };

  const mapRef = useRef();
  const [center, setCenter] = useState();
  const [heatMapData, setHeatMapData] = useState([]); // data from positions formatted for heat map
  const [showBusinessReports, setShowBusinessReports] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [reviewsData, setReviewsData] = useState([]);
  const [centerFound, setCenterFound] = useState(false);

  // For filtering
  const [filterFromDate, setFilterFromDate] = useState(
    dayjs().subtract(1, "year").toISOString()
  );
  const [filterGetInside, setFilterGetInside] = useState(true);
  const [filterGetOutside, setFilterGetOutside] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const handleShowHeatMapFilterSettings = () => setShowFilterModal(true);

  const [showSettingsButtons, setShowSettingsButtons] = useState(false);

  const setAllData = async () => {
    let heatMapData = await convertFilteredPositionsToHeatMapData(
      filterFromDate,
      filterGetInside,
      filterGetOutside
    );
    setHeatMapData(heatMapData);

    let ratings = await getAverageRatingsFromAllReviews();
    setReviewsData(ratings);
  };

  // Good explanation of useEffect:
  // https://medium.com/@timtan93/states-and-componentdidmount-in-functional-components-with-hooks-cac5484d22ad
  useEffect(() => {
    if (!centerFound) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const dataPoint = new window.google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setCenter(dataPoint);
        },
        (err) => {
          console.log("(useEffect)  Could not get current position");
        }
      );
      setCenterFound(true);
    }

    // Cannot use setInterval here, will cause the filtering variables to flicker and be
    // reset ever couple of seconds.
    setAllData();
  }, [centerFound, filterGetInside, filterGetOutside, filterFromDate]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const toggleSettingsButtons = () => {
    setShowSettingsButtons(!showSettingsButtons);
  };

  return (
    <div>
      <GoogleMap
        zoom={14}
        mapContainerStyle={mapStyle}
        center={center}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        <HeatmapLayer data={heatMapData} options={heatMapOptions} />

        {showBusinessReports ? (
          reviewsData.map((review) => (
            <Marker
              key={review._id.address}
              position={{
                lat: review._id.lat,
                lng: review._id.lng,
              }}
              onClick={() => {
                setSelectedBusiness(review);
              }}
            />
          ))
        ) : (
          <div></div>
        )}
        {showBusinessReports && selectedBusiness && (
          <HeatMapBusinessInfoWindow
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={setSelectedBusiness}
          />
        )}
      </GoogleMap>

      <div className="hidden-button-1">
        {showSettingsButtons ? (
          <BootstrapSwitchButton
            checked={showBusinessReports}
            onlabel="Hide Business Reports"
            offlabel="Show Business Reports"
            onChange={() => {
              setShowBusinessReports(!showBusinessReports);
            }}
            width={225}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="hidden-button-2">
        {showSettingsButtons ? (
          <Button
            // className="primary-button"
            // variant="primary"
            onClick={handleShowHeatMapFilterSettings}
            block
          >
            Edit Heatmap Filters
          </Button>
        ) : (
          <></>
        )}
      </div>
      <Button
        className="toggle-settings-button"
        variant={!showSettingsButtons ? "primary" : "danger"}
        onClick={toggleSettingsButtons}
      >
        {!showSettingsButtons ? "Show Settings" : "Hide Settings"}
      </Button>

      <HeatMapFilterModal
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        setFilterFromDate={setFilterFromDate}
        setFilterGetInside={setFilterGetInside}
        setFilterGetOutside={setFilterGetOutside}
      />
    </div>
  );
};
export default HeatMapContainer;
