import React, { Fragment,useState,useEffect } from 'react'
import { Navbar,Container,Nav } from 'react-bootstrap';

const Barra = () => {
    const [usuario_actual, setUsuario_actual] = useState(undefined)
    
    useEffect(() => {
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/usuario_actual", requestOptions)
        .then(response => response.json())
        .then(result => setUsuario_actual(result))
        .catch(error => console.log('error', error));
    }, [])

    const salir_logoff = ()=>{
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/limpiar_usuario_actual", requestOptions)
        .then(response => response.json())
        .then(result => setUsuario_actual(result))
        .catch(error => console.log('error', error));
        console.log("log off");
    }

    if(usuario_actual !== undefined){
        switch (usuario_actual.rol) {
            case 'admin':
                return (
                    <Fragment>
                        <Navbar bg="dark" variant="dark">
                        <Container>
                            <Navbar.Brand href='/access '>Admnistrador</Navbar.Brand>
                            <Nav className="me-auto">
                            <Nav.Link href="/access/carga_masiva">Carga Masiva</Nav.Link>
                            <Nav.Link href="/access/admin_usuarios">Administracion de Usuarios</Nav.Link>
                            <Nav.Link href="#">Reportes</Nav.Link>
                            </Nav>
                            <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                logeado como: {usuario_actual.name} - id {usuario_actual.id}
                            </Navbar.Text>
                            <Nav className="me-auto">
                            <Nav.Link onClick={salir_logoff} href="/login">Log Off</Nav.Link>
                            </Nav>
                            </Navbar.Collapse>
                        </Container>
                        </Navbar>
                    </Fragment>
                );
                case 'reclutador':
                    return (
                        <Fragment>
                            <Navbar bg="dark" variant="dark">
                            <Container>
                                <Navbar.Brand href='/access '>Reclutador</Navbar.Brand>
                                <Nav className="me-auto">
                                <Nav.Link href="/access/aceptar_aplicantes">Aceptar o Rechazar Aplicantes</Nav.Link>
                                <Nav.Link href="/access/revision_expedientes">Revision de Expedientes</Nav.Link>
                                <Nav.Link href="/access/chat">Chat con Aplicante</Nav.Link>
                                </Nav>
                                <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text>
                                    logeado como: {usuario_actual.name} - id {usuario_actual.id}
                                </Navbar.Text>
                                <Nav className="me-auto">
                                <Nav.Link onClick={salir_logoff}  href="/login">Log Off</Nav.Link>
                                </Nav>
                                </Navbar.Collapse>
                            </Container>
                            </Navbar>
                        </Fragment>
                    );
                    case 'aplicante':
                        return (
                            <Fragment>
                                <Navbar bg="dark" variant="dark">
                                <Container>
                                    <Navbar.Brand href='/access '>Aplicante</Navbar.Brand>
                                    <Nav className="me-auto">
                                    <Nav.Link href="/">Home</Nav.Link>
                                    <Nav.Link href="#">Revision de Expediente</Nav.Link>
                                    <Nav.Link href="#">Correccion de Expediente</Nav.Link>
                                    <Nav.Link href="/access/chat">Chat con Reclutador</Nav.Link>
                                    </Nav>
                                    <Navbar.Collapse className="justify-content-end">
                                    <Navbar.Text>
                                        logeado como: {usuario_actual.name} - id {usuario_actual.id}
                                    </Navbar.Text>
                                    <Nav className="me-auto">
                                    <Nav.Link onClick={salir_logoff}  href="/login">Log Off</Nav.Link>
                                    </Nav>
                                    </Navbar.Collapse>
                                </Container>
                                </Navbar>
                            </Fragment>
                        );
                        case 'coordinador':
                            return (
                                <Fragment>
                                    <Navbar bg="dark" variant="dark">
                                    <Container>
                                        <Navbar.Brand href='/access '>Coordinador</Navbar.Brand>
                                        <Nav className="me-auto">
                                        <Nav.Link href="/access/admin_planilla">Administracion de Planilla</Nav.Link>
                                        </Nav>
                                        <Navbar.Collapse className="justify-content-end">
                                        <Navbar.Text>
                                            logeado como: {usuario_actual.name} - id {usuario_actual.id}
                                        </Navbar.Text>
                                        <Nav className="me-auto">
                                        <Nav.Link onClick={salir_logoff} href="/login">Log Off</Nav.Link>
                                        </Nav>
                                        </Navbar.Collapse>
                                    </Container>
                                    </Navbar>
                                </Fragment>
                            );
            
            default:
                break;
        }
    }else{
        return (
            <Fragment>
                <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href='/access '>Guest</Navbar.Brand>
                    <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                    <Nav className="me-auto">
                    <Nav.Link href="/login">Login</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </Fragment>
        )
    }
}

export default Barra
