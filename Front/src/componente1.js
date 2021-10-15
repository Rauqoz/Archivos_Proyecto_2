import axios from 'axios';

const peticion = () =>{
  console.log("hizo peticion");

  var data = new FormData();

  var config = {
    method: 'get',
    url: 'http://localhost:5300/',
    data : data
  };

  axios(config)
  .then(function (response) {
    var datos = response.data
    console.log(datos.home);
  })
  .catch(function (error) {
    console.log(error);
  }); 
  
}


function Componente1() {
    return (
      <div className="App">
       <button onClick={peticion}>Peticion</button>
      </div>
    );
  }
  
  export default Componente1;