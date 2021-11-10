import React, { Fragment, useState,useEffect } from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import {Button} from "reactstrap";

const CO_planilla = () => {
    const [datos, setDatos] = useState({})

    useEffect(() => {
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
                label: 'Salario',
                field: 'salario',
            },
            {
                label: 'Estado',
                field: 'estado',
            },
            {
                label: 'Contratar',
                field: 'contratar',
            },
            {
                label: 'Rechazar',
                field: 'rechazar',
            }
            ]
        
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/aplicantes", requestOptions)
        .then(response => response.json())
        .then(result =>{
            var filas = result.aplicantes.map((e)=>{
                if(e.estado === 'aceptado' && result.usuario_actual.dep === e.dep){
                    return { ...e,contratar:<Button color="success" onClick={()=>{ contratado(e)} }>
                Contratar
              </Button>, rechazar:<Button color="danger" onClick={()=>{ rechazado(e)} }>
                    Rechazar
                  </Button>}
                }if(e.estado === 'contratado' && result.usuario_actual.dep === e.dep){
                    return { ...e,contratar:<Button color="success" onClick={()=>{ contratado(e)} }>
                Contratar
              </Button>, rechazar: <Button color="primary" onClick={()=>{ despedido(e)} }>
                    Despedir
                  </Button>,}
                }else{
                    return false
                }
            })
            setDatos({columns: columns, rows:filas })
        })
        .catch(error => console.log('error', error));
    }, [])

    const contratado = async(dato)=>{
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

        await fetch("http://localhost:5300/a_aplicantes_c", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

        window.location = '/access/admin_planilla'
    }
    const rechazado = async(dato)=>{
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

        await fetch("http://localhost:5300/r_aplicantes_c", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

        window.location = '/access/admin_planilla'
    }
    const despedido = async(dato)=>{
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

        await fetch("http://localhost:5300/d_aplicantes_c", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

        window.location = '/access/admin_planilla'
    }

    return (
        <Fragment>
            <MDBDataTableV5 hover entries={5} pagesAmount={4} data={datos} />
        </Fragment>
    )
}

export default CO_planilla
