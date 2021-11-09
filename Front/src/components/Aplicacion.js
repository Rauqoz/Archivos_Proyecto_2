import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Table,Container,Form,Button,Navbar,Nav  } from 'react-bootstrap'

const Aplicacion = () => {

    const [puesto, setPuesto] = useState({})
    const [cv_archivo, setCv_archivo] = useState({})
    const dpi = useRef(' ')
    const nombre = useRef(' ')
    const apellido = useRef(' ')
    const correo = useRef(' ')
    const direccion = useRef(' ')
    const telefono = useRef(' ')

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
        })
        .catch(error => console.log('error', error));
    }, [])

    const formulario = ()=>{
        let dpi_f = dpi.current.value
        let nombre_f = nombre.current.value
        let apellido_f = apellido.current.value
        let correo_f = correo.current.value
        let direccion_f = direccion.current.value
        let telefono_f = telefono.current.value
        //post
        let dato = {id_puesto:puesto.id,dpi:dpi_f, nombre: nombre_f, apellido: apellido_f, correo: correo_f,direccion: direccion_f, telefono: telefono_f, cv: cv_archivo.name,dep:puesto.departamento}
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

        fetch("http://localhost:5300/i_aplicantes", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    }

    const escoger_archivo = (file)=>{
        setCv_archivo(file)
    }
    
    
    return (
        <Fragment>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href='/'>Aplicacion</Navbar.Brand>
                    <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                </Container>
                </Navbar>
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
                <Form >
                    <Form.Group className="mb-3" >
                    <Form.Label>Puesto</Form.Label>
                    <Form.Control
                        type="text"
                        disabled
                        value={puesto.puesto}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Salario</Form.Label>
                    <Form.Control
                        type="text"
                        disabled
                        value={puesto.salario}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Categoria</Form.Label>
                    <Form.Control
                        type="text"
                        disabled
                        value={puesto.categoria}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Departamento</Form.Label>
                    <Form.Control
                        type="text"
                        disabled
                        value={puesto.departamento}
                    />
                    </Form.Group>
                </Form>
                </Container>
                </th>
                <th scope="row">
                <Container>
                <Form >
                    <Form.Group className="mb-3" >
                    <Form.Label>DPI/CUI</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        ref={dpi}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        ref={nombre}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                        type="text"
                        ref={apellido}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                        type="text"
                        ref={correo}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Direccion</Form.Label>
                    <Form.Control
                        type="text"
                        ref={direccion}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Telefono</Form.Label>
                    <Form.Control
                        type="text"
                        ref={telefono}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>CV - Curriculum</Form.Label>
                    <Form.Control
                        type="file"
                        id="file"
                        onChange={e=>escoger_archivo(e.target.files[0])}
                    />
                    </Form.Group>
                    <Form.Group>
                    <Button block='true' size="lg" variant='success' onClick={formulario}>
                    Aplicar
                    </Button>
                    </Form.Group>
                </Form>
                </Container>
                </th>
                </tr>
            </tbody>
            </Table>
        </Fragment>
    )
}

export default Aplicacion
