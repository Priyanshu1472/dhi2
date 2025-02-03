import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = ({ clinicName }) => {
  const [formData, setFormData] = useState({
    clinicName: clinicName, // Pre-fill with logged-in clinic
    treatment: "",
    year: "",
    month: "",
    date: "",
    patientName: "",
    patientMobile: "",
    selectedDay: "",
  });

  const navigate = useNavigate();

  // Redirect to the login page if clinicName is not provided
  useEffect(() => {
    if (!clinicName) {
      navigate("/");
    }
  }, [clinicName, navigate]);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);  // State for loading
  const [uploadProgress, setUploadProgress] = useState(0); // State for progress

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "patientName" ? value.toUpperCase() : value, // Convert patientName to uppercase
    }));
  };

  // Handle file input changes (image selection)
  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true when upload starts
    setUploadProgress(0);  // Reset progress on new submission

    const modifiedFormData = {
      ...formData,
      year: `Year_${formData.year}`,
    };

    const form = new FormData();
    Object.entries(modifiedFormData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Append the images to the form data
    images.forEach((file) => form.append("images", file));

    try {
      // Track upload progress via axios
      const response = await axios.post("http://13.203.103.190:3001/submit-form", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          setUploadProgress(percent);  // Update the upload progress
        },
      });

      if (response.status === 200) {
        alert("Form submitted and images uploaded successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);  // Set loading to false when upload completes or fails
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Patient Information Form</h2>

      {/* Clinic Name */}
      <label>Clinic:</label>
      <p>{clinicName} Selected</p>

      {/* Treatment Type */}
      <label>Treatment:</label>
      <select name="treatment" value={formData.treatment} onChange={handleChange} required>
        <option value="">Select Treatment</option>
        {["Alopecia Diagnostic Test", "Direct Hair Implantation", "Cosmetic Hair Patch", "Scalp Micropigmentation", "Eyebrow Restoration", "Beard Restoration", "Scar Repair", "GFC", "PRP", "Regenera Activa"].map((treatment) => (
          <option key={treatment} value={treatment}>{treatment}</option>
        ))}
      </select>

      {/* Year Selection */}
      <label>Year:</label>
      <select name="year" value={formData.year} onChange={handleChange} required>
        <option value="">Select Year</option>
        {[2024, 2025, 2026, 2027, 2028].map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      {/* Month Selection */}
      <label>Month:</label>
      <select name="month" value={formData.month} onChange={handleChange} required>
        <option value="">Select Month</option>
        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      {/* Date Selection */}
      <label>Date:</label>
      <select name="date" value={formData.date} onChange={handleChange} required>
        <option value="">Select Date</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      {/* Patient Information */}
      <label>Patient Name:</label>
      <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required />

      <label>Patient Mobile:</label>
      <input type="number" name="patientMobile" value={formData.patientMobile} onChange={handleChange} required />

      {/* Day Selection */}
      <label>Select Day:</label>
      <select name="selectedDay" value={formData.selectedDay} onChange={handleChange} required>
        <option value="">Select Day</option>
        {["Day1", "Day2", "Day3"].map((day) => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      {/* File Upload */}
      <label>Upload Images:</label>
      <input type="file" name="images" multiple onChange={handleFileChange} required />

      {/* Upload Progress */}
      {loading && (
        <div>
          <p>Uploading Images...</p>
          <div style={{ width: "100%", backgroundColor: "#f3f3f3", borderRadius: "5px", marginTop: "10px" }}>
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "10px",
                backgroundColor: "#4caf50",
                borderRadius: "5px",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
    </form>
  );
};

export default Form;
