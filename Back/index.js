const express = require('express');
const app = express();
const cors = require('cors');
const oracledb = require('oracledb');
const { AQ_DEQ_WAAQ_MSG_DELIV_MODE_PERSISTENTIT_FOREVER } = require('oracledb');
const { query } = require('express');
const nodemailer = require('nodemailer');
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

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f1b1f7f4b7126f",
    pass: "10acba3830a45e"
  }
});

//variables internas 
//admin reclutador coordinador aplicante
//var usuario_actual = {id: '0', rol:'admin',name:'Rau', dep:'0'};
var usuario_actual;
var departamentos = [];
//activo inactivo
var empleados = [];
//contratado despedido rechazado aceptado pendiente calificador
var aplicantes = [ {id:0,dpi:0,nombre:'rau',apellido:'rau',puesto:'puesto', salario:0, estado:'pendiente', telefono:0,correo:'correo',cap:10,dep:'' }];
//aceptado rechazado pendiente
var documentos = [ {id:0,id_usuario:0,estado:'pendiente',motivo:'0',rechazados:0,url:'0',extension:'0',nombre :'0' }];

var puestos = []

var puesto_formulario;

var requisitos = [ {requi:'',forma:''} ]

var id_revision_docs = -1;

/*ver el pdf <embed
    src={base64}
    type="application/pdf"
    frameBorder="0"
    scrolling="auto"
    height="100%"
    width="100%"
></embed> */

app.get('/admin', async(req,res)=>{
  await query_solo_insertar(`INSERT INTO EMPLEADO (USUARIO,CONTRASENA,FECHA_INICIO,ESTADO,ID_ROL,ID_DEPARTAMENTO) VALUES ('rau','rau',TO_DATE('1996-04-03', 'YY-MM-DD'),'activo',(SELECT ID_ROL FROM ROL r WHERE r.NOMBRE = 'admin'),(SELECT ID_DEPARTAMENTO FROM DEPARTAMENTO d WHERE d.NOMBRE = ''))`)
  res.send(true)
})

app.get('/usuario_actual', (req,res)=>{
    res.send(usuario_actual)
})

app.post('/login', async(req,res)=>{
  //SELECT e.ID_EMPLEADO ,r.NOMBRE ,e.USUARIO,d.NOMBRE FROM EMPLEADO e INNER JOIN ROL r ON r.ID_ROL = e.ID_ROL INNER JOIN DEPARTAMENTO d ON d.ID_DEPARTAMENTO = e.ID_DEPARTAMENTO WHERE e.USUARIO = 'rau' AND e.CONTRASENA = 'rau'
  //SELECT e.ID_EMPLEADO ,r.NOMBRE ,e.USUARIO,d.NOMBRE,e.ESTADO FROM EMPLEADO e INNER JOIN ROL r ON r.ID_ROL = e.ID_ROL INNER JOIN DEPARTAMENTO d ON d.ID_DEPARTAMENTO = e.ID_DEPARTAMENTO WHERE e.USUARIO = '${tempo.user}' AND e.CONTRASENA = '${tempo.pass}' AND r.NOMBRE  = 'aplicante'
  //{id: '0', rol:'admin',name:'Rau', dep:'0'}
  let tempo = req.body.login
  let entro = false
  if(tempo.rol === 'empleado'){

    if(tempo.pass === 'rau' && tempo.user === 'rau'){
      await query_select(`SELECT e.ID_EMPLEADO ,r.NOMBRE ,e.USUARIO,e.ESTADO FROM EMPLEADO e INNER JOIN ROL r ON r.ID_ROL = e.ID_ROL  WHERE e.USUARIO = 'rau' AND e.CONTRASENA = 'rau'`).then(dato=>{
        if(dato.rows.length !== 0){
          dato.rows.forEach(e=>{
            usuario_actual = {id: e[0], rol:e[1],name:e[2], dep:undefined}
            if(e[3] === 'activo'){
              entro = true
            }
          })
        }else{
          usuario_actual = undefined
        }
      })
    }else{
      await query_select(`SELECT e.ID_EMPLEADO ,r.NOMBRE ,e.USUARIO,d.NOMBRE,e.ESTADO FROM EMPLEADO e INNER JOIN ROL r ON r.ID_ROL = e.ID_ROL INNER JOIN DEPARTAMENTO d ON d.ID_DEPARTAMENTO = e.ID_DEPARTAMENTO WHERE e.USUARIO = '${tempo.user}' AND e.CONTRASENA = '${tempo.pass}'`).then(dato=>{
        if(dato.rows.length !== 0){
          dato.rows.forEach(e=>{
            usuario_actual = {id: e[0], rol:e[1],name:e[2], dep:e[3]}
            if(e[4] === 'activo'){
              entro = true
            }
          })
        }else{
          usuario_actual = undefined
        }
      })
    }

  }else{
    await query_select(`SELECT u.ID_USUARIO ,r.NOMBRE , u.NOMBRE FROM USUARIO u INNER JOIN ROL r ON u.ID_ROL = r.ID_ROL WHERE u.DPI = '${tempo.user}' AND u.CONTRASENA  = '${tempo.pass}'`).then(dato=>{
      if(dato.rows.length !== 0){
        dato.rows.forEach(e=>{
          usuario_actual = {id: e[0], rol:e[1],name:e[2], dep:0}
          entro = true
        })
      }else{
        usuario_actual = undefined
      }
    })
  }

  res.send(entro)
})

