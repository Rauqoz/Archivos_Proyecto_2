import React, { Fragment } from 'react'

const Login = ({valor}) => {
    
    const hola = ()=>{
        console.log("hola");
    }
    hola()


    return (
        <Fragment>
            <p>{valor}</p>
            <p>rau</p>

        </Fragment>
    )
}

export default Login
