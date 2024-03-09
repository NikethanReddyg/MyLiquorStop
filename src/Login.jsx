import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';

export const Login = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [cashOnScreen, setCashOnScreen] = useState('');
    const [cashInCounter, setCashInCounter] = useState('');
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [statusMessage, setStatusMessage] = useState('');

    const employeeNames = ["Nikethan", "Nikhil", "Nithin"];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []); // Run effect only once after initial render

    const handleSubmission = async (e) => {
        e.preventDefault();

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
                <h2>Sales</h2>
                <div>Date: {date}</div>
                <div>Time: {time}</div>
                <form className="login-form" onSubmit={handleSubmission}>
                    <div className="form-group">
                        <label htmlFor="employeeName">Employee Name</label>
                        <select
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            id="employeeName"
                            name="employeeName"
                            className="form-control"
                        >
                            <option value="">Select Employee</option>
                            {employeeNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cashOnScreen">Cash On the Screen ($)</label>
                        <input
                            value={cashOnScreen}
                            onChange={(e) => setCashOnScreen(e.target.value)}
                            type="number"
                            placeholder="Enter cash on screen"
                            id="cashOnScreen"
                            name="cashOnScreen"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cashInCounter">Cash in the Counter ($)</label>
                        <input
                            value={cashInCounter}
                            onChange={(e) => setCashInCounter(e.target.value)}
                            type="number"
                            placeholder="Enter cash in counter"
                            id="cashInCounter"
                            name="cashInCounter"
                            className="form-control"
                        />
                    </div>
                    {statusMessage && <div className={`alert ${statusMessage.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>{statusMessage}</div>}
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};
