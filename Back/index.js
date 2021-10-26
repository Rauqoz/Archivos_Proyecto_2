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
var usuario_actual = '';



app.get('/', (req,res)=>{
    usuario_actual = 18;
    res.send({data:usuario_actual})
})


app.get('/1',(req,res)=>{
  
  res.send({data:usuario_actual})
})




app.get('/con', (req,res)=>{
  const conexion =  async()=> {
    let conn;
   
    try {
      conn = await oracledb.getConnection(config_db);
   
      const result = await conn.execute(
        'select * from \"prueba\"'
      );
   
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