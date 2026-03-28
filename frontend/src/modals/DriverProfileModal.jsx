import React, { useState } from 'react'

export default function DriverProfileModal({onClose}) {
    const [form, setForm] = useState({
        license_plate: "",
        vehicle_type: "",
        profile_picture: null,
        account_number: "",
        account_name: "",
        bank_name: ""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        setForm((prev) => ({
        ...prev,
        profile_picture: e.target.files[0], // store file object
        }));
    };

    const handleSubmit = async() => {
        const formData = new FormData()
        formData.append("license_plate", form.license_plate)
        formData.append("vehicle_type", form.vehicle_type)
        formData.append("profile_picture", form.profile_picture)
        formData.append("account_number", form.account_number)
        formData.append("account_name", form.account_name)
        formData.append("bank_name", form.bank_name)

        const res = await fetch("/api/v1/driver/auth/kyc", {
            method: "POST",
            body: formData,
            credentials: "include"
        })

        if(res.code === 200){
          const data = await res.json()
        console.log(data)
        onClose()
        alert("Profile updated successfully!. Please logout and login so u can be verified")
        }
    }
  return (
       <div className="modalOverlay">
      <div className="modalBox">
        <h2>Complete Your Driver Profile</h2>
        <p>You must complete your profile before accessing your dashboard.</p>

        <form className="modalForm">
          <input
            type="text"
            name="license_plate"
            placeholder="License plate number"
            value={form.license_plate}
            onChange={handleChange}
          />

          <input
            type="text"
            name="vehicle_type"
            placeholder="Vehicle Type"
            value={form.vehicle_type}
            onChange={handleChange}
          />
          <input
            type="text"
            name="bank_name"
            placeholder="Bank Name e.g Zenith"
            value={form.bank_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="account_number"
            placeholder="Your Account Number"
            value={form.account_number}
            onChange={handleChange}
          />
          <input
            type="text"
            name="account_name"
            placeholder="Account Name e.g John Doe"
            value={form. account_name}
            onChange={handleChange}
          />

          <div className="uploadWrapper">
            <label htmlFor="profile_picture" className="uploadBox">
                {form.profile_picture
                ? form.profile_picture.name
                : "Click to upload your profile picture"}
            </label>

            <input
                id="profile_picture"
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="hiddenFileInput"
            />
        </div>

          <button type='button' onClick={handleSubmit}>Save & Continue</button>
        </form>
      </div>
    </div>
  )
}
