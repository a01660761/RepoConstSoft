const express = require('express')
const cors = require('cors')
const app = express()
const port = 3005

app.use(cors())

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
    res.send('hola')
})

app.post('/suma', (req, res) => {
    let x = parseFloat(req.primero);
    let y = parseFloat(req.segundo);
    resultado = x + y;
    res.send(resultado)
})

app.use('coldPic', express.static('ice-man.jpg'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
