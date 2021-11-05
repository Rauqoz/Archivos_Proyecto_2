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
var usuario_actual = {id: '0', rol:'admin',name:'Rau', dep:'0'};
//var usuario_actual;
var departamentos = ['1','2','3','4','5 '];
//activo inactivo
var empleados = [ {id:0, usuario:'rau', contrasena:'123', fecha_inicio:'30/12/2021', fecha_fin: '', estado:'activo', rol:'admin', dep:'RRHH'}];
//contratado despedido rechazado aceptado pendiente calificador
var aplicantes = [ {id:0,dpi:0,nombre:'rau',apellido:'rau',puesto:'puesto', salario:0, estado:'pendiente', telefono:0,correo:'correo',cap:10 },{id:1,dpi:0,nombre:'g',apellido:'g',puesto:'puesto', salario:0, estado:'aceptado', telefono:0,correo:'correo',cap:10 },{id:2,dpi:0,nombre:'a',apellido:'a',puesto:'puesto', salario:0, estado:'pendiente', telefono:0,correo:'correo',cap:10 },{id:3,dpi:0,nombre:'t',apellido:'t',puesto:'puesto', salario:0, estado:'despedido', telefono:0,correo:'correo',cap:10 }];
//aceptado rechazado pendiente
var documentos = [ {id:0,id_usuario:0,estado:'pendiente',motivo:'0',rechazados:0,url:'0',extension:'0',nombre :'0' },{id:0,id_usuario:0,estado:'pendiente',motivo:'1',rechazados:0,url:'0',extension:'0',nombre :'1' },{id:0,id_usuario:0,estado:'pendiente',motivo:'2',rechazados:0,url:'0',extension:'0',nombre :'2' }];

var puestos = [{id:0,puesto:'puesto 0',salario:10,categoria:'cat 0',departamento:'dep 0'}]

var puesto_formulario;

var requisitos = [ {} ]

var id_revision_docs = -1;

app.get('/usuario_actual', (req,res)=>{
    res.send(usuario_actual)
})

app.get('/limpiar_usuario_actual', (req,res)=>{
  usuario_actual = undefined;
  res.send(usuario_actual)
})

app.get('/departamentos', (req,res)=>{
  //query para seleecionar departamentos
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
  //console.log(id_revision_docs);
  res.send({id: id_revision_docs})
})

app.post('/c_id_revision_docs',(req,res)=>{
  const tempo = req.body.id
  id_revision_docs = tempo
  res.status(200)
})

app.get('/puestos', (req,res)=>{
  res.send(puestos)
})

app.get('/puesto_formulario', (req,res)=>{
  res.send(puesto_formulario)
})

app.post('/c_puesto_formulario', (req,res)=>{
  //console.log(req.body.id);
  const tempo = req.body.id
  puesto_formulario = tempo
  res.status(200)
})

var c_deps = 0,c_pues = 0,c_cate=0,c_requi=0,c_forma=0;


app.post('/c_carga_masiva',(req,res)=>{
  const data = req.body.carga
  const array_prueba = [];
  console.log(data);
  console.log("------");
  c_departamentos(data)
  console.log('departamentos',c_deps);
  console.log('puestos',c_pues);
  console.log('categorias',c_cate);
  console.log('requisitos',c_requi);
  console.log('formatos',c_forma);
  res.send({data:data})
})

const c_departamentos =(hijo)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        c_deps+=1
        console.log('**departamento**');
        console.log('capital dep:',e.capital_total[0]);
        console.log('nombre dep:',e.nombre[0]);
        if(e.departamentos){
          c_departamentos(e.departamentos)
        }
        if(e.puestos){
          c_puestos(e.puestos)
        }
      }else{
        c_departamentos(e)
      }
    })
  }else{
    if(hijo.departamento){
      c_departamentos(hijo.departamento)
    }else{
      c_departamentos(hijo.departamentos)
    }
  }
}

const c_puestos =(hijo)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        c_pues+=1
        console.log('**puesto**');
        console.log('capital pues:',e.salario[0]);
        console.log('nombre pues:',e.nombre[0]);
        if(e.puestos){
          c_puestos(e.puestos)
        }
        if(e.categorias){
          c_categorias(e.categorias)
        }
        if(e.requisitos){
          c_requisitos(e.requisitos)
        }
        
      }else{
        c_puestos(e)
      }
    })
  }else{
    if(hijo.puesto){
      c_puestos(hijo.puesto)
    }else{
      c_puestos(hijo.puestos)
    }
  }

}

const c_categorias =(hijo)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        c_cate+=1
        console.log('**categoria**');
        console.log('nombre pues:',e.nombre[0]);
        if(e.categorias){
          c_categorias(e.categorias)
        }
      }else{
        c_categorias(e)
      }
    })
  }else{
    if(hijo.categoria){
      c_categorias(hijo.categoria)
    }else{
      c_categorias(hijo.categorias)
    }
  }
}

const c_requisitos =(hijo)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        c_requi+=1
        console.log('**requisito**');
        console.log('nombre pues:',e.nombre[0]);
        console.log('obligatorio pues:',e.obligatorio[0]);
        if(e.formatos){
          c_formatos(e.formatos)
        }
      }else{
        c_requisitos(e.requisito)
      }
    })
  }else{
    if(hijo.requisito){
      c_requisitos(hijo.requisito)
    }else{
      c_requisitos(hijo.requisitos)
    }
  }
}

const c_formatos =(hijo)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        c_forma+=1
        console.log('**formato**');
        console.log('nombre pues:',e.nombre[0]);
      }else{
        c_formatos(e.formato)
      }
    })
  }else{
    if(hijo.requisito){
      c_formatos(hijo.requisito)
    }else{
      c_formatos(hijo.requisitos)
    }
  }
}

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