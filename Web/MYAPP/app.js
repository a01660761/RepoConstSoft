const express = require('express')
const app = express()
const port = 3005

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/adios', (req, res) => {
    res.send('Bye Bye World!')
})

app.get('/variable/:nombre', (req, res) => {
    let x = req.params.nombre;
    let saludo = "hola ";
    x = saludo + x;
    res.send(x)
})

app.get('/suma', (req, res) => {
    let x = parseFloat(req.params.var1);
    let y = parseFloat(req.params.var2);
    resultado = x + y;
    res.send(resultado)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
