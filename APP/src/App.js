import React, { useState, useEffect, useRef  } from "react";
import {Marker, Popup, MapContainer, TileLayer } from 'react-leaflet';

function App() {
  const [data, setData] = useState([]);

  useInterval(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8080/getweather');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.log('error', error);
      }
    }
    fetchData();
  }, 1000 * 60 * 10);
  return (
    <MapContainer center={[23.2500, 77.4167]} zoom={6} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <div id="loader">
        <img src="https://i.imgur.com/6X6pLXH.gif" alt="loading" />
      </div>
      {
        data.map((item) => (
          document.getElementById("loader").style.display = "none",
          <Marker key={item.lat + item.lon} position={[item.lat, item.lon]}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ color: "blue" }}>{item.name}</h2>
                <h3 style={{ color: "coral" }}>({item.main})</h3>
                <p style={{ color: "red" }}>🌡️: {Math.round((item.temp - 273.15) * 100)/100}°C</p>
                <p style={{ color: "green" }}>Humidity: {item.humidity}%</p>
                <p style={{ color: "skyblue" }}>Wind: {item.wind}km/h</p>
                <p style={{ color: "purple" }}>☁️ Clouds: {item.clouds}%</p>
                <p style={{ color: "brown" }}>Pressure: {item.pressure}hPa</p>
                <p style={{ color: "orange" }}>🌞 Sunrise: {new Date(item.sunrise * 1000).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })}</p>
                <p style={{ color: "grey" }}>🌄 Sunset: {new Date(item.sunset * 1000).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })}</p>
              </div>
            </Popup>
          </Marker>
        ))
      }
      </MapContainer>
  );
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    tick();
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default App;
