// Server-side code (Node.js with vanilla HTTP)

const http = require('http');
const fs = require('fs');
const XLSX = require('xlsx');
const cors = require('cors');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/submitForm') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const formData = JSON.parse(body);

            const { employeeName, cashOnScreen, cashInCounter, date } = formData;

            const filename = 'My_Liquor_Stop_Sales.xlsx';

            // Read existing workbook
            const workbook = XLSX.readFile(filename);
            const worksheet = workbook.Sheets['My Liquor Stop Sales'];

            // Find the next empty row
            const nextRow = worksheet['!ref'].split(':')[1].match(/[0-9]+/)[0];

            // Append new data to the worksheet
            worksheet[`A${nextRow}`] = { t: 's', v: date }; // Date
            worksheet[`B${nextRow}`] = { t: 's', v: employeeName }; // Employee Name
            worksheet[`C${nextRow}`] = { t: 'n', v: cashOnScreen }; // Cash on the Screen
            worksheet[`D${nextRow}`] = { t: 'n', v: cashInCounter }; // Cash in the Counter
            worksheet[`E${nextRow}`] = { t: 'n', v: cashInCounter - cashOnScreen }; // Difference

            // Write the updated workbook to the file
            XLSX.writeFile(workbook, filename);

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Data saved successfully.');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found.');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
