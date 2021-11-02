import React, { Fragment , useState } from 'react'
import { Form ,Button  } from 'react-bootstrap';
import {Input} from 'reactstrap'

const Carga_Masiva = () => {
    const [texto, setTexto] = useState('')
    let fileReader;
    
    const escoger_archivo = (evento) => {
        //var ruta = '/home/rau/Escritorio/Archivos_Proyecto_2_2S2021/Recursos_Calificacion/'
        var lectura = evento.target.files[0];
        fileReader = new FileReader();
        fileReader.readAsText(lectura);
        fileReader.onloadend = leer_archivo;
    }
    
    const leer_archivo = (e)=>{
        const datos_archivo = fileReader.result;
        setTexto(datos_archivo)
    }

    const cargar_base = ()=> {
        //post
        setTexto('')
    }

    return (
        <Fragment>
            <Form >
                <Form.Group className="mb-3" >
                    <Form.Label>CV - Curriculum</Form.Label>
                    <Form.Control
                        type="file"
                        id="file" acept='.xml'
                        onChange={e=>escoger_archivo(e)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>CV - Curriculum</Form.Label>
                    <Input
                    id="exampleText"
                    name="text"
                    type="textarea"
                    bsSize="sm"
                    disabled
                    value={texto}
                    />
                </Form.Group>
                <Form.Group>
                <Button block='true' size="lg" variant='success' onClick={cargar_base}>
                Cargar a Base
                </Button>
                </Form.Group>
            </Form>
        </Fragment>
    )
    
}

export default Carga_Masiva
