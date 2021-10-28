import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Home from './components/Home'
import Login from './components/Login'
import Access from './components/Access'

const Rutas = props => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home}/>

                <Route path='/login' component={Login}/>

                <Route path='/access' component={Access}/>

            </Switch>
        </Router>
    )
}


export default Rutas
