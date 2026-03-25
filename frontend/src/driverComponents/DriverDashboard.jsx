import React, { useEffect, useState } from 'react'
import DriverSidebar from '../components/DriverSidebar'
import DriverProfileModal from '../modals/DriverProfileModal'

export default function DriverDashboard() {

  const [verifiedState, setVerifiedState] = useState("")
  const [driverProfile, setDriverProfile] = useState(true)

  useEffect(() => {
    const status = sessionStorage.getItem("verifiedCheck")
    // setVerifiedState(status)
    if (setVerifiedState) {
      setVerifiedState(status === "true");
    }

    console.log(typeof status)
  }, [])
  console.log("this is verifiedstate: ", verifiedState)
  return (
    <div className='dashboard'>
      {verifiedState === false && driverProfile === true && (
        <DriverProfileModal onClose={() => setDriverProfile(false)} />
      )}
      <DriverSidebar/>
      <main>
        <b>Dashboard</b>

        <div className="stats">
        <div className="stat_item">
          <h3>Total Earnings</h3>
          <p>0</p>
        </div>
        <div className="stat_item">
          <h3>Active Deliveries</h3>
          <p>0</p>
        </div>
        <div className="stat_item">
          <h3>Available Jobs</h3>
          <p>0</p>
        </div>
        <div className="stat_item">
          <h3>Completed</h3>
          <p>0</p>
        </div>
        </div>

        <div className="mini_deliveries">
        <h3>Recent Deliveries Activities</h3>
        </div>
      </main>
    </div>
  )
}
