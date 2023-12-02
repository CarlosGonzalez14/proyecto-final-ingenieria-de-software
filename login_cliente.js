const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

window.addEventListener('popstate', function (event) {
	// Deshacer la navegación hacia adelante o hacia atrás
	history.pushState(null, null, document.URL);
  });

  function contieneCaracteresPermitidosNombres(campo) {
	// Patrón que permite solo letras, números y guiones bajos
	const patron = /^[a-zA-Z\s]*$/;
  
	// Verificar si el campo coincide con el patrón
	return patron.test(campo);
  }
  
  function contieneCaracteresPermitidosUsuarios(campo) {
	// Patrón que permite solo letras, números y guiones bajos
	const patron = /^[a-zA-Z0-9_]*$/;
  
	// Verificar si el campo coincide con el patrón
	return patron.test(campo);
  }

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
	formRegistro.reset();
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
	/*ESTE CÓDIGO SE ASIGNA A UN BOTÓN PARA QUE CIERRE LA ALERTA*/
	/*var alertElement = document.querySelector('.alerta');
  	alertElement.classList.remove('mostrar');
	alertElement.classList.add('esconder');*/
});


const formRegistro = document.getElementById("form_registro");
formRegistro.addEventListener('submit', function (event){
	event.preventDefault();
	
	console.log("Ruta alterna");
	const datosRegistro = new FormData(formRegistro);

	let objeto = {
		r_nombre: ""
	};
	for(item of datosRegistro){
		objeto[item[0]] = item[1];
	}

	if(!contieneCaracteresPermitidosNombres(objeto.r_nombre) || !contieneCaracteresPermitidosNombres(objeto.r_apellido_pat) || !contieneCaracteresPermitidosNombres(objeto.r_apellido_mat) )
	{
		mostrarAlerta(0,231);
		return;
	}

	if(!contieneCaracteresPermitidosUsuarios(objeto.r_username))
	{
		mostrarAlerta(0,232);
		return;
	}

	const xhr = new XMLHttpRequest();

	xhr.open('POST','/registro',true);
	
	xhr.onload = function (){
		let respuesta = JSON.parse(xhr.responseText); 
		console.log(respuesta);
		/*ESTE CÓDIGO ES PARA QUE SE MUESTRE LA ALERTA*/
		var codigo_error = parseInt(respuesta);
		var estilo = "error";
		var mensaje = "";
		switch(codigo_error){
			case 1000:
				estilo = "exito";
				mensaje = "¡Genial! Usuario creado correctamente";
			break;
			case 23514:
				mensaje = "Error: La contraseña y la confirmación de contraseña no coinciden";
			break;
			case 23505:
				mensaje = "ERROR: YA EXISTE UN ADMINISTRADOR CON ESE NOMBRE DE USUARIO";
			break;
			default:
				mensaje = "ERROR: UN ERROR INESPERADO HA OCURRIDO";
			break;
		}

		/*PRIMERO DETERMINAMOS SI LA OPERACIÓN FUE EXITOSA O NO*/
		if(estilo == 'exito')
		{
			formRegistro.reset();
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
	};

	xhr.onerror = function(){
		console.error('Error de red al intentar realizar la solicitud');
	};

	xhr.setRequestHeader('Content-Type','application/json');

	console.log(JSON.stringify(objeto));
	xhr.send(JSON.stringify(objeto));
});

const formIniciarSesion = document.getElementById("form_iniciar_sesion");
formIniciarSesion.addEventListener('submit', function (event){
	event.preventDefault();
	
	console.log("Inicio Sesión");
	const datosInicioSesion = new FormData(formIniciarSesion);

	let objeto = {
		is_username: ""
	};

	//let objeto;

	for(item of datosInicioSesion){
		objeto[item[0]] = item[1];
		//console.log("ELemento: ${item[0]}, Valor: $item[1]");
	}

	if(!contieneCaracteresPermitidosUsuarios(objeto.is_username))
	{
		mostrarAlerta(0,232);
		return;
	}

	const xhr = new XMLHttpRequest();

	xhr.open('POST','/iniciar-sesion',true);
	
	xhr.onload = function (){
		var contentType = xhr.getResponseHeader('Content-Type');
		
		let codigo_error_is;
		try {
			codigo_error_is = JSON.parse(xhr.responseText); 
		} catch (error) {
			console.log('Upsis, ocurrió un error');
		}

		if(isNaN(codigo_error_is)){
			document.open();
			document.write(xhr.responseText);
			document.close();
		}
		else
		{
			console.log(codigo_error_is);
			mostrarAlerta(0,codigo_error_is);
		}
		
		//const numerito = parseInt(xhr.responseText);

		// if (contentType && contentType.indexOf('text/html') !== -1) {
		// //if (isNaN(numerito) != true){
		// 	document.open();
		// 	document.write(xhr.responseText);
		// 	document.close();
		// 	//window.location.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(xhr.responseText);
		// 	return;
		// } else {
		// 	console.log('La respuesta no es HTML.');
		// 	let respuesta = JSON.parse(xhr.responseText); 
		// }
		// // if(xhr.status == 200){

		// // }
		// // else
		// // {
		// // 	let respuesta = JSON.parse(xhr.responseText); 
		// // }
		
		// console.log(respuesta);
		// /*ESTE CÓDIGO ES PARA QUE SE MUESTRE LA ALERTA*/
		// var codigo_error = parseInt(respuesta);
		// var estilo = "error";
		// var mensaje = "";
		// switch(codigo_error){
		// 	case 1000:
		// 		estilo = "exito";
		// 		mensaje = "¡Genial! Sesión iniciada correctamente";
		// 	break;
		// 	case 666:
		// 		mensaje = "Error: Contraseña incorrecta";
		// 	break;
		// 	case 555:
		// 		mensaje = "ERROR: NOMBRE DE USUARIO INCORRECTO";
		// 	break;
		// 	default:
		// 		mensaje = "ERROR: UN ERROR INESPERADO HA OCURRIDO";
		// 	break;
		// }

		// console.log(mensaje);
		// /*PRIMERO DETERMINAMOS SI LA OPERACIÓN FUE EXITOSA O NO*/
		// if(estilo == 'exito')
		// {
		// 	console.log('La operación fue un éxito');
		// 	var textoAlerta = document.getElementById('mensaje_alerta_exito');
		// 	textoAlerta.textContent = mensaje;
		// 	var alertElement = document.getElementById('alerta_exito');
		// 	alertElement.classList.remove('esconder');
		// 	alertElement.classList.add('mostrar');
		// 	alertElement.classList.add('mostrarAlerta');
		// 	/*HACE QUE LA ALERTA SE CIERRE AUTOMÁTICAMENTE DESPUÉS DE 5 SEGUNDOS*/
		// 	setTimeout(function(){
		// 		alertElement.classList.remove('mostrar');
		// 		alertElement.classList.add('esconder');
		// 	},5000);
		// }else if(estilo == 'error')
		// {
		// 	console.log('Hubo un error');
		// 	var textoAlerta = document.getElementById('mensaje_alerta_error');
		// 	textoAlerta.textContent = mensaje;
		// 	var alertElement = document.getElementById('alerta_error');
		// 	alertElement.classList.remove('esconder');
		// 	alertElement.classList.add('mostrar');
		// 	alertElement.classList.add('mostrarAlerta');
		// 	/*HACE QUE LA ALERTA SE CIERRE AUTOMÁTICAMENTE DESPUÉS DE 5 SEGUNDOS*/
		// 	setTimeout(function(){
		// 		alertElement.classList.remove('mostrar');
		// 		alertElement.classList.add('esconder');
		// 	},5000);
		// }
	};

	xhr.onerror = function(){
		console.error('Error de red al intentar realizar la solicitud');
	};

	xhr.setRequestHeader('Content-Type','application/json');

	console.log(JSON.stringify(objeto));
	xhr.send(JSON.stringify(objeto));
});

function mostrarAlerta(tipo, codigo){
    /*ESTE CÓDIGO ES PARA ASIGNAR UN MENSAJE A LA ALERTA*/
    var mensaje = "";
    switch(codigo)
    {
		case 666:
			mensaje = "Error: Contraseña incorrecta";
		break;
		case 555:
			mensaje = "ERROR: NOMBRE DE USUARIO INCORRECTO";
		break;
		case 231:
			mensaje = "ERROR: LOS NOMBRES Y APELLIDOS SOLO PUEDEN CONTENER TEXTO"
		break;
		case 232:
			mensaje = "ERROR: EL NOMBRE DE USUARIO SOLO PUEDE CONTENER LETRAS, NÚMEROS Y GUIONES BAJOS"
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