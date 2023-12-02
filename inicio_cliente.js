/*const botonPrueba = document.getElementById("prueba");

botonPrueba.addEventListener('click',()=>{
    console.log("La página funciona");
});*/
window.addEventListener('popstate', function (event) {
  // Deshacer la navegación hacia adelante o hacia atrás
  history.pushState(null, null, document.URL);
});

const botonRegresar2 = document.getElementById('boton-regreso-buscador-2');

botonRegresar2.addEventListener('click',(event)=>{
  event.preventDefault();
  console.log('Redirigiendo a Login');
  
  window.close();
  window.open('/login.html');

});

function actualizarReloj() {
    var fechaActual = new Date();
    var horas = formatoDosDigitos(fechaActual.getHours());
    var minutos = formatoDosDigitos(fechaActual.getMinutes());
    var segundos = formatoDosDigitos(fechaActual.getSeconds());

    if(parseInt(horas) > 12){
        var horaCompleta = (horas % 12) + ':' + minutos + ' PM';
    }
    else if(parseInt(horas) == 12)
    {
        var horaCompleta = (horas) + ':' + minutos + ' PM';
    }
    else
    {
        var horaCompleta = (horas % 12) + ':' + minutos + ' AM';
    }

    document.getElementById('reloj').textContent = horaCompleta;
}

function formatoDosDigitos(numero) {
  return numero < 10 ? '0' + numero : numero;
}

setInterval(actualizarReloj, 1000);

actualizarReloj();

function actualizarFecha(){
  var fechaActual = new Date();
  var dia_mes = formatoDosDigitos(fechaActual.getDate());
  var dias_semana = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  var dia_sem = fechaActual.getDay();
  var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var mes = fechaActual.getMonth();
  var anio = fechaActual.getFullYear();

  var fecha_completa = dia_mes + ' de ' + meses[mes] + ' del ' + anio; 

  console.log(dia_sem);
  console.log(dias_semana[dia_sem]);
  console.log(fecha_completa);
  document.getElementById('fecha').textContent = fecha_completa;
  //console.log ("Hoy es el día número " + dias_semana[6]);
}

actualizarFecha();
const botonRegistroSocio = document.getElementById('boton-registro-socio');
const cerrarModalRegistroSocio = document.getElementById('cerrar-modal-registro-socio');
const modalRegistroSocio = document.getElementById('modal-registro-socio');

cerrarModalRegistroSocio.addEventListener('click',()=>{
  modalRegistroSocio.classList.remove('mostrar-modal');
});

botonRegistroSocio.addEventListener('click',() =>{
  modalRegistroSocio.classList.add('mostrar-modal');
});

const fotoRegistroSocios = document.getElementById('s_foto');

fotoRegistroSocios.addEventListener('change', function(event) {
  const visualizacionImagen = document.getElementById('selec-imagen');
  const imagenSeleccionada = event.target.files[0];

  if (imagenSeleccionada) {
      // Crear un objeto URL para representar la URL del archivo seleccionado
      const _URLimagen = URL.createObjectURL(imagenSeleccionada);

      // Cambiar la URL de la imagen
      visualizacionImagen.src = _URLimagen;

      // Liberar el objeto URL cuando ya no sea necesario (por ejemplo, cuando cambie la imagen nuevamente)
      visualizacionImagen.onload = function() {
          URL.revokeObjectURL(_URLimagen);
      };
  }
});

const formRegistroSocios = document.getElementById('form-registro-socios');

function formatearFecha(fecha) {
  // Convierte la fecha al formato deseado, por ejemplo, DD/MM/YYYY
  const partesFecha = fecha.split('-');
  const fechaFormateada = partesFecha[2] + '/' + partesFecha[1] + '/' + partesFecha[0];
  return fechaFormateada;
}

