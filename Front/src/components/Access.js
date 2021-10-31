import React, { Fragment } from 'react'
import Barra from './Barra'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Carga_Masiva from './Carga_Masiva'
import Admin_Usuarios from './Admin_Usuarios';
import RE_aceptar from './RE_aceptar';
import RE_expediente from './RE_expediente';

const Acceso = () => {

    return (
        <Fragment>
            <Barra/>
            <Router>
                <Switch>
                    <Route path='/access/carga_masiva' component={Carga_Masiva}/>
                    <Route path='/access/admin_usuarios' component={Admin_Usuarios}/>
                    <Route path='/access/aceptar_aplicantes' component={RE_aceptar}/>
                    <Route path='/access/revision_expedientes' component={RE_expediente}/>
                </Switch>
            </Router>
        </Fragment>
    )
}

export default Acceso
