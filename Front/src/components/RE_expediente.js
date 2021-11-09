import React, { Fragment,useState,useEffect } from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import {Button} from "reactstrap";

const RE_expediente = () => {
    const [datos, setDatos] = useState({})

    useEffect(() => {
        var id_revision_docs;
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
                label: 'Estado',
                field: 'estado',
            },
            {
                label: 'Motivo Rechazo',
                field: 'motivo',
            },
            {
                label: 'Veces Rechazado',
                field: 'rechazados',
            },
            {
                label: 'Aceptar Doc',
                field: 'aceptar',
            },
            {
                label: 'Rechazar Doc',
                field: 'rechazar',
            },
            {
                label: 'Descargar Doc',
                field: 'descargar',
            }
            ]
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/id_revision_docs", requestOptions)
        .then(response => response.json())
        .then(result =>{
            id_revision_docs = result.id
        })
        .catch(error => console.log('error', error));

        fetch("http://localhost:5300/documentos", requestOptions)
        .then(response => response.json())
        .then(result =>{
            var filas = result.map( (e)=>{
                if(e.id_usuario === id_revision_docs){
                    return { ...e,aceptar:<Button color="success" onClick={()=>{ doc_aceptado(e)} }>
                Aceptar
              </Button>, rechazar:<Button color="danger" onClick={()=>{ doc_rechazado(e)} }>
                    Rechazar
                  </Button>, descargar:<Button color="primary" onClick={()=>{ doc_descargar(e)} }>
                    Descargar
                  </Button>}
                }else{
                    return false
                }
            })
            setDatos({columns: columns, rows:filas })
        })
        .catch(error => console.log('error', error));

    }, [])

    const doc_aceptado = (dato)=>{
        console.log('el vato',dato.nombre, 'fue aceptado ');
    }
    const doc_rechazado = (dato)=>{
        console.log('el vato',dato.nombre, 'fue rechazado');
    }

    const doc_descargar = (dato)=>{
        console.log('descargar doc de', dato.nombre,'en',dato.url);
    }

    return (
        <Fragment>
            <MDBDataTableV5 className='pad' hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datos} />
        </Fragment>
    )
}

export default RE_expediente
