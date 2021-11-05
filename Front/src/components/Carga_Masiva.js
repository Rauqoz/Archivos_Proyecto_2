import React, { Fragment , useState } from 'react'
import { Form ,Button  } from 'react-bootstrap';
import {Input} from 'reactstrap'
import xml2js from 'xml2js'

const Carga_Masiva = () => {
    const [texto, setTexto] = useState('')
    const [carga_beta, setCarga_beta] = useState({})
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
        xml2js.parseString(datos_archivo, (err,res)=>{
            const json = JSON.stringify(res,null,4);
            const tojson = JSON.parse(json)
            setCarga_beta(tojson)
        })
    }

    const cargar_base = ()=> {
        //post
        console.log(carga_beta);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "carga": carga_beta
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:5300/c_carga_masiva", requestOptions)

        setTexto('')
        setCarga_beta({})
    }

    return (
        <Fragment>
            <Form >
                <Form.Group className="mb-3" >
                    <Form.Label>Abrir Archivo</Form.Label>
                    <Form.Control
                        type="file"
                        id="file" acept='.xml'
                        onChange={e=>escoger_archivo(e)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Vista Previa</Form.Label>
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
