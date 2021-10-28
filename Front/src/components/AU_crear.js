import React, { Fragment, useEffect, useState } from 'react'
import { Form ,Button  } from 'react-bootstrap';


const AU_crear = () => {
    
    const [departamentos, setDepartamentos] = useState([])

    useEffect(() => {
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/departamentos", requestOptions)
        .then(response => response.json())
        .then(result => setDepartamentos(result))
        .catch(error => console.log('error', error));
    }, [])

    return (
        <Fragment>
            <Form >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>User</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    
                />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    
                />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                <Form.Label>Rol</Form.Label>
                <Form.Select  aria-label="Rol">
                    <option value="reclutador">Reclutador</option>
                    <option value="coordinador">Coordinador</option>
                </Form.Select>
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                <Form.Label>Departamentos</Form.Label>
                <Form.Select  aria-label="Rol">
                {
                    departamentos.map((e, i) => {
                        return (<option key={i} value={e}>{e}</option>)
                    })
                }
                </Form.Select>
                </Form.Group>
                <Form.Group>
                <Button block='true' size="lg" variant='success'>
                Crear
                </Button>
                </Form.Group>
            </Form>
        </Fragment>
    )
}

export default AU_crear