app.get('/limpiar_usuario_actual', (req,res)=>{
  usuario_actual = undefined;
  res.send(usuario_actual)
})

app.get('/departamentos', async(req,res)=>{
  //query para seleecionar departamentos
  departamentos.splice(0,departamentos.length)
  await query_select('select * from departamento').then(data=>{
    if(data.rows.length !== 0){
      data.rows.forEach(e=>{
        departamentos.push(e[1])
      })
    }
  })
  res.send(departamentos)
})

app.get('/empleados', async(req,res)=>{
  //{id:0, usuario:'rau', contrasena:'123', fecha_inicio:'30/12/2021', fecha_fin: '', estado:'activo', rol:'admin', dep:'RRHH'}
  empleados.splice(0,empleados.length)
  await query_select('SELECT e.ID_EMPLEADO ,e.USUARIO ,e.CONTRASENA ,e.FECHA_INICIO ,e.FECHA_FIN ,e.ESTADO,r.NOMBRE ,d.NOMBRE FROM EMPLEADO e INNER JOIN DEPARTAMENTO d ON d.ID_DEPARTAMENTO = e.ID_DEPARTAMENTO INNER JOIN ROL r ON r.ID_ROL = e.ID_ROL').then(data=>{
    if(data.rows.length !== 0){
      data.rows.forEach(e=>{
        empleados.push({id:e[0],usuario:e[1],contrasena:e[2],fecha_inicio:e[3],fecha_fin:e[4],estado:e[5],rol:e[6],dep:e[7]})
      })
    }
  })
  res.send(empleados)
})

app.post('/i_empleados', async(req,res)=>{
  //INSERT INTO EMPLEADO (USUARIO,CONTRASENA,FECHA_INICIO,ESTADO,ID_ROL,ID_DEPARTAMENTO) VALUES ('rau','rau',TO_DATE('1996-04-03', 'YY-MM-DD'),'activo',(SELECT ID_ROL FROM ROL r WHERE r.NOMBRE = 'admin'),(SELECT ID_DEPARTAMENTO FROM DEPARTAMENTO d WHERE d.NOMBRE = '??REA DE DESARROLLO'))
  let tempo = req.body.emple
  await query_solo_insertar(`INSERT INTO EMPLEADO (USUARIO,CONTRASENA,FECHA_INICIO,ESTADO,ID_ROL,ID_DEPARTAMENTO) VALUES ('${tempo.usuario}','${tempo.contrasena}',TO_DATE('${tempo.fecha_inicio}', 'YY-MM-DD'),'${tempo.estado}',(SELECT ID_ROL FROM ROL r WHERE r.NOMBRE = '${tempo.rol}'),(SELECT ID_DEPARTAMENTO FROM DEPARTAMENTO d WHERE d.NOMBRE = '${tempo.dep}'))`)
  res.send(true)
})

