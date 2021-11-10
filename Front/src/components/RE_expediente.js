import React, { Fragment,useState,useEffect } from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import {Button} from "reactstrap";

const RE_expediente = () => {
    const [datos, setDatos] = useState({})
    const [requisitos, setRequisitos] = useState({})
    const [puesto, setPuesto] = useState('')

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
        const columns2 = [
            {
                label: 'Nombre',
                field: 'requi',
                sort: 'asc',
                width: 150,
                attributes: {
                'aria-controls': 'DataTable',
                'aria-label': 'nombre',
                },
            },
            {
                label: 'Formato',
                field: 'forma',
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
                if(e.id_usuario === id_revision_docs ){
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

        fetch("http://localhost:5300/requisitos", requestOptions)
        .then(response => response.json())
        .then(result =>{
            setPuesto(result[0].pues)
            setRequisitos({columns: columns2, rows:result })

        })
        .catch(error => console.log('error', error));

    }, [])

    const doc_aceptado = async(dato)=>{
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

        await fetch("http://localhost:5300/a_documentos", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

        window.location = '/access/revision_expedientes'
    }
    
    const doc_rechazado = async(dato)=>{
        let motivo = prompt('Porque lo Rechazas?')
        if(motivo !== null && motivo !== ''){
            dato.motivo = motivo
            dato.rechazados += 1
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
    
            await fetch("http://localhost:5300/r_documentos", requestOptions)
              .then(response => response.text())
              .then(result => console.log(result))
              .catch(error => console.log('error', error));
            window.location = '/access/revision_expedientes'
        }

    }

    const doc_descargar = (dato)=>{
        alert(`El Doc ${dato.url}`)
    }

    return (
        <Fragment>
            <MDBDataTableV5 hover entries={5} pagesAmount={4} data={datos} />
            <h1>Requisitos del Puesto: {puesto}</h1>
            <MDBDataTableV5 hover entries={5} pagesAmount={4} data={requisitos} />
        </Fragment>
    )
}

export default RE_expediente
