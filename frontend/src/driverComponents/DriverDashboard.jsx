import React, { useEffect, useState } from "react";
import DriverSidebar from "../components/DriverSidebar";
import DriverProfileModal from "../modals/DriverProfileModal";

export default function DriverDashboard() {
  const [verifiedState, setVerifiedState] = useState("");
  const [driverProfile, setDriverProfile] = useState(true);
  const [getStats, setGetStats] = useState({});
  const [miniDelivery, setMiniDelivery] = useState([]);

  useEffect(() => {
    const status = sessionStorage.getItem("verifiedCheck");
    // setVerifiedState(status)
    if (setVerifiedState) {
      setVerifiedState(status == "true");
    }

    console.log(typeof status);
    console.log("this is verifiedstate: ", verifiedState);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/v1/driver/stats", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.data);
      setGetStats(data.data);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchMiniDelivery = async () => {
      const res = await fetch("/api/v1/delivery?role=driver", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      console.log(data.accepted_produce);
      setMiniDelivery(data.accepted_produce);
    };

    fetchMiniDelivery();
  }, []);

  return (
    <div className="dashboard">
      {verifiedState == false && driverProfile === true ? (
        <DriverProfileModal onClose={() => setDriverProfile(false)} />
      ) : null}
      <DriverSidebar />
      <main>
        <b>Dashboard</b>

        <div className="stats">
          <div className="stat_item">
            <h3>Total Earnings</h3>
            <p>{getStats?.total_earned_naira}</p>
          </div>
          <div className="stat_item">
            <h3>Active Deliveries</h3>
            <p>{getStats?.total_deliveries}</p>
          </div>
          <div className="stat_item">
            <h3>Available Jobs</h3>
            <p>{getStats?.available_jobs}</p>
          </div>
          <div className="stat_item">
            <h3>Completed</h3>
            <p>{getStats?.completed_jobs}</p>
          </div>
        </div>

        <div className="mini_deliveries">
          <header>
            <h3>Recent Deliveries Activities</h3>
          </header>
          <table className="table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Destination</th>
                <th>Accepted Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {miniDelivery?.length === 0 ? (
                <tr className="empty-state-row">
                  <td colSpan={4}>
                    <div className="empty_produce">
                      <h3>No Produce Accepted</h3>
                      <p>You have no produce accepted yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                miniDelivery?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.crop_name}</td>
                    <td>
                      {item.pickup_location} → {item.destination}
                    </td>
                    <td>{item.accepted_at}</td>
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
      </main>
    </div>
  );
}
