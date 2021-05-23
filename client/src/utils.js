const convertToGoogleCoords = (lat, lng) => {
    return new window.google.maps.LatLng(lat, lng);
};

export default convertToGoogleCoords;