import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Home from './components/Home'
import Login from './components/Login'
import {actual} from './actual.json'


const Rutas = props => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={()=> <Home valor={actual}  />}>

                </Route>
                <Route path='/login' component={()=> <Login valor={actual}/>}>

                </Route>
            </Switch>
        </Router>
    )
}


export default Rutas