app.post('/m_empleados', async(req,res)=>{
  //UPDATE EMPLEADO SET USUARIO = 'ggefaeg', CONTRASENA = 'gege', ID_ROL = (SELECT ID_ROL FROM ROL r WHERE r.NOMBRE = 'admin'), ID_DEPARTAMENTO = (SELECT ID_DEPARTAMENTO FROM DEPARTAMENTO d WHERE d.NOMBRE = 'COORDINACI??N DE DESARROLLO DE SISTEMAS') WHERE ID_EMPLEADO  = '28'
  let tempo = req.body.emple
  await query_solo_insertar(`UPDATE EMPLEADO SET USUARIO = '${tempo.usuario}', CONTRASENA = '${tempo.contrasena}', ID_ROL = (SELECT ID_ROL FROM ROL r WHERE r.NOMBRE = '${tempo.rol}'), ID_DEPARTAMENTO = (SELECT ID_DEPARTAMENTO FROM DEPARTAMENTO d WHERE d.NOMBRE = '${tempo.dep}') WHERE ID_EMPLEADO  = '${tempo.id}'`)
  res.send(true)
})

app.post('/e_empleados', async(req,res)=>{
  //UPDATE EMPLEADO SET ESTADO = 'inactivo' WHERE ID_EMPLEADO = ''
  let tempo = req.body.emple
  await query_solo_insertar(`UPDATE EMPLEADO SET ESTADO = 'inactivo', FECHA_FIN = TO_DATE('${tempo.fecha_fin}', 'YY-MM-DD') WHERE ID_EMPLEADO = '${tempo.id}'`)
  res.send(true)
})

app.get('/aplicantes', async(req,res)=>{
  //{id:0,dpi:0,nombre:'rau',apellido:'rau',puesto:'puesto', salario:0, estado:'pendiente', telefono:0,correo:'correo',cap:10 }
  aplicantes.splice(0,aplicantes.length)
  await query_select(`SELECT u.ID_USUARIO ,u.DPI ,u.NOMBRE ,u.APELLIDO,p.NOMBRE ,p.SALARIO , up.ESTADO , u.TELEFONO ,u.CORREO,d.CAPITAL_TOTAL,d.NOMBRE FROM USUARIO u INNER JOIN USUARIO_PUESTO up ON up.ID_USUARIO = u.ID_USUARIO INNER JOIN PUESTO p ON p.ID_PUESTO = up.ID_PUESTO INNER JOIN DEPARTAMENTO_PUESTO dp ON dp.ID_PUESTO = p.ID_PUESTO INNER JOIN DEPARTAMENTO d ON d.ID_DEPARTAMENTO = dp.ID_DEPARTAMENTO`).then(data=>{
    if(data.rows.length !== 0){
      data.rows.forEach(e=>{
        aplicantes.push({id:e[0],dpi:e[1],nombre:e[2],apellido:e[3],puesto:e[4], salario:e[5], estado:e[6], telefono:e[7],correo:e[8],cap:e[9],dep:e[10] })
      })
    }
  })
  res.send({aplicantes,usuario_actual})
})

