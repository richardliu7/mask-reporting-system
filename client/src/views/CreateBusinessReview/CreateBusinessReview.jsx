import axios from "axios";
import React, { useState, useEffect, useCallback, useRef } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import RangeSlider from "react-bootstrap-range-slider";
import "bootstrap/dist/css/bootstrap.css";

import {
  SelectLocationMap,
  Search,
} from "../../components/SelectLocationMap/SelectLocationMap";
import "./CreateBusinessReview.css";

const CreateBusinessReview = (props) => {
  const mapRef = useRef();
  const [coords, setCoords] = useState({});
  const [maskUsage, setMaskUsage] = useState(0);
  const [sanitized, setSanitized] = useState(0);
  const [socialDistance, setSocialDistance] = useState(0);
  const [center, setCenter] = useState({});
  const [address, setAddress] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCenter(coords);
        setCoords(coords);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
    setCenter({ lat, lng });
  }, []);

  const handleMaskUsageChange = (event) => {
    setMaskUsage(event.target.value);
  };

  const handleSanitizedChange = (event) => {
    setSanitized(event.target.value);
  };

  const handleSocialDistanceChange = (event) => {
    setSocialDistance(event.target.value);
  };

  const handleSubmit = (form) => {
    form.preventDefault();

    let review = {
      address: address,
      lat: coords.lat,
      lng: coords.lng,
      mask_usage: maskUsage,
      sanitized: sanitized,
      social_distance: socialDistance,
    };

    axios
      .post("/api/review", review)
      .then((response) => {
        alert("Review Submitted Successfully");
        // return to home page after submit
        // props.history.push("/");
        window.location = "/";
      })
      .catch((error) => {
        console.log(error);
        console.debug(error);
        console.dir(error);
        alert("There was an error submiting your review");
      });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} className="report-form">
        <div className="mapForm">
          <div className="mapFormSection">
            <SelectLocationMap
              coords={coords}
              setCoords={setCoords}
              center={center}
              mapRef={mapRef}
              isMaskReport={false}
            />
          </div>
          <div className="mapFormSection">
          <Form.Text className="text-muted">
              Search to select a business to review.
          </Form.Text>
            <Search
              panTo={panTo}
              setCoords={setCoords}
              center={center}
              address={address}
              setAddress={setAddress}
            />
            <Form.Label>Rate the following on a scale of 1-5: </Form.Label>
            <Form.Group controlId="formMaskUsage">
              <Form.Row>
                <Form.Label>How frequently is mask usage enforced? </Form.Label>
              </Form.Row>
              <Form.Row>
                <RangeSlider
                  value={maskUsage}
                  onChange={handleMaskUsageChange}
                  tooltip="auto"
                  min={1}
                  max={5}
                />
              </Form.Row>
            </Form.Group>
            <Form.Group controlId="formSanitized">
              <Form.Row>
                <Form.Label>How frequently are surfaces sanitized? </Form.Label>
              </Form.Row>
              <Form.Row>
                <RangeSlider
                  value={sanitized}
                  onChange={handleSanitizedChange}
                  tooltip="auto"
                  min={1}
                  max={5}
                />
              </Form.Row>
            </Form.Group>
            <Form.Group controlId="formSocialDistance">
              <Form.Row>
                <Form.Label>
                  How frequently is social distancing kept?{" "}
                </Form.Label>
              </Form.Row>
              <Form.Row>
                <RangeSlider
                  value={socialDistance}
                  onChange={handleSocialDistanceChange}
                  tooltip="auto"
                  min={1}
                  max={5}
                />
              </Form.Row>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="report-form-submit"
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateBusinessReview;
