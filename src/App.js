import React, { useState, useEffect, useRef  } from "react";
import {Marker, Popup, MapContainer, TileLayer } from 'react-leaflet';
import loader from './loader.svg';

async function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function App() {
  const [data, setData] = useState([]);

  useInterval(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8080/getweather');
        const json = await response.json();
        hideLoader();
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
      <div id="loader" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'grey', zIndex: '1000', opacity: '0.5'}}>
        <img src={loader
        } alt="loader" style={{width: '100px', height: '100px', opacity: '1', objectFit: 'contain', objectPosition: 'center', zIndex: '1000'}}/>
      </div>
      {
        data.map((item) => (
          <Marker key={item.lat + item.lon} position={[item.lat, item.lon]}>
            <Popup>
              <div style={{ textAlign: "center"}}>
                <div id="header" style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ color: "red" }}>{Math.round((item.temp - 273.15) * 100)/100}°C</h3>
                  </div>
                  <div>
                    <h2 style={{ color: "blue", marginBottom:"0px" }}>{item.name}</h2>
                    <p style={{ color: "coral", fontSize: "15px", margin: "0px" }}>({item.main})</p>
                  </div>
                  <div>
                    <h3 style={{ color: "coral" }}>{new Date(item.time * 1000).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })}</h3>
                  </div>
                </div>
                <div id="body" style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ color: "green" }}>💧<br></br>Humidity<br></br>{item.humidity}%</p>
                  </div>
                  <div>
                    <p style={{ color: "skyblue" }}>💨<br></br>Wind<br></br>{item.wind}m/s</p>
                  </div>
                  <div>
                    <p style={{ color: "purple" }}>☀️<br></br>Pressure<br></br>{item.pressure}hPa</p>
                  </div>
                  <div>
                    <p style={{ color: "orange" }}>🌅<br></br>Sunrise<br></br>{new Date(item.sunrise * 1000).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })}</p>
                  </div>
                  <div>
                    <p style={{ color: "grey" }}>🌇<br></br>Sunset<br></br>{new Date(item.sunset * 1000).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })}</p>
                  </div>
                </div>
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
