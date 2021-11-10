import React, { Fragment, useEffect, useState } from 'react'
import {
    Table,
    Button,
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
  } from "reactstrap";
import { Form } from 'react-bootstrap';

const AU_modificar = () => {
    const [data, setData] = useState([])
    const [departamentos, setDepartamentos] = useState([])
    const roles = ['admin','reclutador','coordinador']

    useEffect(() => {
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/departamentos", requestOptions)
        .then(response => response.json())
        .then(result => setDepartamentos(result))
        .catch(error => console.log('error', error));

        fetch("http://localhost:5300/empleados", requestOptions)
        .then(response => response.json())
        .then(result => {
          let pre_data = []
          result.forEach(e=>{
            if(e.estado === 'activo'){
              pre_data.push(e)
            }
          })
          setData(pre_data)
        })
        .catch(error => console.log('error', error));
    }, [])

      const [modalActualizar, setModalActualizar] = useState(false)
      const [modalInsertar, setModalInsertar] = useState(false)
      const [modalEliminar, setModalEliminar] = useState(false)
      const [form, setForm] = useState({id:'', usuario:'', contrasena:'', fecha_inicio:'', fecha_fin: '', estado:'', rol:'', dep:''})
    
      const mostrarModalActualizar = (dato) => {
          setForm(dato)
          setModalActualizar(true)
      };
    
      const cerrarModalActualizar = () => {
        setModalActualizar(false)
      };
    
      const mostrarModalInsertar = () => {
          setModalInsertar(true)
      };
    
      const cerrarModalInsertar = () => {
          setModalInsertar(false)
      };

      const cerrarModalEliminar = ()=>{
          setModalEliminar(false)
      }
    
      const editar = (dato) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "emple": dato
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://localhost:5300/m_empleados", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        //tabla
        var arreglo = data;
        arreglo.map((registro,indice) => {
          if (dato.id === registro.id) {
            arreglo[indice].usuario = dato.usuario;
            arreglo[indice].contrasena = dato.contrasena;
            arreglo[indice].rol = dato.rol;
            arreglo[indice].dep = dato.dep;
          }
          return true
        });
        setData(arreglo)
        setModalActualizar(false)
      };
    
      const eliminar = (dato) => {
        var opcion = window.confirm("Estás Seguro que deseas Eliminar a "+dato.usuario);
        if (opcion === true) {
          var hoy = new Date()
          var fecha;
          if(hoy.getDate() < 10){
            fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)}-0${hoy.getDate()}`
          }else{
            fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)}-${hoy.getDate()}`
          }
          dato.fecha_fin = fecha
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({
            "emple": dato
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("http://localhost:5300/e_empleados", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
          //tabla
            var arreglo = data;
            arreglo.map((registro,indice) => {
                if (dato === registro) {
                    arreglo.splice(indice, 1);
                }
                return true
            });
            setData(arreglo)
            setModalActualizar(false)
            setModalEliminar(true)
            }
      };
    
      const insertar= ()=>{
        var valorNuevo= {...form};
        var hoy = new Date()
        var fecha;
        if(hoy.getDate() < 10){
          fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)}-0${hoy.getDate()}`
        }else{
          fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)}-${hoy.getDate()}`
        }
        valorNuevo.fecha_inicio = fecha
        valorNuevo.estado = 'activo'
        valorNuevo.id=data.length+1;
        console.log(valorNuevo);
        //post
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "emple": valorNuevo
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://localhost:5300/i_empleados", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
        //tabla actualizada
        var lista= data;
        lista.push(valorNuevo);
        setModalInsertar(false)
        setData(lista)
      }
    
      const handleChange = (e) => {
          setForm({
            ...form,
            [e.target.name]: e.target.value,
          })
      };


    return (
        <Fragment>
            <Container>
        <br />
          <Button color="success" onClick={mostrarModalInsertar}>Crear</Button>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Departamento</th>
              </tr>
            </thead>

            <tbody>
              {data.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.id}</td>
                  <td>{dato.usuario}</td>
                  <td>{dato.contrasena}</td>
                  <td>{dato.fecha_inicio.split('T')[0]}</td>
                  <td>{dato.fecha_fin}</td>
                  <td>{dato.estado}</td>
                  <td>{dato.rol}</td>
                  <td>{dato.dep}</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() => mostrarModalActualizar(dato)}
                    >
                      Editar
                    </Button>{" "}
                    <Button color="danger" onClick={()=> eliminar(dato)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={modalActualizar}>
          <ModalHeader>
           <div><h3>Editar Usuario</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
               Id:
              </label>
            
              <input
                className="form-control"
                readOnly
                type="text"
                value={form.id}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Usuario: 
              </label>
              <input
                className="form-control"
                name="usuario"
                type="text"
                onChange={handleChange}
                value={form.usuario}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Contraseña: 
              </label>
              <input
                className="form-control"
                name="contrasena"
                type="text"
                onChange={handleChange}
                value={form.contrasena}
              />
            </FormGroup>

            <FormGroup>
              <label>
               Fecha Inicio:
              </label>
            
              <input
                className="form-control"
                readOnly
                type="text"
                value={form.fecha_inicio}
              />
            </FormGroup>

            <FormGroup>
              <label>
               Fecha Fin:
              </label>
            
              <input
                className="form-control"
                readOnly
                type="text"
                value={form.fecha_fin}
              />
            </FormGroup>

            <FormGroup>
              <label>
               Estado:
              </label>
            
              <input
                className="form-control"
                readOnly
                type="text"
                value={form.estado}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Rol: 
              </label>
              <Form.Select name="rol" onChange={handleChange}>
              {
                roles.map((e, i) => {
                  return (<option key={i} value={e}>{e}</option>)
                    
                })
                }
              </Form.Select>
            </FormGroup>

            <FormGroup>
              <label>
                Departamento: 
              </label>
              <Form.Select name="dep" onChange={handleChange}>
              {
                departamentos.map((e, i) => {
                  return (<option key={i} value={e}>{e}</option>)
                    
                })
                }
              </Form.Select>
            </FormGroup>
            
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => editar(form)}
            >
              Editar
            </Button>
            <Button
              color="danger"
              onClick={cerrarModalActualizar}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalInsertar}>
          <ModalHeader>
           <div><h3>Insertar Usuario</h3></div>
          </ModalHeader>

          <ModalBody>
            
            <FormGroup>
              <label>
                Usuario: 
              </label>
              <input
                className="form-control"
                name="usuario"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Contraseña: 
              </label>
              <input
                className="form-control"
                name="contrasena"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Rol: 
              </label>
              <Form.Select name="rol" onChange={handleChange}>
              {
                roles.map((e, i) => {
                    return (<option key={i} value={e}>{e}</option>)
                })
                }
              </Form.Select>
            </FormGroup>

            <FormGroup>
              <label>
                Departamento: 
              </label>
              <Form.Select name="dep" onChange={handleChange}>
              {
                departamentos.map((e, i) => {
                    return (<option key={i} value={e}>{e}</option>)
                })
                }
              </Form.Select>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={insertar}
            >
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={cerrarModalInsertar}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEliminar}>
          <ModalHeader>
           <div><h3>Eliminado</h3></div>
          </ModalHeader>
          <ModalFooter>
            <Button
              className="btn btn-danger"
              onClick={cerrarModalEliminar}
            >
              Ok
            </Button>
          </ModalFooter>
        </Modal>

        </Fragment>
    )
}

export default AU_modificar
