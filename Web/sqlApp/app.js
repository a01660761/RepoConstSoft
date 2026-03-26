const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const app = express()
const port = 3005

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// app.js


// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PutaContra$ena12',
    database: 'tienda'
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');

    // Example query
    connection.query('SELECT * FROM cliente', (err, results, fields) => {
        if (err) throw err;
        console.log(results);
    });

    // Close the connection
    connection.end();
});