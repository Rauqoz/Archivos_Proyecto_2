import React, { Fragment } from 'react'
import { Form , Button  } from 'react-bootstrap';
import Barra from './Barra';

const Login = () => {
    const usernameRef = React.useRef();
    const passwordRef = React.useRef();
    const rolref = React.useRef();

    const formulario = ()=>{
        console.log(usernameRef.current.value);
        console.log(passwordRef.current.value);
        console.log(rolref.current.value)
    }

    return (
        <Fragment>
            <Barra/>
            <Form >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>User</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    ref={usernameRef}
                />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    ref={passwordRef}
                />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                <Form.Label>Rol</Form.Label>
                <Form.Select ref={rolref}  aria-label="Rol">
                    <option value="aplicante">Aplicante</option>
                    <option value="reclutador">Reclutador</option>
                    <option value="coordinador">Coordinador</option>
                    <option value="admin">Admin</option>
                </Form.Select>
                </Form.Group>
                <Form.Group>
                <Button block='true' size="lg" onClick={formulario}variant='success'>
                Login
                </Button>
                </Form.Group>
            </Form>

        </Fragment>
    )
}

export default Login
