import React, { Fragment, useEffect, useState } from 'react'
import { Table,Container } from 'react-bootstrap'

const Aplicacion = () => {

    const [puesto, setPuesto] = useState({})

    useEffect(() => {
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/puesto_formulario", requestOptions)
        .then(response => response.json())
        .then(result =>{
            setPuesto(result)
            console.log(result);
        })
        .catch(error => console.log('error', error));
    }, [])

    return (
        <Fragment>
            <Table borderless>
            <thead>
                <tr>
                <th>
                    Datos Puesto
                </th>
                <th>
                    Formulario
                </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">
                <Container>
        
                </Container>
                </th>
                <th scope="row">
                    <Container>

                    </Container>
                </th>
                </tr>
            </tbody>
            </Table>
        </Fragment>
    )
}

export default Aplicacion
