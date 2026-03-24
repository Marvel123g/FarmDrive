import React from 'react'
import DriverSidebar from '../components/DriverSidebar'

export default function DriverDashboard() {
  return (
    <div className='dashboard'>
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
