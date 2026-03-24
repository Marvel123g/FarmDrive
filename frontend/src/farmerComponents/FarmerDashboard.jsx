import React from 'react'
import Sidebar from '../components/Sidebar'

export default function FarmerDashboard() {
  return (
    <div className='dashboard'>
        <Sidebar/>
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
          <h3>Recent Produce</h3>
         </div>

         <div className="mini_deliveries">
          <h3>Recent Deliveries</h3>
         </div>
       </main>
    </div>
  )
}
