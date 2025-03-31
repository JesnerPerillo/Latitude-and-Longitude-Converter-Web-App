import "tailwindcss";
import React from 'react'
import { useState } from 'react';

function App() {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [dms, setDms] = useState("");

  const convertDMS = (dd, type) => {
    const deg = Math.floor(Math.abs(dd));
    const min = Math.floor((Math.abs(dd) - deg) * 60);
    const sec = ((Math.abs(dd) - deg - min / 60) * 3600).toFixed(2);
    const direction = dd < 0 ? (type === "lat" ? "S" : "W") : type === "lat" ? "N" : "E";
    return`${deg}° ${min}' ${sec}" ${direction}`;
  }

  const handleConvertDMS = (e) => {
    e.preventDefault();
    setDms(`${convertDMS(lat, "lat")}, ${convertDMS(long, "long")}`);
  };
  
  const handleSaveCoords = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/coords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lat, long, notes: "Converted coordinates" }),
    });
    alert("Coordinates saved successfully!");
  };
  

  return (
    <div className="bg-gray-200 h-screen w-full flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <form className="space-y-4 flex flex-col items-center">
          <div className="flex flex-col">
            <label>Latitude</label>
            <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Enter Decimal Degrees" />
          </div>
          <div className="flex flex-col">
            <label>Longitude</label>
            <input type="text" value={long} onChange={(e) => setLong(e.target.value)} placeholder="Enter Decimal Degrees" />
          </div>
          <div>
            <label>DMS</label>
            <p>{dms}</p>
          </div>
          <button onClick={handleConvertDMS}>Convert Coords</button>
          <button onClick={handleSaveCoords}>Save Converted Coords</button>
        </form>
      </div>
    </div>
  )
}

export default App
