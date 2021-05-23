import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import "./HeatMapBusinessInfoWindow.css";


const HeatMapBusinessInfoWindow = ({selectedBusiness, setSelectedBusiness}) => {

    const renderStars = (num_stars) => {
        let stars = [];
    
        for (let i = 0; i < num_stars; i++) {
          stars.push(<div key={i} className="clip-star"></div>);
        }
        for (let i = num_stars; i < 5; i++) {
          stars.push(<div key={i} className="clip-star-empty"></div>);
        }
        return <div>{stars}</div>;
    };

    return (
        <InfoWindow
            position={{
              lat: selectedBusiness._id.lat,
              lng: selectedBusiness._id.lng,
            }}
            onCloseClick={() => {
              setSelectedBusiness(null);
            }}
          >
        <div className="info-window">
            <h3>{selectedBusiness._id.address}</h3>
            <div className="rating-entry">
            <span className="rating-entry-title">Mask Usage:</span>
            <div className="rating-entry-right">
                {renderStars(Math.round(selectedBusiness.avg_mask_rating))}
                <span className="rating-entry-numbers">
                {selectedBusiness.avg_mask_rating.toFixed(1)}/5.0
                </span>
            </div>
            </div>
            <div className="rating-entry">
            <span className="rating-entry-title">Social Distancing:</span>
            <div className="rating-entry-right">
                {renderStars(
                Math.round(selectedBusiness.avg_social_distance_rating)
                )}
                <span className="rating-entry-numbers">
                {selectedBusiness.avg_social_distance_rating.toFixed(1)}/5.0
                </span>
            </div>
            </div>
            <div className="rating-entry">
            <span className="rating-entry-title">Sanitization:</span>
            <div className="rating-entry-right">
                {renderStars(
                Math.round(selectedBusiness.avg_sanitization_rating)
                )}
                <span className="rating-entry-numbers">
                {selectedBusiness.avg_sanitization_rating.toFixed(1)}/5.0
                </span>
            </div>
            </div>
        </div>
        </InfoWindow>
    );
};

export default HeatMapBusinessInfoWindow;