app.post('/i_aplicantes', async(req,res)=>{
  //INSERT INTO USUARIO (ID_ROL,PRIMER_LOG,DPI,NOMBRE,APELLIDO,CORREO,DIRECCION,TELEFONO,ID_EMPLEADO,CONTRASENA) VALUES ((SELECT ID_ROL FROM ROL r WHERE r.NOMBRE = 'guest'), 'si',10, 'ed','ape','cor','dir',10,(SELECT ID_EMPLEADO FROM EMPLEADO e INNER JOIN ROL r2 ON r2.ID_ROL = e.ID_ROL INNER JOIN DEPARTAMENTO d ON d.ID_DEPARTAMENTO = e.ID_DEPARTAMENTO WHERE r2.NOMBRE = 'reclutador' AND d.NOMBRE = '??REA DE DESARROLLO'), '123')
  //INSERT INTO USUARIO_PUESTO (ID_USUARIO,ID_PUESTO,CALIFICACION,ESTADO) VALUES ((SELECT ID_USUARIO FROM USUARIO u WHERE u.DPI = ''),'',0,'pendiente')
  //INSERT INTO DOCUMENTO (ID_USUARIO,ESTADO,MOTIVO,RECHAZOS,URL,EXTENSION,NOMBRE) VALUES ((SELECT ID_USUARIO FROM USUARIO u WHERE u.DPI = ''), 'pendiente',' ',0,'url','extension','nombre')
  let tempo = req.body.aplica
  let random = parseInt(Math.random() * (999 - 100) + 100);
  let extesion_doc = tempo.cv.split('.')[1]
  //tabla usuario
  await query_solo_insertar(`INSERT INTO USUARIO (ID_ROL,PRIMER_LOG,DPI,NOMBRE,APELLIDO,CORREO,DIRECCION,TELEFONO,ID_EMPLEADO,CONTRASENA) VALUES ((SELECT ID_ROL FROM ROL r WHERE r.NOMBRE = 'guest'), 'si','${tempo.dpi}', '${tempo.nombre}','${tempo.apellido}','${tempo.correo}','${tempo.direccion}','${tempo.telefono}',(SELECT ID_EMPLEADO FROM EMPLEADO e INNER JOIN ROL r2 ON r2.ID_ROL = e.ID_ROL INNER JOIN DEPARTAMENTO d ON d.ID_DEPARTAMENTO = e.ID_DEPARTAMENTO WHERE r2.NOMBRE = 'reclutador' AND d.NOMBRE = '${tempo.dep}' AND e.ESTADO = 'activo'), '${random}')`)
  //tabla usuario puesto
  await query_solo_insertar(`INSERT INTO USUARIO_PUESTO (ID_USUARIO,ID_PUESTO,CALIFICACION,ESTADO) VALUES ((SELECT ID_USUARIO FROM USUARIO u WHERE u.DPI = '${tempo.dpi}'),'${tempo.id_puesto}',0,'pendiente')`)
  //tabla documento
  await query_solo_insertar(`INSERT INTO DOCUMENTO (ID_USUARIO,ESTADO,MOTIVO,RECHAZOS,URL,EXTENSION,NOMBRE) VALUES ((SELECT ID_USUARIO FROM USUARIO u WHERE u.DPI = '${tempo.dpi}'), 'pendiente',' ',0,'${tempo.cv}','${extesion_doc}','${tempo.doc_nombre}')`)
  res.send(true)
})

app.post('/aaplicante_aplicantes', async(req,res)=>{
  //UPDATE USUARIO_PUESTO up SET up.ESTADO = 'aplicante' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '123')
  let tempo = req.body.aplica
  let user, pass,email = false;
  await query_select(`SELECT * FROM USUARIO u WHERE u.DPI = '${tempo.dpi}'`).then(datos=>{
    if(datos.rows.length !== 0){
      datos.rows.forEach(e=>{
        user = e[3];
        pass = e[10];
        email = true;
      })
    }
  })
  if(email){
    await transporter.sendMail({
      from: '"Reclutamiento" <reclutadores@example.com>', // sender address
      to: `${tempo.correo}, ${tempo.correo}`, // list of receivers
      subject: `Aplicante ${tempo.id}???`, // Subject line
      text: `Felicidades ${tempo.nombre} ${tempo.apellido} ahora eres un aplicante, usuario ${user} y tu contrase??a es ${pass}`, // plain text body
    });
  }

  await query_select(`UPDATE USUARIO_PUESTO up SET up.ESTADO = 'aplicante' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '${tempo.dpi}')`)
  await query_select(`UPDATE USUARIO u SET u.ID_ROL = (SELECT ID_ROL FROM ROL r WHERE r.NOMBRE = 'aplicante') WHERE u.DPI  = '${tempo.dpi}'`)

  res.send(true)
})

app.post('/a_aplicantes', async(req,res)=>{
  //UPDATE USUARIO_PUESTO up SET up.ESTADO = 'aceptado' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '123')
  let tempo = req.body.aplica
  await query_select(`UPDATE USUARIO_PUESTO up SET up.ESTADO = 'aceptado' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '${tempo.dpi}')`)
  res.send(true)
})

