import React, { Fragment, useState,useEffect } from 'react'
import { MDBDataTableV5 } from 'mdbreact';
import { Button } from "reactstrap";

const Puestos = () => {
    const [datos, setDatos] = useState({})

    useEffect(() => {
        const columns = [
            {
                label: 'Puesto',
                field: 'puesto',
                sort: 'asc',
                width: 150,
                attributes: {
                'aria-controls': 'DataTable',
                'aria-label': 'puesto',
                },
            },
            {
                label: 'Salario',
                field: 'salario',
            },
            {
                label: 'Categoria',
                field: 'categoria',
            },
            {
                label: 'Departamento',
                field: 'departamento',
            },
            {
                label: 'Aplicar',
                field: 'aplicar',
            }
            ]
        
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/puestos", requestOptions)
        .then(response => response.json())
        .then(result =>{
            var filas = result.map((e)=>{
                return { ...e,aplicar:<Button color="danger" onClick={()=>{ aplicar_puesto(e)}} href='/aplicacion' >
                Aplicar
                </Button>}
                
            })
            setDatos({columns: columns, rows:filas })
        })
        .catch(error => console.log('error', error));
    }, [])

    const aplicar_puesto = (dato)=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "puesto": dato
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:5300/c_puesto_formulario", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

    return (
        <Fragment>
            <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datos} />
        </Fragment>
    )
}

export default Puestos
