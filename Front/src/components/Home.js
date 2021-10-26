import React, { Fragment } from 'react'
import Barra from './Barra'

const Home = ({valor}) => {
    return (
        <Fragment>
            <p>{valor}</p>
            <Barra/>
        </Fragment>
    )
}

export default Home
