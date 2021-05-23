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
import "./CreateReport.css";
import convertToGoogleCoords from "../../utils";

const CreateReport = (props) => {
  const mapRef = useRef();
  const [coords, setCoords] = useState({});
  const [numMaskless, setNumMaskless] = useState(0);
  const [isInside, setIsInside] = useState(false);
  const [center, setCenter] = useState({});

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

  const handleIsInsideChange = (event) => {
    if (event.target.value === "on") {
      setIsInside(true);
    } else {
      setIsInside(false);
    }
  };

  const handleNumMasklessChange = (event) => {
    setNumMaskless(event.target.value);
  };

  const handleSubmit = (form) => {
    form.preventDefault();

    let report = {
      lat: coords.lat,
      lng: coords.lng,
      is_inside: isInside,
      num_maskless: numMaskless,
    };

    axios
      .post("/api/report", report)
      .then((response) => {
        alert("Report Submitted Successfully");
        // return to home page after submit
        // props.history.push("/");
        window.location = "/";
      })
      .catch((error) => {
        console.log(error);
        console.debug(error);
        console.dir(error);
        alert(error.message);
      });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} className="report-form">
        {/* <h1>Create a Report</h1> */}
        <div className="mapForm">
          <div className="mapFormSection">
            <SelectLocationMap
              coords={coords}
              setCoords={setCoords}
              center={center}
              mapRef={mapRef}
              isMaskReport={true}
            />
          </div>
          <div className="mapFormSection">
          <Form.Text className="text-muted">
              Drag marker or search to select location.
          </Form.Text>
            <Search panTo={panTo} setCoords={setCoords} center={center} />
            <Form.Group controlId="formNumMaskless">
              <Form.Row>
                <Form.Label>Number of people not wearing masks: </Form.Label>
              </Form.Row>
              <Form.Row>
                <RangeSlider
                  value={numMaskless}
                  onChange={handleNumMasklessChange}
                  tooltip="auto"
                />
              </Form.Row>
            </Form.Group>
            <Form.Group controlId="formIsInside">
              <Form.Check
                type="checkbox"
                label="Inside?"
                onChange={handleIsInsideChange}
                tooltip="auto"
              />
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

export default CreateReport;
