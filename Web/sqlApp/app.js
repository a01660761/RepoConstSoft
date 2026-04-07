const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/consulta', (req, res) => {
    let nombre = req.body.nombre_plato;
    console.log("Nombre recibido:", nombre);

    const connection = mysql.createConnection({
        host: '127.0.0.1', // o la IP correcta donde realmente corre MySQL
        user: 'root',
        password: 'PutaContra$ena12',
        database: 'tienda_gatos'
    });

    connection.connect((err) => {
        if (err) {
            console.error("Error al conectar a MySQL:", err);
            return res.status(500).send("Error de conexión a la base de datos");
        }

        console.log('Connected to MySQL Database!');

        connection.query(
            'SELECT * FROM comidas WHERE nombre_plato = ?',
            [nombre],
            (err, results) => {
                if (err) {
                    console.error("Error en query:", err);
                    connection.end();
                    return res.status(500).send("Error en la consulta");
                }

                console.log(results);
                res.json(results);   // responder aquí
                connection.end();
            }
        );
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});