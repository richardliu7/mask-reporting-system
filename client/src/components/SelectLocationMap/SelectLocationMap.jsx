// { useCallback }
import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import "react-bootstrap/Nav";

import "../../utils";
import "./SelectLocationMap.css";
import convertToGoogleCoords from "../../utils";

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const SelectLocationMap = ({
  coords,
  setCoords,
  center,
  mapRef,
  isMaskReport,
}) => {
  // const onMapLoad = useCallback((map) => {
  //   mapRef.current = map;
  //   setCoords({ lat: center.lat, lng: center.lng });
  // }, []);
  const onMapLoad = (map) => {
    mapRef.current = map;
    setCoords(convertToGoogleCoords(center.lat, center.lng));
  };

  const onMarkerDragEnd = (event) => {
    // setCoords(event.latLng);
    setCoords({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={{
          width: "70vw",
          height: "70vh",
        }}
        zoom={10}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        <Marker
          draggable={isMaskReport}
          onDragEnd={onMarkerDragEnd}
          position={center}
        />
      </GoogleMap>
    </div>
  );
};

const Search = ({ panTo, setCoords, center, setAddress }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => center.lat, lng: () => center.lng },
      radius: 10,
    },
  });

  const onSelection = async (address) => {
    try {
      setValue(address, false);
      clearSuggestions();

      const results = await getGeocode({ address });
      const coords = await getLatLng(results[0]);
      panTo(coords);
      setCoords(coords);
      setAddress(address);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={onSelection}>
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Enter location"
        ></ComboboxInput>
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
};

export { SelectLocationMap, Search };
