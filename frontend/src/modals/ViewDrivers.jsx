import React, { useEffect, useState } from "react";

export default function ViewDrivers({ data, onClose }) {
  const [listOfDrivers, setListOfDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await fetch(`/api/v1/price/${data.id}`, {
        method: "GET",
        credentials: "include",
      });
      const responseData = await res.json();
      console.log(responseData.prices);
      setListOfDrivers(responseData.prices);
    };

    fetchDrivers();
  }, []);

  const acceptDriver = async (produceID, driverID) => {
    const res = await fetch("api/v1/price/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceDetails: { "produce_id": produceID, "driver_id": driverID },
      }),
      credentials: "include"
    });
    const data = res.json();
  };


  return (
    <div className="driver_overlay">
      <div className="choice-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Delivery Details</h2>

        <div className="delivery-info">
          <div className="info-row">
            <span className="info-label">📍 Route:</span>
            <span className="info-value">
              {data.pickup_location} → {data.destination}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">📦 Quantity:</span>
            <span className="info-value">{data.quantity}</span>
          </div>

          <div className="info-row">
            <span className="info-label">💬 Message:</span>
            <span className="info-value">{data.details || "No message"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">📅 Posted on:</span>
            <span className="info-value">{data.posted_at?.slice(0, 10)}</span>
          </div>
        </div>

        <hr className="divider" />

        <div className="drivers-section">
          <h3>Available Drivers</h3>
          <p className="drivers-subtitle">
            Select a driver to assign this delivery
          </p>

          <div className="drivers-list">
            {listOfDrivers?.map((driver) => (
              <div className="driver-card" key={driver.driver_id}>
                <div className="driver_header">
                  <img src={driver.profile_picture} className="driver-avatar" />
                  <section className="sub_heading">
                    <h4>{driver.driver_name}</h4>
                    <small className="driver-contact">
                      📞 Phone:{" "}
                      <span className="driver-info-value">
                        {driver.driver_phone}
                      </span>
                    </small>
                  </section>
                </div>
                <div className="driver_details">
                  <div className="driver-details-section">
                    <div className="driver-info-row">
                      <span className="driver-info-label">📍 Distance:</span>
                      <span className="driver-info-value">
                        {driver.driver_distance}
                      </span>
                    </div>
                    <div className="driver-info-row">
                      <span className="driver-info-label">💰 Price:</span>
                      <span className="driver-info-value price">
                        {driver.price}
                      </span>
                    </div>
                    <div className="driver-info-row">
                      <span className="driver-info-label">⏱️ Time away:</span>
                      <span className="driver-info-value">
                        {driver.time_away}
                      </span>
                    </div>
                  </div>
                  <div className="btns">
                    <button className="action-btn" onClick={() => acceptDriver(data.id, driver.driver_id)}>Accept</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
