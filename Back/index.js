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
var departamentos = ['1','2','3','4','5 '];
var empleados = [ {usuario:'rau', contrasena:'123', fecha_inicio:'30/12/2021', fecha_fin: '', estado:'activo', rol:'admin', dep:'RRHH'}]


app.get('/usuario_actual', (req,res)=>{
    res.send(usuario_actual)
})

app.get('/limpiar_usuario_actual', (req,res)=>{
  usuario_actual = undefined;
  res.send(usuario_actual)
})

app.get('/departamentos', (req,res)=>{
  res.send(departamentos)
})

app.get('/empleados', (req,res)=>{
  res.send(empleados)
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