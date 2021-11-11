import React, { Fragment, useEffect, useRef, useState } from 'react'
import socketIoClient from 'socket.io-client'
import { Table,Container,Form,Button,FormGroup } from 'react-bootstrap'
const endpoint = 'http://localhost:5300/';
const socket = socketIoClient(endpoint, {transports: ['websocket']});

const Chat = () => {
    const [usuario_actual, setUsuario_actual] = useState({})
    const [chat_completo, setchat_completo] = useState([])
    const [emple, setEmple] = useState(0)
    const mesaje = useRef('');
    const [a_para_chat, seta_para_chat] = useState([])
    const [id_a_para_chat, setId_a_para_chat] = useState(0)
    
    socket.on('recibir_chat', dato=>{
        setchat_completo(dato.mensajes)
        setEmple(dato.id_emple)
    })
    socket.on('actualizar', async()=>{
        if(usuario_actual.rol === 'reclutador'){
            socket.emit('traer_chat',{...usuario_actual,id_a: id_a_para_chat})
        }else{
            socket.emit('traer_chat',usuario_actual)
        }
    })

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

        fetch("http://localhost:5300/a_para_chat_emple", requestOptions)
        .then(response => response.json())
        .then(result => seta_para_chat(result))
        .catch(error => console.log('error', error));
    }, [])

    const carga = async()=>{
        socket.emit('traer_chat',usuario_actual)
    }

    const enviar = async()=>{
        var hoy = new Date()
        var fecha;
        if(hoy.getDate() < 10){
          fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)}-0${hoy.getDate()}`
        }else{
          fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)}-${hoy.getDate()}`
        }

        if(usuario_actual.rol === 'aplicante'){
            socket.emit('insertar_chat',{mensaje: mesaje.current.value,fecha:fecha ,id_e: emple , id_a: usuario_actual.id})
        }else{
            socket.emit('insertar_chat',{mensaje: mesaje.current.value,fecha:fecha ,id_e: usuario_actual.id , id_a: id_a_para_chat})
        }
        mesaje.current.value = '';
    }

    const cambio_aplicante =(e)=>{
        setUsuario_actual({...usuario_actual, id_a: e.target.value})
        setId_a_para_chat(e.target.value)
    }

    return (
        <Fragment>
            <button onClick={carga}>Iniciar</button>
            <FormGroup>
              <label>
                Rol: 
              </label>
              <Form.Select name="rol" onChange={cambio_aplicante}>
                { 
                a_para_chat.map(e=>{
                    return <option key={e} value={e}>{e}</option>
                })
                }
              </Form.Select>
            </FormGroup>
            <Table borderless>
            <thead>
                <tr>
                <th>
                    Datos Puesto
                </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">
                <Container>
                <Form >
                    <Form.Group className="mb-3" >
                    <Form.Label>Mensajes Papu</Form.Label>
                    {chat_completo.map((e,i)=>{
                        return(<div key={i}><strong>{e.mensaje}</strong></div>)
                    })}
                    </Form.Group>
                    <Form.Group className="mb-3" >
                    <Form.Label>Escribe!</Form.Label>
                    <Form.Control
                        type="text"
                        ref={mesaje}
                    />
                    </Form.Group>
                    <Form.Group>
                    <Button block='true' size="lg" variant='success' onClick={enviar} >
                    Enviar
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

export default Chat
