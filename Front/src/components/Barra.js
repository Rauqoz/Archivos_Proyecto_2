import React, { Fragment } from 'react'
import { Navbar,Container,Nav } from 'react-bootstrap';

const Barra = () => {
    return (
        <Fragment>
            <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="">{0}</Navbar.Brand>
                <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: <a href="#login">Mark Otto</a>
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        </Fragment>
    )
}

export default Barra
