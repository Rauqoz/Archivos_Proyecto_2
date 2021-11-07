const express = require('express');
const app = express();
const cors = require('cors');
const oracledb = require('oracledb');
const { AQ_DEQ_WAAQ_MSG_DELIV_MODE_PERSISTENTIT_FOREVER } = require('oracledb');
//ORCL18   172.17.0.2
//b6f6af56ce3b
//values

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

var a_deps = [], a_pues = [], a_cate = [],a_requi = [], a_forma = [];

app.post('/c_carga_masiva',(req,res)=>{
  const data = req.body.carga
  c_departamentos(data)

  recorridos_carga_masiva()

  setTimeout(()=>{
    recorridos_carga_masiva_2()
    console.log('enlaces listos');
  },5000)

  res.send({data:'listo'})
})

const recorridos_carga_masiva = ()=>{
  a_deps.forEach(e=>{
    let nombre = e.nombre[0]
    let cap_total = e.capital_total[0]

    query_select_insertar(`select * from departamento where nombre = '${nombre}'`,`insert into departamento (nombre,capital_total) values ('${nombre}',${cap_total})`)
  })

  a_pues.forEach(e=>{
    let nombre = e.nombre[0]
    let salario = e.salario[0]

    query_select_insertar(`select * from puesto where nombre = '${nombre}'`,`insert into puesto (nombre,salario) values ('${nombre}',${salario})`)
  })

  a_cate.forEach(e=>{
    let nombre = e.nombre[0]

    query_select_insertar(`select * from categoria where nombre = '${nombre}'`,`insert into categoria (nombre) values ('${nombre}')`)
  })

  a_requi.forEach(e=>{
    let nombre = e.nombre[0]
    let tamano = e.tamaño[0]
    let obliga = e.obligatorio[0]

    query_select_insertar(`select * from requisito where nombre = '${nombre}'`,`insert into requisito (nombre,tamano,obligatorio) values ('${nombre}',${tamano},'${obliga}')`)
  })

  a_forma.forEach(e=>{
    let nombre = e.nombre[0]

    query_select_insertar(`select * from formato where nombre = '${nombre}'`,`insert into formato (nombre) values ('${nombre}')`)
  })
}

const recorridos_carga_masiva_2 = ()=>{
  a_pues.forEach(pue=>{
    pue.padre.forEach(dep=>{
      query_solo_insertar(`INSERT INTO DEPARTAMENTO_PUESTO VALUES ((SELECT ID_DEPARTAMENTO FROM DEPARTAMENTO d WHERE d.nombre = '${dep.nombre[0]}'), (SELECT ID_PUESTO FROM PUESTO p WHERE p.nombre = '${pue.nombre[0]}'))`)
    })
  })

  a_cate.forEach(cate=>{
    cate.padre.forEach(pue=>{
      query_solo_insertar(`INSERT INTO PUESTO_CATEGORIA VALUES ((SELECT ID_PUESTO FROM PUESTO p WHERE p.NOMBRE = '${pue.nombre[0]}'),(SELECT ID_CATEGORIA FROM CATEGORIA c WHERE c.NOMBRE = '${cate.nombre[0]}'))`)
    })
  })

  a_requi.forEach(requi=>{
    requi.padre.forEach(pue=>{
      query_solo_insertar(`INSERT INTO PUESTO_REQUISITO VALUES ((SELECT ID_PUESTO FROM PUESTO p WHERE p.NOMBRE = '${pue.nombre[0]}'),(SELECT ID_REQUISITO FROM REQUISITO r WHERE r.NOMBRE = '${requi.nombre[0]}'))`)
    })
  })

  a_forma.forEach(forma=>{
    forma.padre.forEach(requi=>{
      query_solo_insertar(`INSERT INTO REQUISITO_FORMATO VALUES ((SELECT ID_REQUISITO FROM REQUISITO r2 WHERE r2.NOMBRE = '${requi.nombre[0]}'),(SELECT ID_FORMATO FROM FORMATO f WHERE f.NOMBRE = '${forma.nombre[0]}'))`)
    })
  })

}

