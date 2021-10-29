import React, { Fragment , useRef } from 'react'
import { Form ,Button  } from 'react-bootstrap';

const Carga_Masiva = () => {
    const ruta_archivo = useRef()
    const archivo_cargado = useRef()
    

    return (
        <Fragment>
            <Form >
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Ruta del Archivo</Form.Label>
                    <Form.Control type="email" ref={ruta_archivo}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Archivo Cargado</Form.Label>
                    <Form.Control  as="textarea" rows={3} ref={archivo_cargado} />
                </Form.Group>
                <Form.Group>
                <Button block='true' size="lg" variant='danger'>
                Abrir Archivo
                </Button>
                <Button block='true' size="lg" variant='success' >
                Cargar a Base
                </Button>
                </Form.Group>
            </Form>
        </Fragment>
    )
    
}

export default Carga_Masiva
