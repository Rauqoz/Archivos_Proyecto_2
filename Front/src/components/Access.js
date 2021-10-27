import React, { Fragment } from 'react'
import Barra from './Barra'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import P1 from './P1'

const Acceso = () => {
    return (
        <Fragment>
            <Barra/>
            <Router>
                <Switch>
                    <Route exact path='/access/carga_masiva' component={()=> <P1/>}/>
                </Switch>
            </Router>
        </Fragment>
    )
}

export default Acceso
