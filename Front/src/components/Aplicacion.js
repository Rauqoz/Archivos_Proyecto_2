import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Table,Container,Form,Button,Navbar,Nav  } from 'react-bootstrap'

const Aplicacion = () => {

    const [puesto, setPuesto] = useState({ })
    const dpi = useRef(' ')
    const nombre = useRef(' ')
    const apellido = useRef(' ')
    const correo = useRef(' ')
    const direccion = useRef(' ')
    const telefono = useRef(' ')
    let fileReader;

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
        console.log(dpi_f,nombre_f,apellido_f,correo_f,direccion_f,telefono_f);
    }

    const escoger_archivo = (file)=>{
        fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onloadend = leer_archivo;
    }
    
    const leer_archivo = (e)=>{
        const datos_archivo = fileReader.result;
        console.log(datos_archivo);
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
                        id="file" acept='.xml'
                        onChange={e=>escoger_archivo(e.target.files[0])}
                    />
                    </Form.Group>
                    <Form.Group>
                    <Button block='true' size="lg" variant='success' onClick={formulario}>
                    Login
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
