import React, { Fragment } from 'react'
import { Form ,Button  } from 'react-bootstrap';
import Barra from './Barra';

const Login = () => {
    const usernameRef = React.useRef();
    const passwordRef = React.useRef();

    const formulario = ()=>{
        console.log(usernameRef.current.value);
        console.log(passwordRef.current.value);
    }

    return (
        <Fragment>
            <Barra/>
            <Form >
                <Form.Group size="lg" controlId="email">
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
                <Button block='true' size="lg" onClick={formulario}>
                Login
                </Button>
            </Form>

        </Fragment>
    )
}

export default Login
