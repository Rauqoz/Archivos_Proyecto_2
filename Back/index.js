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

app.get('/', (req,res)=>{
    async function runTest() {
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
    runTest()
    res.send({home:"hola mundo"})
})


app.listen(port, async ()=>{
    
    console.log("server on");
    
})