app.post('/r_aplicantes', async(req,res)=>{
  //UPDATE USUARIO_PUESTO up SET up.ESTADO = 'rechazado' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '123')
  let tempo = req.body.aplica
  await query_select(`UPDATE USUARIO_PUESTO up SET up.ESTADO = 'rechazado' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '${tempo.dpi}')`)
  res.send(true)
})

app.post('/a_aplicantes_c', async(req,res)=>{
  //UPDATE USUARIO_PUESTO up SET up.ESTADO = 'contratado' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '123')
  let tempo = req.body.aplica
  let user, pass,email = false;
  await query_select(`SELECT * FROM USUARIO u WHERE u.DPI = '${tempo.dpi}'`).then(datos=>{
    if(datos.rows.length !== 0){
      datos.rows.forEach(e=>{
        user = e[3];
        pass = e[10];
        email = true;
      })
    }
  })
  if(email){
    await transporter.sendMail({
      from: '"Reclutamiento" <reclutadores@example.com>', // sender address
      to: `${tempo.correo}, ${tempo.correo}`, // list of receivers
      subject: `Aplicante ${tempo.id}???`, // Subject line
      text: `Felicidades ${tempo.nombre} ${tempo.apellido} ahora eres parte del equipo con el puesto ${tempo.puesto} y tu salario de ${tempo.salario}`, // plain text body
    });
  }
  await query_select(`UPDATE USUARIO_PUESTO up SET up.ESTADO = 'contratado' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '${tempo.dpi}')`)
  res.send(true)
})

app.post('/r_aplicantes_c', async(req,res)=>{
  //UPDATE USUARIO_PUESTO up SET up.ESTADO = 'rechazado' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '123')
  let tempo = req.body.aplica
  await query_select(`UPDATE USUARIO_PUESTO up SET up.ESTADO = 'rechazado' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '${tempo.dpi}')`)
  res.send(true)
})

app.post('/d_aplicantes_c', async(req,res)=>{
  //UPDATE USUARIO_PUESTO up SET up.ESTADO = 'despedido' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '123')
  let tempo = req.body.aplica
  await query_select(`UPDATE USUARIO_PUESTO up SET up.ESTADO = 'despedido' WHERE up.ID_USUARIO = (SELECT u.ID_USUARIO FROM USUARIO u WHERE u.DPI = '${tempo.dpi}')`)
  res.send(true)
})

app.get('/documentos', async(req,res)=>{
  //{id:0,id_usuario:0,estado:'pendiente',motivo:'0',rechazados:0,url:'0',extension:'0',nombre :'0' }
  documentos.splice(0,documentos.length)
  await query_select(`SELECT * FROM DOCUMENTO`).then(data=>{
    if(data.rows.length !== 0){
      data.rows.forEach(e=>{
        documentos.push({id:e[0],id_usuario:e[1],estado:e[2],motivo:e[3],rechazados:e[4],url:e[5],extension:e[6],nombre :e[7] })
      })
    }
  })
  res.send(documentos)
})

app.post('/a_documentos', async(req,res)=>{
  //UPDATE DOCUMENTO d SET d.ESTADO = 'aceptado' WHERE d.ID_DOCUMENTO = ''
  let tempo = req.body.aplica
  await query_select(`UPDATE DOCUMENTO d SET d.ESTADO = 'aceptado' WHERE d.ID_DOCUMENTO = '${tempo.id}'`)
  res.send(true)
})

