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

const AU_modificar = () => {
    const datos = [
        {id:0, usuario:'rau', contrasena:'123', fecha_inicio:'30/12/2021', fecha_fin: '', estado:'activo', rol:'admin', dep:'RRHH'}
      ];

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
    }, [])

      const [data, setData] = useState(datos)
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
        console.log(dato);
        var opcion = window.confirm("Estás Seguro que deseas Eliminar a "+dato.usuario);
        if (opcion === true) {
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
        valorNuevo.id=data.length+1;
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
                  <td>{dato.fecha_inicio}</td>
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
              <select name="rol" onChange={handleChange}>
              {
                roles.map((e, i) => {
                    if(e === form.rol){
                    return (<option selected={true} key={i} value={e}>{e}</option>)
                    }else{
                    return (<option key={i} value={e}>{e}</option>)
                    }
                })
                }
              </select>
            </FormGroup>

            <FormGroup>
              <label>
                Departamento: 
              </label>
              <select name="dep" onChange={handleChange}>
              {
                departamentos.map((e, i) => {
                    if(e === form.dep){
                    return (<option selected={true} key={i} value={e}>{e}</option>)
                    }else{
                    return (<option key={i} value={e}>{e}</option>)
                    }
                })
                }
              </select>
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
              <select name="rol" onChange={handleChange}>
              {
                roles.map((e, i) => {
                    return (<option selected={true} key={i} value={e}>{e}</option>)
                })
                }
              </select>
            </FormGroup>

            <FormGroup>
              <label>
                Departamento: 
              </label>
              <select name="dep" onChange={handleChange}>
              {
                departamentos.map((e, i) => {
                    return (<option selected={true} key={i} value={e}>{e}</option>)
                })
                }
              </select>
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
