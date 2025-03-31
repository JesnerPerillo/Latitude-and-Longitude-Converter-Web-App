import "tailwindcss";
import React from 'react'
import { useState } from 'react';

function App() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
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
    setDms(`${convertDMS(lat, "lat")}, ${convertDMS(lng, "long")}`);
  };
  
  const handleSaveCoords = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/coords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lat, lng, notes: "Converted coordinates" }),
      });
  
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Received non-JSON response:", text);
        throw new Error(`Server returned: ${text.substring(0, 100)}...`);
      }
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save coordinates');
      }
      
      alert(data.message || "Coordinates saved successfully!");
    } catch (error) {
      console.error("Full error:", error);
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="bg-gray-200 h-screen w-full flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-15">Coordinate Converter</h2>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Latitude</label>
            <input 
              type="text" 
              value={lat} 
              onChange={(e) => setLat(e.target.value)} 
              placeholder="Enter Decimal Degrees"
              className="border-b-2 outline-none p-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Longitude</label>
            <input 
              type="text" 
              value={lng} 
              onChange={(e) => setLng(e.target.value)} 
              placeholder="Enter Decimal Degrees"
              className="border-b-2 outline-none p-2"
            />
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-center text-gray-800 font-semibold">
            <label className="text-gray-700 font-medium">DMS</label>
            <p className="text-lg">{dms || "Converted coordinates will appear here"}</p>
          </div>
          <div className="flex justify-center">
            <button onClick={handleConvertDMS} className="w-1/2 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-300 hover:cursor-pointer">
              Convert Coordinates
            </button>
          </div>
          <div className="flex justify-center">
            <button onClick={handleSaveCoords} className="w-1/2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 hover:cursor-pointer">
              Save Converted Coords
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