app.post('/r_documentos', async(req,res)=>{
  //UPDATE DOCUMENTO d SET d.ESTADO = 'rechazado', d.MOTIVO = '', d.RECHAZOS  = '' WHERE d.ID_DOCUMENTO = ''
  let tempo = req.body.aplica

  let user, pass,correo,email = false;
  await query_select(`SELECT * FROM USUARIO u WHERE u.ID_USUARIO = '${tempo.id_usuario}'`).then(datos=>{
    if(datos.rows.length !== 0){
      datos.rows.forEach(e=>{
        user = e[3];
        pass = e[10];
        correo = e[6]
        email = true;
      })
    }
  })
  if(email){
    await transporter.sendMail({
      from: '"Reclutamiento" <reclutadores@example.com>', // sender address
      to: `${correo}, ${correo}`, // list of receivers
      subject: `Aplicante ${tempo.id_usuario}???`, // Subject line
      text: `Lastimosamente tu Documento ${tempo.nombre} fue Rechazado por ${tempo.motivo} con este rechazo es la ${tempo.rechazados} era. vez`, // plain text body
    });
  }
  
  await query_select(`UPDATE DOCUMENTO d SET d.ESTADO = 'rechazado', d.MOTIVO = '${tempo.motivo}', d.RECHAZOS  = '${tempo.rechazados}' WHERE d.ID_DOCUMENTO = '${tempo.id}'`)
  res.send(true)
})

app.get('/id_revision_docs', (req,res)=>{
  //console.log(id_revision_docs);
  res.send({id: id_revision_docs})
})

app.post('/c_id_revision_docs',(req,res)=>{
  const tempo = req.body.id
  id_revision_docs = tempo
  res.send(true)
})

app.post('/c_id_revision_docs_requis', async(req,res)=>{
  //SELECT r.NOMBRE ,f.NOMBRE FROM REQUISITO r INNER JOIN  REQUISITO_FORMATO rf ON rf.ID_REQUISITO = r.ID_REQUISITO INNER JOIN FORMATO f ON f.ID_FORMATO = rf.ID_FORMATO INNER JOIN PUESTO_REQUISITO pr ON pr.ID_REQUISITO = r.ID_REQUISITO INNER JOIN PUESTO p ON p.ID_PUESTO = pr.ID_PUESTO WHERE p.NOMBRE = ''
  requisitos.splice(0,requisitos.length)
  const tempo = req.body.id
  await query_select(`SELECT r.NOMBRE ,f.NOMBRE FROM REQUISITO r INNER JOIN  REQUISITO_FORMATO rf ON rf.ID_REQUISITO = r.ID_REQUISITO INNER JOIN FORMATO f ON f.ID_FORMATO = rf.ID_FORMATO INNER JOIN PUESTO_REQUISITO pr ON pr.ID_REQUISITO = r.ID_REQUISITO INNER JOIN PUESTO p ON p.ID_PUESTO = pr.ID_PUESTO WHERE p.NOMBRE = '${tempo.puesto}'`).then(datos=>{
    if(datos.rows.length !== 0){
      datos.rows.forEach(e=>{
        requisitos.push({requi: e[0],forma: e[1],pues: tempo.puesto})
      })
    }
  })
  res.send(true)
})

app.get('/a_para_chat_emple', async(req,res)=>{
  //SELECT u.ID_USUARIO FROM USUARIO u WHERE u.ID_EMPLEADO = '42'
  let para_chatear = []
  await query_select(`SELECT u.ID_USUARIO FROM USUARIO u WHERE u.ID_EMPLEADO = '${usuario_actual.id}'`).then(datos=>{
    if(datos.rows.length !== 0){
      datos.rows.forEach(e=>{
        para_chatear.push(e[0])
      })
    }
  })
  res.send(para_chatear)
})

app.get('/requisitos', async(req,res)=>{
  res.send(requisitos)
})

app.get('/puestos', async(req,res)=>{
  //{id:0,puesto:'puesto 0',salario:10,categoria:'cat 0',departamento:'dep 0'}
  puestos.splice(0,puestos.length)
  await query_select('SELECT p.ID_PUESTO,p.NOMBRE,p.SALARIO,c.NOMBRE, d.NOMBRE FROM PUESTO p INNER JOIN DEPARTAMENTO_PUESTO dp ON p.ID_PUESTO = dp.ID_PUESTO INNER JOIN DEPARTAMENTO d ON dp.ID_DEPARTAMENTO = d.ID_DEPARTAMENTO INNER JOIN PUESTO_CATEGORIA pc ON pc.ID_PUESTO = p.ID_PUESTO INNER JOIN CATEGORIA c ON c.ID_CATEGORIA = pc.ID_CATEGORIA').then(data=>{
    if(data.rows.length !== 0){
      data.rows.forEach(e=>{
        puestos.push({id:e[0],puesto:e[1],salario:e[2],categoria:e[3],departamento:e[4]})
      })
    }
  })
  res.send(puestos)
})

