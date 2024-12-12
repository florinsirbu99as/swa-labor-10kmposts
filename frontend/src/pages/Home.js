import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState('');
  const navigate = useNavigate();

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {                                      //calculate coordinates
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          };
          setLocation(coords);
          setError('');
          calculateRadius(coords, 10);                          // Calculate 10 km radius
        },
        (error) => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const calculateRadius = (coords, distanceKm) => {
    const earthRadiusKm = 6371;  // Earth's radius in kilometers
    const lat = parseFloat(coords.latitude);
    const lon = parseFloat(coords.longitude);

    // Convert distance to angular distance in radians
    const angularDistance = distanceKm / earthRadiusKm;

    // Latitude bounding box
    const minLat = (lat - (angularDistance * (180 / Math.PI))).toFixed(6);
    const maxLat = (lat + (angularDistance * (180 / Math.PI))).toFixed(6);

    // Longitude bounding box
    const minLon = (lon - (angularDistance * (180 / Math.PI)) / Math.cos(lat * (Math.PI / 180))).toFixed(6);
    const maxLon = (lon + (angularDistance * (180 / Math.PI)) / Math.cos(lat * (Math.PI / 180))).toFixed(6);

    setRadius({ minLat, maxLat, minLon, maxLon });
  };

  const handleShowPosts = () => {
    navigate('/main');
  };

  return (
    <div className="home-container" style={{ marginTop: '40px', border: '2px solid #f23f4c' }}>
      <h2>Find your current location</h2>
      <Button variant="contained" onClick={handleLocation} style={{ backgroundColor: '#020002' }}>Show My Location</Button>

      {error && <p>{error}</p>}

      {location && (
        <div className="location-container">
          <h3>You are here:</h3>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>All posts in the radius of 10km from your current location will be shown.</p>
          <p>
            Max Latitude: {radius.maxLat}, <br></br> Min Latitude: {radius.minLat}, <br></br>
            Min Longitude: {radius.minLon}, <br></br> Max Longitude: {radius.maxLon}
          </p>
          <div className="map">
            <div className="circle">
              <div className="label top">{radius.maxLat}</div>
              <div className="label bottom">{radius.minLat}</div>
              <div className="label left">{radius.minLon}</div>
              <div className="label right">{radius.maxLon}</div>
              <div className="current-location">
                <span>Your location</span>
              </div>
            </div>
          </div>
          <Button
            variant="contained"
            onClick={handleShowPosts}
            style={{ marginTop: '40px', backgroundColor: '#020002' }} 
          >
            Show Me The Posts
          </Button>
        </div>
      )}
    </div>
  );
}

export default Home;

