import React, { useState } from 'react';

export default function MAFVisual() {
  const [roomImage, setRoomImage] = useState(null);
  const [roomImageFile, setRoomImageFile] = useState(null);
  const [floorboard, setFloorboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const floorOptions = [
    { name: 'Dim Grey', url: process.env.PUBLIC_URL + '/floorboards/7109-Dim-Grey-scaled.jpg' },
    { name: 'Classic Blackbutt', url: process.env.PUBLIC_URL + '/floorboards/7105-Classic-Blackbutt-scaled.jpg' },
    { name: 'Pale Oak', url: process.env.PUBLIC_URL + '/floorboards/7103-Pale-Oak-scaled.jpg' }
  ];

  const handleRoomImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setRoomImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFloorSelect = (floor) => {
    setFloorboard(floor);
  };

  const handleProcess = async () => {
    if (!roomImageFile || !floorboard) {
      alert("Please upload a room and pick a floor.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("room", roomImageFile);
    const swatchBlob = await fetch(floorboard.url).then(res => res.blob());
    formData.append("swatch", swatchBlob);

    const response = await fetch("https://maf-visual-api.onrender.com/process", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.status === "ok") {
      setRoomImage(`data:image/jpeg;base64,${data.image}`);
    } else {
      alert("Error: " + data.detail);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
      <h1>MAF Visual - Try Your Floor</h1>
      <input type="file" accept="image/*" onChange={handleRoomImageChange} />
      {roomImage && <img src={roomImage} alt="Room Preview" style={{ width: '100%', margin: '20px 0' }} />}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        {floorOptions.map((floor, index) => (
          <button key={index} onClick={() => handleFloorSelect(floor)}>
            <img src={floor.url} alt={floor.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
            <p>{floor.name}</p>
          </button>
        ))}
      </div>
      {floorboard && <p>Selected: {floorboard.name}</p>}
      <div>
        <button onClick={handleProcess} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Preview"}
        </button>
      </div>
    </div>
  );
}