app.get('/puesto_formulario', (req,res)=>{
  res.send(puesto_formulario)
})

app.post('/c_puesto_formulario',(req,res)=>{
  //console.log(req.body.id);
  const tempo = req.body.puesto
  puesto_formulario = tempo
  res.send(true)
})

var a_deps = [], a_pues = [], a_cate = [],a_requi = [], a_forma = [];
var a_pues_deps = [], a_cate_pues = [], a_requi_pues = [], a_forma_requi = [];

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
    let tamano = e.tama??o[0]
    let obliga = e.obligatorio[0]

    query_select_insertar(`select * from requisito where nombre = '${nombre}'`,`insert into requisito (nombre,tamano,obligatorio) values ('${nombre}',${tamano},'${obliga}')`)
  })

  a_forma.forEach(e=>{
    let nombre = e.nombre[0]

    query_select_insertar(`select * from formato where nombre = '${nombre}'`,`insert into formato (nombre) values ('${nombre}')`)
  })
}

const recorridos_carga_masiva_2 = ()=>{

  a_pues_deps.forEach(pue=>{
    query_solo_insertar(`INSERT INTO DEPARTAMENTO_PUESTO VALUES ((SELECT ID_DEPARTAMENTO FROM DEPARTAMENTO d WHERE d.nombre = '${pue.padre[0]}'), (SELECT ID_PUESTO FROM PUESTO p WHERE p.nombre = '${pue.nombre[0]}'))`)
  })

  a_cate_pues.forEach(cate=>{
    query_solo_insertar(`INSERT INTO PUESTO_CATEGORIA VALUES ((SELECT ID_PUESTO FROM PUESTO p WHERE p.NOMBRE = '${cate.padre[0]}'),(SELECT ID_CATEGORIA FROM CATEGORIA c WHERE c.NOMBRE = '${cate.nombre[0]}'))`)
  })

  a_requi_pues.forEach(requi=>{
    query_solo_insertar(`INSERT INTO PUESTO_REQUISITO VALUES ((SELECT ID_PUESTO FROM PUESTO p WHERE p.NOMBRE = '${requi.padre[0]}'),(SELECT ID_REQUISITO FROM REQUISITO r WHERE r.NOMBRE = '${requi.nombre[0]}'))`)
  })

  a_forma_requi.forEach(forma=>{
    query_solo_insertar(`INSERT INTO REQUISITO_FORMATO VALUES ((SELECT ID_REQUISITO FROM REQUISITO r2 WHERE r2.NOMBRE = '${forma.padre[0]}'),(SELECT ID_FORMATO FROM FORMATO f WHERE f.NOMBRE = '${forma.nombre[0]}'))`)
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
          c_departamentos(e.departamentos,padre)
        }
        if(e.puestos){
          c_puestos(e.puestos,e)
        }
      }else{
        c_departamentos(e,padre)
      }
    })
  }else{
    if(hijo.departamento){
      c_departamentos(hijo.departamento,padre)
    }else{
      c_departamentos(hijo.departamentos,padre)
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
          a_pues.push(e)
        }
        a_pues_deps.push({...e,padre:padre.nombre})

        if(e.puestos){
          c_puestos(e.puestos,padre)
        }
        if(e.categorias){
          c_categorias(e.categorias,e)
        }
        if(e.requisitos){
          c_requisitos(e.requisitos,e)
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
          a_cate.push(e)
        }
        a_cate_pues.push({...e,padre:padre.nombre})

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
        let tamano = e.tama??o[0]
        let obliga = e.obligatorio[0]
        //console.log('nombre pues:',e.nombre[0]);
        //console.log('tama??o pues:',e.tama??o[0]);
        //console.log('obligatorio pues:',e.obligatorio[0]);
        let tempo = a_requi.find(el => el.nombre == nombre)
        if(tempo === undefined){
          a_requi.push(e)
        }

        let pre = {...e,padre:padre.nombre}
        let tempo2 = a_requi_pues.find(el => {
          if(el.nombre[0] == pre.nombre[0] && el.padre[0] == pre.padre[0]){
            return true
          }
        })
        if(tempo2 === undefined){
          a_requi_pues.push({...e,padre:padre.nombre})
        }

        if(e.formatos){
          c_formatos(e.formatos,e)
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
          a_forma.push(e)
        }
        let pre = {...e,padre:padre.nombre}
        let tempo2 = a_forma_requi.find(el => {
          if(el.nombre[0] == pre.nombre[0] && el.padre[0] == pre.padre[0]){
            return true
          }
        })
        if(tempo2 === undefined){
          a_forma_requi.push({...e,padre:padre.nombre})
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

const query_select =  async(select)=> {
  let conn,retu;
  try {
    conn = await oracledb.getConnection(config_db);
 
    retu = await conn.execute(select);
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

const server_rau = app.listen(port,()=>{
    console.log("server on");
})

const io = require('socket.io')(server_rau, {
  cors: {
    origin: "http://localhost:3000/",
  }
});

io.on("connection", (socket) => {

  socket.on('traer_chat', async(dato)=>{
    if(dato.rol == 'aplicante'){
      let mensajes = [], id_emple;
      let si_tiene_chat = false;
      await query_select(`SELECT c.ID_EMPLEADO ,c.ID_USUARIO , c.MENSAJE ,c.FECHA,e.USUARIO , u.NOMBRE FROM CHAT c INNER JOIN USUARIO u ON u.ID_USUARIO = c.ID_USUARIO INNER JOIN EMPLEADO e ON e.ID_EMPLEADO = c.ID_EMPLEADO WHERE u.ID_USUARIO = '${dato.id}'`).then(respu=>{
        if(respu.rows.length !== 0){
          respu.rows.forEach(e=>{
            mensajes.push({id_e: e[0], id_a: e[1], mensaje: e[2], fecha: e[3], empleado: e[4], aplicante: e[5]})
            id_emple = e[0];
          })
          si_tiene_chat = true;
          socket.emit('recibir_chat', {mensajes,id_emple})
        }
      })

      if(!si_tiene_chat){
        await query_select(`SELECT u.ID_EMPLEADO FROM USUARIO u WHERE u.ID_USUARIO  = '${dato.id}'`).then(respu=>{
          if(respu.rows.length !== 0){
            respu.rows.forEach(e=>{
              id_emple = e[0];
            })
            si_tiene_chat = true;
            socket.emit('recibir_chat', {mensajes,id_emple})
          }
        })
      }
    }else if(dato.rol == 'reclutador'){
      let mensajes = [], id_emple;
      let si_tiene_chat = false;
      await query_select(`SELECT c.ID_EMPLEADO ,c.ID_USUARIO , c.MENSAJE ,c.FECHA,e.USUARIO , u.NOMBRE FROM CHAT c INNER JOIN USUARIO u ON u.ID_USUARIO = c.ID_USUARIO INNER JOIN EMPLEADO e ON e.ID_EMPLEADO = c.ID_EMPLEADO WHERE e.ID_EMPLEADO  = '${dato.id}' AND u.ID_USUARIO = '${dato.id_a}'`).then(respu=>{
        if(respu.rows.length !== 0){
          respu.rows.forEach(e=>{
            mensajes.push({id_e: e[0], id_a: e[1], mensaje: e[2], fecha: e[3], empleado: e[4], aplicante: e[5]})
            id_emple = e[1];
          })
          si_tiene_chat = true;
          socket.emit('recibir_chat', {mensajes,id_emple})
        }
      })
    } 
    
  })

  socket.on('insertar_chat', async(dato)=>{
    await query_solo_insertar(`INSERT INTO CHAT VALUES ((SELECT e.ID_EMPLEADO FROM EMPLEADO e WHERE e.ID_EMPLEADO = '${dato.id_e}'),(SELECT u.ID_USUARIO FROM USUARIO u WHERE u.ID_USUARIO  = '${dato.id_a}'),'${dato.mensaje}',TO_DATE('${dato.fecha}', 'YY-MM-DD'))`).then(respu=>{
      socket.emit('actualizar')
    })
  })
});
