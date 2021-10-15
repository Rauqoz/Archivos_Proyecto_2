const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())

const port = 5300;

app.get('/', (req,res)=>{
    res.send({home:"hola mundo"})
})



app.listen(port, ()=>{
    console.log("server on");
})