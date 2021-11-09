import React, { Fragment, useState,useEffect } from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import {Button} from "reactstrap";

const RE_aceptar = () => {
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
                if(e.estado === 'pendiente'){
                    return { ...e,revision:<Button color="primary" onClick={()=>{ revisar_docs(e)} } href='/access/revision_expedientes'>
                    Revisar Docs
                  </Button>,aceptar:<Button color="success" onClick={()=>{ aplicante_aceptado(e)} }>
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

    const aplicante_aceptado = (dato)=>{
        console.log('el vato',dato.nombre, 'fue aceptado ');
    }
    const aplicante_rechazado = (dato)=>{
        console.log('el vato',dato.nombre, 'fue rechazado');
    }
    const revisar_docs = (dato)=>{
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

        fetch("http://localhost:5300/c_id_revision_docs", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        alert(`Revisa Expediente de ${dato.nombre}`)
    }

    return (
        <Fragment>
            <MDBDataTableV5 className='pad' hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datos} />
        </Fragment>
    )
}

export default RE_aceptar