const c_departamentos = (hijo,padre)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        let nombre = e.nombre[0]
        let cap_total = e.capital_total[0]
        //console.log('capital dep:',e.capital_total[0]);
        //console.log('nombre dep:',e.nombre[0]);
        let tempo = a_deps.find(el => el.nombre == nombre)
        if(tempo === undefined){
          a_deps.push(e)
        }

        if(e.departamentos){
          c_departamentos(e.departamentos,hijo)
        }
        if(e.puestos){
          c_puestos(e.puestos,hijo)
        }
      }else{
        c_departamentos(e,hijo)
      }
    })
  }else{
    if(hijo.departamento){
      c_departamentos(hijo.departamento,hijo)
    }else{
      c_departamentos(hijo.departamentos,hijo)
    }
  }
}

const c_puestos =(hijo,padre)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        let nombre = e.nombre[0]
        let salario = e.salario[0]
        //console.log('capital pues:',e.salario[0]);
        //console.log('nombre pues:',e.nombre[0]);
        let tempo = a_pues.find(el => el.nombre == nombre)
        if(tempo === undefined){
          a_pues.push({...e,padre:padre})
        }

        if(e.puestos){
          c_puestos(e.puestos,padre)
        }
        if(e.categorias){
          c_categorias(e.categorias,hijo)
        }
        if(e.requisitos){
          c_requisitos(e.requisitos,hijo)
        }
        
      }else{
        c_puestos(e,padre)
      }
    })
  }else{
    if(hijo.puesto){
      c_puestos(hijo.puesto,padre)
    }else{
      c_puestos(hijo.puestos,padre)
    }
  }

}

const c_categorias = (hijo,padre)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        let nombre = e.nombre[0]
        //console.log('nombre pues:',e.nombre[0]);
        let tempo = a_cate.find(el => el.nombre == nombre)
        if(tempo === undefined){
          a_cate.push({...e,padre:padre})
        }

        if(e.categorias){
          c_categorias(e.categorias,padre)
        }
      }else{
        c_categorias(e,padre)
      }
    })
  }else{
    if(hijo.categoria){
      c_categorias(hijo.categoria,padre)
    }else{
      c_categorias(hijo.categorias,padre)
    }
  }
}

const c_requisitos =(hijo,padre)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        let nombre = e.nombre[0]
        let tamano = e.tamaño[0]
        let obliga = e.obligatorio[0]
        //console.log('nombre pues:',e.nombre[0]);
        //console.log('tamaño pues:',e.tamaño[0]);
        //console.log('obligatorio pues:',e.obligatorio[0]);
        let tempo = a_requi.find(el => el.nombre == nombre)
        if(tempo === undefined){
          a_requi.push({...e,padre:padre})
        }

        if(e.formatos){
          c_formatos(e.formatos,hijo)
        }
      }else{
        c_requisitos(e.requisito,padre)
      }
    })
  }else{
    if(hijo.requisito){
      c_requisitos(hijo.requisito,padre)
    }else{
      c_requisitos(hijo.requisitos,padre)
    }
  }
}

const c_formatos =(hijo,padre)=>{
  if(Array.isArray(hijo)){
    hijo.forEach(e=>{
      if(e.nombre){
        let nombre = e.nombre[0]
        //console.log('nombre pues:',e.nombre[0]);
        let tempo = a_forma.find(el => el.nombre == nombre)
        if(tempo === undefined){
          a_forma.push({...e,padre:padre})
        }

      }else{
        c_formatos(e.formato,padre)
      }
    })
  }else{
    if(hijo.requisito){
      c_formatos(hijo.requisito,padre)
    }else{
      c_formatos(hijo.requisitos,padre)
    }
  }
}

const query_select_insertar =  async(select,insert)=> {
  let conn,retu;
  try {
    conn = await oracledb.getConnection(config_db);
 
    retu = await conn.execute(select);
    if(retu.rows.length === 0){
      retu = await conn.execute(insert)
    }
    conn.commit()
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

const query_solo_insertar =  async(insertar)=> {
  let conn,retu;
  try {
    conn = await oracledb.getConnection(config_db);
 
    retu = await conn.execute(insertar);
    conn.commit()
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.log('err');
      }
      return retu
    }
  }
}

const conexion =  async(consulta)=> {
  let conn,retu;
  try {
    conn = await oracledb.getConnection(config_db);
 
    retu = await conn.execute(consulta);
    conn.commit()
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.log('err');
      }
      return retu
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