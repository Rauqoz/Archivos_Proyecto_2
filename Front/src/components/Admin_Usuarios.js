import React, { Fragment } from 'react'
import { Navbar,Container,Nav } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import AU_ver from './AU_ver';
import AU_modificar from './AU_modificar';


const Admin_Usuarios = () => {
    return (
        <Fragment>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Administracion Usuarios</Navbar.Brand>
                    <Nav className="me-auto">
                    <Nav.Link href='/access/admin_usuarios/ver'>Ver</Nav.Link>
                    <Nav.Link href='/access/admin_usuarios/crud'>Crud</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                    <Nav className="me-auto">
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Router>
                <Switch>
                <Route path='/access/admin_usuarios/ver' component={AU_ver}/>
                <Route path='/access/admin_usuarios/crud' component={AU_modificar}/>
                </Switch>
            </Router>
        </Fragment>
    )
}

export default Admin_Usuarios
