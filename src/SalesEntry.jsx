import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';

export const SalesEntry = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [cashOnScreen, setCashOnScreen] = useState('');
  const [cashInCounter, setCashInCounter] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [statusMessage, setStatusMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const employeeNames = ["Nikethan", "Nikhil", "Nithin"];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // Run effect only once after initial render

  const handleSubmission = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!employeeName || !cashOnScreen || !cashInCounter) {
      setStatusMessage('All fields are required.');
      return;
    }

    const formData = {
      Date: date,
      Difference: cashInCounter - cashOnScreen,
      "Employee Name": employeeName,
      "Cash on the Screen": cashOnScreen,
      "Cash in the counter": cashInCounter
    };

    try {
      const response = await fetch('https://api.apispreadsheets.com/data/HuFPiNfuOayU74Sy/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: [formData] })
      });

      if (response.ok) {
        setStatusMessage('Successfully submitted.');
      } else {
        setStatusMessage('Failed to submit.');
      }
    } catch (error) {
      setStatusMessage('Error submitting data.');
    }
  };

  return (
    <div className="container">
      <div className="auth-form-container">
        <div>Date: {date}  Time: {time} </div>
        <h2>My Liquor Stop Sales</h2>
        <form className="login-form" onSubmit={handleSubmission} noValidate>
          <div className="mb-3">
            <label htmlFor="employeeName" className="form-label">Employee Name</label>
            <select
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              id="employeeName"
              name="employeeName"
              className={`form-select ${formSubmitted && employeeName === '' ? 'is-invalid' : ''}`}
              required
            >
              <option value="">Select Employee</option>
              {employeeNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <div className="invalid-feedback">
              Please select an employee.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="cashOnScreen" className="form-label">Cash On the Screen ($)</label>
            <input
              value={cashOnScreen}
              onChange={(e) => setCashOnScreen(e.target.value)}
              type="number"
              placeholder="Enter cash on screen"
              id="cashOnScreen"
              name="cashOnScreen"
              className={`form-control ${formSubmitted && cashOnScreen === '' ? 'is-invalid' : ''}`}
              required
            />
            <div className="invalid-feedback">
              Please enter cash on screen.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="cashInCounter" className="form-label">Cash in the Counter ($)</label>
            <input
              value={cashInCounter}
              onChange={(e) => setCashInCounter(e.target.value)}
              type="number"
              placeholder="Enter cash in counter"
              id="cashInCounter"
              name="cashInCounter"
              className={`form-control ${formSubmitted && cashInCounter === '' ? 'is-invalid' : ''}`}
              required
            />
            <div className="invalid-feedback">
              Please enter cash in counter.
            </div>
          </div>
          {statusMessage && (
            <div className={`alert ${statusMessage.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
              {statusMessage}
            </div>
          )}
          <div className="text-center">
            <button type="submit" className="btn btn-dark">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
