import React, {useEffect, useState} from 'react'
import Sidebar from '../components/Sidebar'

export default function PostProduce() {
    const [form, setForm] = useState({
        // id: id,
        crop: "",
        from: "",
        to: "",
        quantity: "",
        price: "",
        description: "",
    });
    const [farmerLocation, setFarmerLocation] = useState({lat: "", lng: ""})

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
        setFarmerLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
      })
      }
    }, [])
     

    const handleSubmit = async(e) => {
      e.preventDefault()
      try {
        // /api/v1/farmer/auth/login
         const res = await fetch("/api/v1/produce", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({"produceDetails" : form, "farmerLocation": farmerLocation}),
          credentials: "include"
        })
        const data = await res.json()
        console.log(data)
        // console.log("Produce Details: ", form)
        // console.log("farmerLocation: ", farmerLocation)
      } catch (error) {
        console.log(error.message)
      }
    }
  return (
    <div className='post_produce'>
        <Sidebar/>
        <main>
             <div className="topbar">
          <h2>Post Produce</h2>
          <div className="user">Welcome, Musa!</div>
        </div>

        {/* FORM CARD */}
        <div className="formCard">
          <h3>New Produce Listing</h3>
          <p className="formDesc">
            Fill the details below so drivers can pick up and deliver your produce.
          </p>

          <form  className="formGrid">
            {/* CROP */}
            <div className="inputGroup">
              <label>Crop Name</label>
              <input
                type="text"
                name="crop"
                placeholder="e.g Tomatoes"
                value={form.crop}
                onChange={handleChange}
                required
              />
            </div>

            {/* PICKUP */}
            <div className="inputGroup">
              <label>Pickup Location</label>
              <input
                type="text"
                name="from"
                placeholder="e.g Jos"
                value={form.from}
                onChange={handleChange}
                required
              />
            </div>

            {/* DESTINATION */}
            <div className="inputGroup">
              <label>Destination</label>
              <input
                type="text"
                name="to"
                placeholder="e.g Lagos"
                value={form.to}
                onChange={handleChange}
                required
              />
            </div>

            {/* QUANTITY */}
            <div className="inputGroup">
              <label>Quantity</label>
              <input
                type="text"
                name="quantity"
                placeholder="e.g 50kg"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="fullWidth">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Extra details about produce, packaging, timing, etc."
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* BUTTONS */}
            <div className="formActions">
              {/* <button
                type="button"
                className="cancelBtn"
              >
                Cancel
              </button> */}

              <button type="button" className="primaryBtn" onClick={handleSubmit}>
                Post Listing
              </button>
            </div>
          </form>
        </div>
        </main>
    </div>
  )
}
