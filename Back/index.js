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
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const port = 5300;

//variables internas
//admin reclutador coordinador aplicante
var usuario_actual = {user: 'Rau', rol:'reclutador',name:'Rau', dep:'0'};
//var usuario_actual ;
var departamentos = ['1','2','3','4','5 '];
//activo inactivo
var empleados = [ {id:0, usuario:'rau', contrasena:'123', fecha_inicio:'30/12/2021', fecha_fin: '', estado:'activo', rol:'admin', dep:'RRHH'}]
//contratado despedido rechazado aceptado pendiente 
var aplicantes = [ {id:0,dpi:0,nombre:'rau',apellido:'rau',pusto:'puesto', salario:0, estado:'pendiente' },{id:1,dpi:0,nombre:'g',apellido:'g',pusto:'puesto', salario:0, estado:'aceptado' },{id:2,dpi:0,nombre:'a',apellido:'a',pusto:'puesto', salario:0, estado:'pendiente' },{id:3,dpi:0,nombre:'t',apellido:'t',pusto:'puesto', salario:0, estado:'despedido' }]
//aceptado rechazado pendiente
var documentos = [ {id:0,id_usuario:0,estado:'pendiente',motivo:'0',rechazados:0,url:'0',extension:'0',nombre :'0' },{id:0,id_usuario:0,estado:'pendiente',motivo:'1',rechazados:0,url:'0',extension:'0',nombre :'1' },{id:0,id_usuario:0,estado:'pendiente',motivo:'2',rechazados:0,url:'0',extension:'0',nombre :'2' }]

var id_revision_docs = -1;

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

app.get('/aplicantes', (req,res)=>{
  res.send(aplicantes)
})

app.get('/documentos', (req,res)=>{
  res.send(documentos)
})

app.get('/id_revision_docs', (req,res)=>{
  console.log(id_revision_docs);
  res.send({id: id_revision_docs})
})

app.post('/c_id_revision_docs',(req,res)=>{
  const id_nuevo = req.body.id
  id_revision_docs = id_nuevo
  res.status(200)
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