import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Form from "./components/Form";
import "./App.css";

const App = () => {
  const [clinicName, setClinicName] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setClinicName={setClinicName} />} />
        <Route path="/form" element={<Form clinicName={clinicName} />} />
      </Routes>
    </Router>
  );
};

export default App;
