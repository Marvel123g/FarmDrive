import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function FarmerDashboard() {
  const [recentProduce, setRecentProduce] = useState([]);

  useEffect(() => {
    const fetchProduce = async () => {
      const res = await fetch("/api/v1/produce?role=farmer", {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.produce);
      setRecentProduce(data.produce);
      // console.log(myProduce)
    };

    fetchProduce();
  }, []);
  const navigate = useNavigate()

  return (
    <div className="dashboard">
      <Sidebar />
      <main>
        <b>Dashboard</b>

        <div className="stats">
          <div className="stat_item">
            <h3>Total Produce</h3>
            <p>0</p>
          </div>
          <div className="stat_item">
            <h3>Active Deliveries</h3>
            <p>0</p>
          </div>
          <div className="stat_item">
            <h3>Completed Deliveries</h3>
            <p>0</p>
          </div>
          <div className="stat_item">
            <h3>Total Payment Made</h3>
            <p>0</p>
          </div>
        </div>

        <div className="mini_listing">
          <header>
            <h3>Recent Produce</h3>
            <button onClick={() => navigate("/my-produce")}>View All Produce</button>
          </header>
          <table className="table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Destination</th>
                <th>Posted Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentProduce?.length === 0 ? (
                <tr className="empty-state-row">
                  <td colSpan={4}>
                    <div className="empty_produce">
                      <h3>No Produce Posted</h3>
                      <p>You haven't posted any produce yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentProduce?.slice(0, 4).map((item, i) => (
                  <tr key={i}>
                    <td>{item.crop_name}</td>
                    <td>
                      {item.pickup_location} → {item.destination}
                    </td>
                    <td>{item.posted_at}</td>
                    <td>
                      <span
                        className={`status-btn ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* <div className="mini_deliveries">
          <h3>Recent Deliveries</h3>
         </div> */}
      </main>
    </div>
  );
}
