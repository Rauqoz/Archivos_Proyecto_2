import React, { Fragment, useRef } from 'react'
import { Form , Button  } from 'react-bootstrap';
import Barra from './Barra';

const Login = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const rolref = useRef();

    const formulario = async()=>{
        let user = usernameRef.current.value
        let pass = passwordRef.current.value
        let rol = rolref.current.value
        let dato = {user:user,pass:pass,rol:rol}
        let entro = false
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "login": dato
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        await fetch("http://localhost:5300/login", requestOptions)
          .then(response => response.json())
          .then(result => {
            entro = result
          })
          .catch(error => console.log('error', error));

        if(entro){
            window.location = '/access'
        }else{
            alert('Revisa tus datos hijo')
            usernameRef.current.value = ''
            passwordRef.current.value = ''
        }
    }

    return (
        <Fragment>
            <Barra/>
            <Form  className='pad'>
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