function quitarCaracteresEspeciales(str) {
  // Utilizando una expresión regular para reemplazar caracteres acentuados
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function contieneCaracteresPermitidosNombres(campo) {
  // Patrón que permite solo letras, números y guiones bajos
  const patron = /^[a-zA-Z\s]*$/;

  // Verificar si el campo coincide con el patrón
  return patron.test(campo);
}

function contieneCaracteresPermitidosNumeros(campo) {
  // Patrón que permite solo letras, números y guiones bajos
  const patron = /^[0-9]*$/;

  // Verificar si el campo coincide con el patrón
  return patron.test(campo);
}

function contieneCaracteresPermitidosCorreos(campo) {
  // Patrón que permite solo letras, números y guiones bajos
  const patron = /^[a-zA-Z0-9_.@-]*$/;

  // Verificar si el campo coincide con el patrón
  return patron.test(campo);
}

formRegistroSocios.addEventListener('submit', async (event)=>{
  event.preventDefault();
  const respuesta = await mandarFoto();
  const datosRegistroSocio = new FormData(formRegistroSocios);
  console.log(datosRegistroSocio);

  let objeto = {
		s_nombre: "",
    s_entrenamiento: ""
	};

  for(item of datosRegistroSocio){
		if(item[0] != 's_foto' && item[0] != 's_vigencia'){
      objeto[item[0]] = quitarCaracteresEspeciales(item[1]);

    }else if(item[0] == 's_foto'){
      objeto[item[0]] = respuesta;
    }else{
      const fechaRecibida = document.getElementById('s_vigencia');
      const valorFecha = fechaRecibida.value;
      objeto[item[0]] = formatearFecha(valorFecha);
    }
		console.log(item[0]);
    console.log(objeto[item[0]]);
	}

  if(!contieneCaracteresPermitidosNombres(objeto.s_nombre) || !contieneCaracteresPermitidosNombres(objeto.s_apellido_pat) || !contieneCaracteresPermitidosNombres(objeto.s_apellido_mat))
  {
    mostrarAlerta(0,241);
    return;
  }

  if(!contieneCaracteresPermitidosNumeros(objeto.s_telefono))
  {
    mostrarAlerta(0,242);
    return;
  }

  if(!contieneCaracteresPermitidosCorreos(objeto.s_correo))
  {
    mostrarAlerta(0,243);
    return;
  }
  if(objeto.s_entrenamiento == "")
  {
    mostrarAlerta(0,244);
    return;
  }
  if(objeto.s_vigencia == 'undefined/undefined/')
  {
    mostrarAlerta(0,245);
    return;
  }
  console.log('Imprimiendo Nivel de Entrenamiento');
  console.log(objeto.s_entrenamiento);
  console.log('Imprimiendo vigencia');
  console.log(objeto.s_vigencia);

  const xhr = new XMLHttpRequest();
  
  xhr.open('POST','/registro-socios',true);
  
  xhr.onload = function (){
    console.log(objeto);
    console.log('La respuesta no es HTML.');
    let respuesta2 = JSON.parse(xhr.responseText); 
    console.log(respuesta2);


    /*ESTE CÓDIGO ES PARA QUE SE MUESTRE LA ALERTA*/
    var codigo_error = parseInt(respuesta2);
      //codigo_error = respuesta;
    var estilo = "error";
    var mensaje = "";

    if(isNaN(codigo_error) != true){
      mensaje = "¡Genial! Socio registrado correctamente con número de socio: " + codigo_error + "\nPuedes consultar el número de socio en cualquier momento desde el buscador.";
      estilo = "exito";
      formRegistroSocios.reset();

      const visualizacionImagen = document.getElementById('selec-imagen');
      _URLimagen = 'profile_pics/sin-foto.jpg';
      visualizacionImagen.src = _URLimagen;
      visualizacionImagen.onload = function() {
          URL.revokeObjectURL(_URLimagen);
      };

      modalRegistroSocio.classList.remove('mostrar-modal');

    }else{
      mensaje = "ERROR: UN ERROR INESPERADO HA OCURRIDO";
    }

    // switch(codigo_error){
    //   case 1000:
    //     estilo = "exito";
    //     mensaje = "¡Genial! Socio registrado correctamente";
    //   break;
    //   default:
    //     mensaje = "ERROR: UN ERROR INESPERADO HA OCURRIDO";
    //   break;
    // }

    console.log(mensaje);
    /*PRIMERO DETERMINAMOS SI LA OPERACIÓN FUE EXITOSA O NO*/
    if(estilo == 'exito')
    {
      console.log('La operación fue un éxito');
      var textoAlerta = document.getElementById('mensaje_alerta_exito');
      textoAlerta.textContent = mensaje;
      var alertElement = document.getElementById('alerta_exito');
      alertElement.classList.remove('esconder');
      alertElement.classList.add('mostrar');
      alertElement.classList.add('mostrarAlerta');
      /*HACE QUE LA ALERTA SE CIERRE AUTOMÁTICAMENTE DESPUÉS DE 5 SEGUNDOS*/
      setTimeout(function(){
        alertElement.classList.remove('mostrar');
        alertElement.classList.add('esconder');
      },5000);
    }else if(estilo == 'error')
    {
      console.log('Hubo un error');
      var textoAlerta = document.getElementById('mensaje_alerta_error');
      textoAlerta.textContent = mensaje;
      var alertElement = document.getElementById('alerta_error');
      alertElement.classList.remove('esconder');
      alertElement.classList.add('mostrar');
      alertElement.classList.add('mostrarAlerta');
      /*HACE QUE LA ALERTA SE CIERRE AUTOMÁTICAMENTE DESPUÉS DE 5 SEGUNDOS*/
      setTimeout(function(){
        alertElement.classList.remove('mostrar');
        alertElement.classList.add('esconder');
      },5000);
    }
    }
  xhr.onerror = function(){
    console.error('Error de red al intentar realizar la solicitud');
  };

  xhr.setRequestHeader('Content-Type', 'application/json');

  console.log(JSON.stringify(objeto));
  xhr.send(JSON.stringify(objeto));

});


function mandarFoto() {
  // Devolver una nueva promesa
  return new Promise((resolve, reject) => {
    const foto = fotoRegistroSocios.files[0];
    if (foto) {
      console.log("Si hay foto :D");
      const formData = new FormData();
      formData.append('file', foto);
  
      // Realizar una solicitud al servidor para manejar el archivo.
      const xhr = new XMLHttpRequest();
  
      xhr.open('POST','/enviar-fotos',true);
      
      xhr.onload = function (){
        console.log(formData);
        console.log('La respuesta no es HTML.');
        // let respuesta = JSON.parse(xhr.responseText); 

        // //PROBANDO SI LA URL DEVUELTA FUNCIONA
        // _URLimagen = xhr.responseText;
        // const visualizacionImagen = document.getElementById('selec-imagen');
        // visualizacionImagen.src = _URLimagen;
        // // Liberar el objeto URL cuando ya no sea necesario (por ejemplo, cuando cambie la imagen nuevamente)
        // visualizacionImagen.onload = function() {
        //     URL.revokeObjectURL(_URLimagen);
        // };


        resolve(xhr.responseText);
        console.log(respuesta);
  
  
        /*ESTE CÓDIGO ES PARA QUE SE MUESTRE LA ALERTA*/
        var codigo_error = parseInt(respuesta);
        if(isNaN(codigo_error) == false){
          reject(new Error(`Error en la petición. Código: ${xhr.status}`));
          //codigo_error = respuesta;
        var estilo = "error";
        var mensaje = "";
        switch(codigo_error){
          case 1000:
            estilo = "exito";
            mensaje = "¡Genial! Imagen subida correctamente";
          break;
          default:
            mensaje = "ERROR: UN ERROR INESPERADO HA OCURRIDO";
          break;
        }
    
        console.log(mensaje);
        // /*PRIMERO DETERMINAMOS SI LA OPERACIÓN FUE EXITOSA O NO*/
        // if(estilo == 'exito')
        // {
        //   console.log('La operación fue un éxito');
        //   var textoAlerta = document.getElementById('mensaje_alerta_exito');
        //   textoAlerta.textContent = mensaje;
        //   var alertElement = document.getElementById('alerta_exito');
        //   alertElement.classList.remove('esconder');
        //   alertElement.classList.add('mostrar');
        //   alertElement.classList.add('mostrarAlerta');
        //   /*HACE QUE LA ALERTA SE CIERRE AUTOMÁTICAMENTE DESPUÉS DE 5 SEGUNDOS*/
        //   setTimeout(function(){
        //     alertElement.classList.remove('mostrar');
        //     alertElement.classList.add('esconder');
        //   },5000);
        // }else if(estilo == 'error')
        // {
        //   console.log('Hubo un error');
        //   var textoAlerta = document.getElementById('mensaje_alerta_error');
        //   textoAlerta.textContent = mensaje;
        //   var alertElement = document.getElementById('alerta_error');
        //   alertElement.classList.remove('esconder');
        //   alertElement.classList.add('mostrar');
        //   alertElement.classList.add('mostrarAlerta');
        //   /*HACE QUE LA ALERTA SE CIERRE AUTOMÁTICAMENTE DESPUÉS DE 5 SEGUNDOS*/
        //   setTimeout(function(){
        //     alertElement.classList.remove('mostrar');
        //     alertElement.classList.add('esconder');
        //   },5000);
        // }
      };
        }
      xhr.onerror = function(){
        console.error('Error de red al intentar realizar la solicitud');
      };
    
      xhr.setRequestHeader('enctype', 'multipart/form-data');
    
      console.log(formData);
      xhr.send(formData);
    }
    else
    {
      resolve('profile_pics/sin-foto.jpg');
    }
  });
}

// formRegistroSocios.addEventListener('submit', (event)=>{
//   event.preventDefault();
//   const foto = fotoRegistroSocios.files[0];

//   let respuesta;
//   if (foto) {
//     console.log("Si hay foto :D");
//     const formData = new FormData();
//     formData.append('file', foto);

//     // Realizar una solicitud al servidor para manejar el archivo.
//     const xhr = new XMLHttpRequest();

//     xhr.open('POST','/enviar-fotos',true);
    
//     xhr.onload = function (){
//       console.log(formData);
//       console.log('La respuesta no es HTML.');
//       // let respuesta = JSON.parse(xhr.responseText); 
//       respuesta = xhr.responseText; 
//       console.log(respuesta);


//       /*ESTE CÓDIGO ES PARA QUE SE MUESTRE LA ALERTA*/
//       var codigo_error = parseInt(respuesta);
//       if(isNaN(codigo_error) == false){
//               //codigo_error = respuesta;
//       var estilo = "error";
//       var mensaje = "";
//       switch(codigo_error){
//         case 1000:
//           estilo = "exito";
//           mensaje = "¡Genial! Imagen subida correctamente";
//         break;
//         default:
//           mensaje = "ERROR: UN ERROR INESPERADO HA OCURRIDO";
//         break;
//       }
  
//       console.log(mensaje);
//       // /*PRIMERO DETERMINAMOS SI LA OPERACIÓN FUE EXITOSA O NO*/
//       // if(estilo == 'exito')
//       // {
//       //   console.log('La operación fue un éxito');
//       //   var textoAlerta = document.getElementById('mensaje_alerta_exito');
//       //   textoAlerta.textContent = mensaje;
//       //   var alertElement = document.getElementById('alerta_exito');
//       //   alertElement.classList.remove('esconder');
//       //   alertElement.classList.add('mostrar');
//       //   alertElement.classList.add('mostrarAlerta');
//       //   /*HACE QUE LA ALERTA SE CIERRE AUTOMÁTICAMENTE DESPUÉS DE 5 SEGUNDOS*/
//       //   setTimeout(function(){
//       //     alertElement.classList.remove('mostrar');
//       //     alertElement.classList.add('esconder');
//       //   },5000);
//       // }else if(estilo == 'error')
//       // {
//       //   console.log('Hubo un error');
//       //   var textoAlerta = document.getElementById('mensaje_alerta_error');
//       //   textoAlerta.textContent = mensaje;
//       //   var alertElement = document.getElementById('alerta_error');
//       //   alertElement.classList.remove('esconder');
//       //   alertElement.classList.add('mostrar');
//       //   alertElement.classList.add('mostrarAlerta');
//       //   /*HACE QUE LA ALERTA SE CIERRE AUTOMÁTICAMENTE DESPUÉS DE 5 SEGUNDOS*/
//       //   setTimeout(function(){
//       //     alertElement.classList.remove('mostrar');
//       //     alertElement.classList.add('esconder');
//       //   },5000);
//       // }
//     };
//       }
//     xhr.onerror = function(){
//       console.error('Error de red al intentar realizar la solicitud');
//     };
  
//     xhr.setRequestHeader('enctype', 'multipart/form-data');
  
//     console.log(formData);
//     xhr.send(formData);
//   }
//   const datosRegistroSocio = new FormData(formRegistroSocios);
//   console.log(datosRegistroSocio);

//   let objeto = {
// 		s_nombre: ""
// 	};

//   for(item of datosRegistroSocio){
// 		if(item[0] != 's_foto'){
//       objeto[item[0]] = item[1];
//     }else{
//       objeto[item[0]] = respuesta;
//     }
// 		console.log(item[0]);
//     console.log(objeto[item[0]]);
// 	}
// });

const botonChecarEntrada = document.getElementById('boton-checar-entrada');
const botonChecarSalida = document.getElementById('boton-checar-salida');
const inputNumSocio = document.getElementById("chk_id_socio");

const modalChecador = document.getElementById('modal-checador');
const cerrarModalChecador = document.getElementById('cerrar-modal-checador');
const tituloModalChecador = document.getElementById('titulo-modal-checador');
const imagenModalChecador = document.getElementById('imagen-modal-checador');
const noSocioModalChecador = document.getElementById('no-socio-modal-checador');
const nombreModalChecador = document.getElementById('nombre-modal-checador');
const horaEntradaModalChecador = document.getElementById('hora-entrada-modal-checador');
const horaSalidaModalChecador = document.getElementById('hora-salida-modal-checador');
const divChecadorVigencia = document.getElementById('div-checador-vigencia');
const subtituloModalChecador = document.getElementById('subtitulo-modal-checador');
const vigenciaModalChecador = document.getElementById('vigencia-modal-checador');

cerrarModalChecador.addEventListener('click', ()=>{
  divChecadorVigencia.classList.add('ocultar-texto');
  divChecadorVigencia.classList.remove('mostrar-texto');
  modalChecador.classList.remove('mostrar-modal');
});

botonChecarEntrada.addEventListener('click', async (event)=>{
  event.preventDefault();
  //const datosPersonaChecada = await mandarChecador(true);
  try {
    const datosPersonaChecada = JSON.parse(await mandarChecador(true));
    console.log(typeof datosPersonaChecada);
    console.log(datosPersonaChecada);
    if(typeof datosPersonaChecada == 'number'){
      mostrarAlerta(0,datosPersonaChecada);
    }
    else
    {
      tituloModalChecador.textContent = '¡Entrada registrada correctamente!';
      rellenarModalChecador(datosPersonaChecada);
    }
  } catch (error) {
    console.log('Hubo un error');
  }
});


botonChecarSalida.addEventListener('click', async (event)=>{
  event.preventDefault();
  // const datosPersonaChecada = await mandarChecador(false);
  const datosPersonaChecada = JSON.parse(await mandarChecador(false));
  console.log(typeof datosPersonaChecada);
  console.log(datosPersonaChecada);
  if(typeof datosPersonaChecada == 'number')
  {
    mostrarAlerta(0,datosPersonaChecada);
  }
  else
  {
    tituloModalChecador.textContent = '¡Salida registrada correctamente!';
    rellenarModalChecador(datosPersonaChecada);
  }
});

function rellenarModalChecador(datosPersonaChecada){
  imagenModalChecador.src = datosPersonaChecada[0].foto;
  noSocioModalChecador.textContent = 'No. de socio: ' + datosPersonaChecada[0].id_miembro;
  nombreModalChecador.textContent = datosPersonaChecada[0].nombre + " " + datosPersonaChecada[0].apellido_pat;
  horaEntradaModalChecador.textContent = datosPersonaChecada[0].hora_entrada;
  horaSalidaModalChecador.textContent = datosPersonaChecada[0].hora_salida;
  if(datosPersonaChecada[0].diferencia <= 5)
  {
    divChecadorVigencia.classList.remove('ocultar-texto');
    divChecadorVigencia.classList.add('mostrar-texto');
    divChecadorVigencia.classList.remove('texto-rojo');
    divChecadorVigencia.classList.add('texto-naranja');
    subtituloModalChecador.textContent = 'Su membresía terminará el:';
    vigenciaModalChecador.textContent = datosPersonaChecada[0].vigencia;
  }
  if(datosPersonaChecada[0].diferencia < 0)
  {
    subtituloModalChecador.textContent = 'Su membresía terminó el:';
    divChecadorVigencia.classList.remove('texto-naranja');
    divChecadorVigencia.classList.add('texto-rojo');
  }
  inputNumSocio.textContent = "";
  modalChecador.classList.add('mostrar-modal');
}

function mandarChecador(entrada) {
  // Devolver una nueva promesa
  return new Promise((resolve, reject) => {
    console.log('Se checó entrada');

    const formData = new FormData();
    formData.append('id_socio', inputNumSocio.value);
    
    let objeto = {
      ent: "",
      id_socio : ""
    };

    objeto.ent = entrada;
    for(const item of formData.entries()){
      objeto[item[0]] = item[1];
      console.log(item[0]);
      console.log(item[1]);
    }

    if(objeto.id_socio == "")
    {
      mostrarAlerta(0,211);
      reject(new Error('El campo estaba en blanco'));
    }

    if(!contieneCaracteresPermitidosNumeros(objeto.id_socio)){
      mostrarAlerta(0,212);
      reject(new Error('El campo estaba en blanco'));
    }
  
    console.log(formData);
  
      // Realizar una solicitud al servidor para manejar el archivo.
      const xhr = new XMLHttpRequest();
  
      xhr.open('POST','/checador','true');
      
      xhr.onload = function ()
      {
        let respuesta = JSON.parse(xhr.responseText); 
        console.log(respuesta);
        resolve(xhr.responseText);
      }

      xhr.onerror = function()
      {
        console.error('Error de red al intentar realizar la solicitud');
        reject(new Error(`Error en la petición. Código: ${xhr.status}`));
      };
    
      xhr.setRequestHeader('content-type', 'application/json');
    
      console.log(JSON.stringify(objeto));
      xhr.send(JSON.stringify(objeto));
  });
}

const botonSociosEntrenando = document.getElementById('boton-socios-entrenando');
const modalEntrenando = document.getElementById('modal-entrenando');
const noHaySociosEntrenando = document.getElementById('no-hay-socios-entrenando');
const gridSociosEntrenando = document.getElementById('grid-socios-entrenando');
const cerrarModalEntrenando = document.getElementById('cerrar-modal-entrenando');

botonSociosEntrenando.addEventListener('click', async (event)=>{
  event.preventDefault();
  const sociosEntrenando = JSON.parse(await llamarSociosEntrenando());
  modalEntrenando.classList.add('mostrar-modal');
  if(typeof sociosEntrenando == 'number')
  {
    console.log('Es un número');
    console.log(sociosEntrenando);
    noHaySociosEntrenando.textContent = "No hay Socios entrenando en este momento.";
    // noHaySociosEntrenando.classList.remove('ocultar-texto');
    // noHaySociosEntrenando.classList.add('mostrar-texto');
    
    //mostrarAlerta(0,sociosEntrenando);
  }
  else
  {
    console.log('Es un objeto');
    console.log(sociosEntrenando);
    console.log(typeof sociosEntrenando);
    noHaySociosEntrenando.textContent = "Los siguientes socios están entrenando en este momento:";
    var cantidadDeSociosEntrenando = sociosEntrenando.length;
    console.log(cantidadDeSociosEntrenando);
    for(var socio of sociosEntrenando){
      var divTemporal = document.createElement("div");
      var imagenTemporal = document.createElement("img");
      var nombreMiembroTemporal = document.createElement("h3");
      var noSocioTemporal = document.createElement("h3");
      
      imagenTemporal.src = socio.foto;
      imagenTemporal.classList.add('imagen-modal-entrenando');
      
      nombreMiembroTemporal.textContent = socio.nombre + " " + socio.apellido_pat;
      nombreMiembroTemporal.classList.add('subtitulo-modal-checador');
      
      noSocioTemporal.textContent = "No. de Socio: " + socio.id_miembro;
      noSocioTemporal.classList.add('contenido-modal-checador');

      divTemporal.appendChild(imagenTemporal);
      divTemporal.appendChild(nombreMiembroTemporal);
      divTemporal.appendChild(noSocioTemporal);
      divTemporal.classList.add('elemento-grid-socios-entrenando');
      if(cantidadDeSociosEntrenando <= 4)
      {
        divTemporal.classList.add('tamano4');
      }
      else if(cantidadDeSociosEntrenando <= 9)
      {
        divTemporal.classList.add('tamano9');
      }
      else
      {
        divTemporal.classList.add('tamano16');
      }
      gridSociosEntrenando.appendChild(divTemporal);
    }
    // noHaySociosEntrenando.classList.remove('mostrar-texto');
    // noHaySociosEntrenando.classList.add('ocultar-texto');
  }
});

cerrarModalEntrenando.addEventListener('click', ()=>{
  modalEntrenando.classList.remove('mostrar-modal');
  while(gridSociosEntrenando.firstChild){
    gridSociosEntrenando.removeChild(gridSociosEntrenando.firstChild);
  }
});

function llamarSociosEntrenando(){
  return new Promise((resolve, reject) => {
    console.log('Verificando miembros entrenando');
  
      // Realizar una solicitud al servidor para manejar el archivo.
      const xhr = new XMLHttpRequest();
  
      xhr.open('POST','/socios-entrenando','true');
      
      xhr.onload = function ()
      {
        let respuesta = JSON.parse(xhr.responseText); 
        console.log(respuesta);
        resolve(xhr.responseText);
      }

      xhr.onerror = function()
      {
        console.error('Error de red al intentar realizar la solicitud');
        reject(new Error(`Error en la petición. Código: ${xhr.status}`));
      };
    
      //xhr.setRequestHeader('content-type', 'application/json');
    
      // console.log(JSON.stringify(objeto));
      //let objeto;
      //xhr.send(JSON.stringify(objeto));
      xhr.send('');
  });
}

const botonBuscarSocio = document.getElementById('boton-buscar-socio');

botonBuscarSocio.addEventListener('click',(event)=>{
  event.preventDefault();
  console.log('Redirigiendo a Buscar Socios');
  
  // Realizar una solicitud al servidor para manejar el archivo.
  const xhr = new XMLHttpRequest();

  xhr.open('GET','/buscar-socio','true');
  
  xhr.onload = function ()
  {
    document.open();
    document.write(xhr.responseText);
    document.close();
  }

  xhr.onerror = function()
  {
    console.error('Error de red al intentar realizar la solicitud');
    reject(new Error(`Error en la petición. Código: ${xhr.status}`));
  };

  xhr.send('');
});

function mostrarAlerta(tipo, codigo){
  /*ESTE CÓDIGO ES PARA ASIGNAR UN MENSAJE A LA ALERTA*/
  console.log(codigo);
  var mensaje = "";
  switch(codigo)
  {
    /* ERRORES EN LA BASE DE DATOS */
    case 23503:
      mensaje = "ERROR: EL NÚMERO DE SOCIO INGRESADO NO EXISTE"
    break;
    /* CASOS EXITOSOS */
    case 1000:
      mensaje = "¡Genial! Imagen subida correctamente";
    break;
    /* ERRORES DE LÓGICA */
    case 777:
      mensaje = "ERROR: NO SE PUEDE VOLVER A REGISTRAR UNA ENTRADA SIN ANTES REGISTRAR UNA SALIDA";
    break;
    case 888:
      mensaje = "ERROR: NO SE PUEDE REGISTRAR UNA SALIDA SIN REGISTRAR UNA ENTRADA ANTES";
    break;
    case 211:
      mensaje = "ERROR: EL CAMPO NO. DE SOCIO NO PUEDE ESTAR EN BLANCO"
    break;
    case 212:
      mensaje = "ERROR: EL CAMPO NO. DE SOCIO DEBE SER UN NÚMERO"
    break;
    case 241:
      mensaje = "ERROR: EL NOMBRE Y LOS APELLIDOS SOLO PUEDEN CONTENER LETRAS"
    break;
    case 242:
      mensaje = "ERROR: EL TELÉFONO SOLO PUEDE CONTENER NÚMEROS"
    break;
    case 243:
      mensaje = "ERROR: EL CORREO SOLO PUEDE CONTENER LETRAS, NÚMEROS, GUIONES (-), GUIONES BAJOS(_), PUNTOS(.) Y ARROBAS(@)"
    break;
    case 244:
      mensaje = "ERROR: DEBES ELEGIR UN NIVEL DE ENTRENAMIENTO";
    break;
    case 245:
      mensaje = "ERROR: DEBES ELEGIR UNA VIGENCIA";
    break;
    default:
      mensaje = "ERROR: UN ERROR INESPERADO HA OCURRIDO";
    break;
  }
  console.log(mensaje);

  /* SE ASIGNA UN ESTILO A LA ALERTA Y SE INCLUYE EL MENSAJE */
  var alertElement, textoAlerta;
  if(tipo == 0)
  {
    console.log('Hubo un error');
    textoAlerta = document.getElementById('mensaje_alerta_error');
    textoAlerta.textContent = mensaje;
    alertElement = document.getElementById('alerta_error');
  }
  else if(tipo == 1)
  {
    console.log('La operación fue un éxito');
    var textoAlerta = document.getElementById('mensaje_alerta_exito');
    textoAlerta.textContent = mensaje;
    alertElement = document.getElementById('alerta_exito');
  }

  /* SE MUESTRA LA ALERTA */
  alertElement.classList.remove('esconder');
  alertElement.classList.add('mostrar');
  alertElement.classList.add('mostrarAlerta');

  /* SE CIERRA LA ALERTA DESPUÉS DE 5 SEGUNDOS */
  setTimeout(function()
  {
    alertElement.classList.remove('mostrar');
    alertElement.classList.add('esconder');
  },5000);

}