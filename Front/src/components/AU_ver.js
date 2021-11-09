import React, { Fragment, useEffect, useState  } from 'react'
import { MDBDataTableV5 } from 'mdbreact';

const AU_ver = () => {
    const [datatable,setDatatable] = useState();

    useEffect(() => {
        const columns = [
            {
              label: 'Usuario',
              field: 'usuario',
              sort: 'asc',
              width: 150,
              attributes: {
                'aria-controls': 'DataTable',
                'aria-label': 'usuario',
              },
            },
            {
              label: 'Contraseña',
              field: 'contrasena',
              width: 270,
            },
            {
              label: 'Fecha Inicio',
              field: 'fecha_inicio',
              width: 200,
            },
            {
              label: 'Fecha Fin',
              field: 'fecha_fin',
              width: 100,
            },
            {
              label: 'Estado',
              field: 'estado',
              width: 150,
            },
            {
              label: 'Rol',
              field: 'rol',
              width: 100,
            },
            {
              label: 'Departamento',
              field: 'dep',
              width: 100,
            }
          ]
        var formdata = new FormData();
        var requestOptions = {
        method: 'GET',
        data: formdata,
        redirect: 'follow'
        };
        fetch("http://localhost:5300/empleados", requestOptions)
        .then(response => response.json())
        .then(result => setDatatable({columns: columns, rows:result }))
        .catch(error => console.log('error', error));
    }, [])

    return (
        <Fragment>
            <MDBDataTableV5 className='pad' hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datatable} />
        </Fragment>
    )
}

export default AU_ver
