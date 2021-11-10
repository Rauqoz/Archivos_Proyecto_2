import React, { Fragment, useState,useEffect } from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import {Button} from "reactstrap";

const RE_aceptar = () => {
    const [datos, setDatos] = useState({})

    useEffect(() => {
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        const columns = [
            {
                label: 'Nombre',
                field: 'nombre',
                sort: 'asc',
                width: 150,
                attributes: {
                'aria-controls': 'DataTable',
                'aria-label': 'nombre',
                },
            },
            {
                label: 'Apellido',
                field: 'apellido',
            },
            {
                label: 'DPI/CUI',
                field: 'dpi',
            },
            {
                label: 'Puesto',
                field: 'puesto',
            },
            {
                label: 'Telefono',
                field: 'telefono',
            },
            {
                label: 'Correo',
                field: 'correo',
            },
            {
                label: 'Estado',
                field: 'estado',
            },
            {
                label: 'Revision',
                field: 'revision',
            },
            {
                label: 'Aceptar',
                field: 'aceptar',
            },
            {
                label: 'Rechazar',
                field: 'rechazar',
            }
            ]
            /*aceptar:<Button color="success" onClick={()=>{ aplicante_aceptado(e)} }>
            Aceptar
          </Button>,*/
        fetch("http://localhost:5300/aplicantes", requestOptions)
        .then(response => response.json())
        .then(result =>{
            var filas = result.aplicantes.map((e)=>{
                if(e.estado === 'pendiente'&& result.usuario_actual.dep === e.dep){
                    return { ...e,revision:<Button color="primary" onClick={()=>{ revisar_docs(e)} } >
                    Revisar Docs
                  </Button>, aceptar:<Button color="warning" onClick={()=>{ volver_aplicante(e)} }>
                    Volver Aplicante
                  </Button>, rechazar:<Button color="danger" onClick={()=>{ aplicante_rechazado(e)} }>
                    Rechazar
                  </Button>}
                }if(e.estado === 'aplicante'&& result.usuario_actual.dep === e.dep){
                  return { ...e,revision:<Button color="primary" onClick={()=>{ revisar_docs(e)} }>
                    Revisar Docs
                  </Button>, aceptar:<Button color="success" onClick={()=>{ aplicante_aceptado(e)} }>
            Aceptar
          </Button>, rechazar:<Button color="danger" onClick={()=>{ aplicante_rechazado(e)} }>
                    Rechazar
                  </Button>}
                }else{
                    return false
                }
            })
            setDatos({columns: columns, rows:filas })
        })
        .catch(error => console.log('error', error));
    }, [])

    const volver_aplicante = async(dato)=>{
        //post
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "aplica": dato
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        await fetch("http://localhost:5300/aaplicante_aplicantes", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

        window.location = '/access/aceptar_aplicantes'
    }
    const aplicante_aceptado = async(dato)=>{
        //post
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "aplica": dato
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        await fetch("http://localhost:5300/a_aplicantes", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

        window.location = '/access/aceptar_aplicantes'
    }
    const aplicante_rechazado = async(dato)=>{
        //post
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "aplica": dato
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        await fetch("http://localhost:5300/r_aplicantes", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
          
        window.location = '/access/aceptar_aplicantes'
    }
    const revisar_docs = async(dato)=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "id": dato.id
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

      await fetch("http://localhost:5300/c_id_revision_docs", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

        var raw2 = JSON.stringify({
          "id": dato
          });
  
          var requestOptions2 = {
          method: 'POST',
          headers: myHeaders,
          body: raw2,
          redirect: 'follow'
          };

      await fetch("http://localhost:5300/c_id_revision_docs_requis", requestOptions2)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

      
        alert(`Revisa Expediente de ${dato.nombre}`)
        window.location = '/access/revision_expedientes'
    }

    return (
        <Fragment>
            <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datos} />
        </Fragment>
    )
}

export default RE_aceptar
