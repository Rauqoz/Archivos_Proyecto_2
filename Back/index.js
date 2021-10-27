const express = require('express');
const app = express();
const cors = require('cors');
const oracledb = require('oracledb');
//ORCL18   172.17.0.2
//b6f6af56ce3b

const config_db = {
    user : 'dummy',
    password : 'dummy',
    connectString : '172.17.0.2:1521/ORCL18'
}
require('dotenv').config()
app.use(cors())
const port = 5300;

//variables internas
var usuario_actual = {user: 'Rau', rol:'admin',name:'Rau'};
//var usuario_actual ;

app.get('/usuario_actual', (req,res)=>{
    res.send(usuario_actual)
})


app.get('/con', (req,res)=>{
  let datos;
  const conexion =  async()=> {
    let conn;
   
    try {
      conn = await oracledb.getConnection(config_db);
   
      const result = await conn.execute(
        'select * from \"prueba\"'
      );
      datos = result;
      console.log(result);
    } catch (err) {
      console.log(err);
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.log('err');
        }
      }
    }
  }
  conexion()
  res.send({data:"con"})
})

app.listen(port, async ()=>{
    
    console.log("server on");
    
})