  
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import dayjs from 'dayjs';

const HeatMapFilterModal = ({showFilterModal, setShowFilterModal, setFilterFromDate,
    setFilterGetInside, setFilterGetOutside}) => {

    // Default to getting data from inside AND outside, for the past year
    const [selectedDateOption, setSelectedDateOption] = useState("option6");
    const [selectedLocationOption, setSelectedLocationOption] = useState("option3");

    const handleChangeSelectedDateOption = (event) => {
        setSelectedDateOption(event.target.id);

        switch (event.target.id) {
            case "option1":
                setFilterFromDate(dayjs().subtract(1, 'hour').toISOString());
                break;
            case "option2":
                setFilterFromDate(dayjs().subtract(1, 'day').toISOString());
                break;
            case "option3":
                setFilterFromDate(dayjs().subtract(3, 'day').toISOString());
                break;
            case "option4":
                setFilterFromDate(dayjs().subtract(1, 'week').toISOString());
                break;
            case "option5":
                setFilterFromDate(dayjs().subtract(1, 'month').toISOString());
                break;
            case "option6":
                setFilterFromDate(dayjs().subtract(1, 'year').toISOString());
                break;
        }
    };

    const handleChangeSelectedLocationOption = (event) => {
        setSelectedLocationOption(event.target.id);

        switch (event.target.id) {
            case "option1":
                setFilterGetInside(true);
                setFilterGetOutside(false);
                break;
            case "option2":
                setFilterGetInside(false);
                setFilterGetOutside(true);
                break;
            case "option3":
                setFilterGetInside(true);
                setFilterGetOutside(true);
                break;
        }
    }

    const handleCloseFilterModal = () => setShowFilterModal(false);
    const handleSaveFilterSettings = () => setShowFilterModal(false);

    return (
    <Modal show={showFilterModal} onHide={handleCloseFilterModal}>
        <Modal.Header closeButton>
            <Modal.Title>Change Heat Map Filter Settings</Modal.Title>
        </Modal.Header>
        <Form>
        <Modal.Body>
        <Row>
        <Col>
        <Form.Group controlId="filterDateForm"> 
            <Form.Label>Show reports from the past:</Form.Label>
            <Form.Check 
                type="radio"
                label={`1 hour`}
                id={"option1"}
                checked={ selectedDateOption === "option1"}
                onChange={handleChangeSelectedDateOption}
            />
            <Form.Check 
                type="radio"
                label={`1 day`}
                id={"option2"}
                checked={ selectedDateOption === "option2"}
                onChange={handleChangeSelectedDateOption}
            />
            <Form.Check 
                type="radio"
                label={`3 days`}
                id={"option3"}
                checked={ selectedDateOption === "option3"}
                onChange={handleChangeSelectedDateOption}
            />
            <Form.Check 
                type="radio"
                label={`1 week`}
                id={"option4"}
                checked={ selectedDateOption === "option4"}
                onChange={handleChangeSelectedDateOption}
            />
            <Form.Check 
                type="radio"
                label={`1 month`}
                id={"option5"}
                checked={ selectedDateOption === "option5"}
                onChange={handleChangeSelectedDateOption}
            />
            <Form.Check 
                type="radio"
                label={`1 year`}
                id={"option6"}
                checked={ selectedDateOption === "option6"}
                onChange={handleChangeSelectedDateOption}
            />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="filterLocationForm"> 
            <Form.Label>Show report data from:</Form.Label>
            <Form.Check 
                type="radio"
                label={`Inside Only`}
                id={"option1"}
                checked={ selectedLocationOption === "option1"}
                onChange={handleChangeSelectedLocationOption}
            />
            <Form.Check 
                type="radio"
                label={`Outside Only`}
                id={"option2"}
                checked={ selectedLocationOption === "option2"}
                onChange={handleChangeSelectedLocationOption}
            />
            <Form.Check 
                type="radio"
                label={`Both Inside and Outside`}
                id={"option3"}
                checked={ selectedLocationOption === "option3"}
                onChange={handleChangeSelectedLocationOption}
            />
        </Form.Group>
        </Col>
        </Row>
        </Modal.Body>
        </Form>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseFilterModal}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSaveFilterSettings}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
    );
}

export default HeatMapFilterModal;