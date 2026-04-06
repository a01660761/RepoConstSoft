const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// app.js


// Create a connection to the database
/*const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'passtest',
    database: 'tienda_gatos'
});*/

// Connect to the database
/*connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');

    // Example query
    connection.query('SELECT * FROM comidas', (err, results, fields) => {
        if (err) throw err;
        console.log(results);
    });

    // Close the connection
    connection.end();
});*/

app.post('/consulta', (req, res) => {     
    let nombre = req.params.nombre_plato;     
    let valores = '';     
    console.log(nombre);  
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'PutaContra$ena12',
        database: 'tienda_gatos'
        });   
    connection.connect((err) => {         
        if (err) throw err;             
        console.log('Connected to MySQL Database!');             
         // Example query             
         connection.query('SELECT * FROM comidas WHERE nombre_plato = ?',[nombre], (err, results, fields) => {        
                     if (err) throw err;  
                    console.log(results); 
                    valores = results; 
                    });
                    // Close the connection     
                     connection.end();     
                     });          
 res.send(valores) 
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});