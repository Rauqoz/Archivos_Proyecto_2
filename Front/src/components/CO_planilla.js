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
            },
            {
                label: 'Despedir',
                field: 'despedir',
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
            var filas = result.map((e)=>{
                if(e.estado === 'aceptado'){
                    return { ...e,contratar:<Button color="success" onClick={()=>{ contratado(e)} }>
                Contratar
              </Button>, rechazar:<Button color="danger" onClick={()=>{ rechazado(e)} }>
                    Rechazar
                  </Button>,despedir:<Button color="primary" onClick={()=>{ despedido(e)} }>
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

    const contratado = (dato)=>{
        console.log('el capital maximo es',dato.cap);
        console.log('el vato',dato.nombre, 'fue aceptado ');
    }
    const rechazado = (dato)=>{
        console.log('el vato',dato.nombre, 'fue rechazado');
    }
    const despedido = (dato)=>{
        console.log('el vato',dato.nombre, 'fue despedido');
    }

    return (
        <Fragment>
            <MDBDataTableV5 hover entries={5} pagesAmount={4} data={datos} />
        </Fragment>
    )
}

export default CO_planilla
