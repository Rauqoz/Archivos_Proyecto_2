import React, { Fragment } from 'react'
import Barra from './Barra'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Carga_Masiva from './Carga_Masiva'
import Admin_Usuarios from './Admin_Usuarios';

const Acceso = () => {

    return (
        <Fragment>
            <Barra/>
            <Router>
                <Switch>
                    <Route path='/access/carga_masiva' component={Carga_Masiva}/>
                    <Route path='/access/admin_usuarios' component={Admin_Usuarios}/>
                </Switch>
            </Router>
        </Fragment>
    )
}

export default Acceso
