const tablaBuscador = document.getElementById('tabla-buscador');
const cuerpoTablaBuscador = tablaBuscador.tBodies[0];
const cantidadResultadosTabla = document.getElementById('cantidad-resultados-tabla');
const casillas = document.querySelectorAll('.casilla');
const botonEnviar = document.getElementById('b-enviar');
const botonRegresar = document.getElementById('boton-regreso-buscador');

window.addEventListener('popstate', function (event) {
    // Deshacer la navegación hacia adelante o hacia atrás
    history.pushState(null, null, document.URL);
  });

botonRegresar.addEventListener('click',(event)=>{
    event.preventDefault();
    console.log('Redirigiendo a Inicio');
    
    window.location.href = '/inicio.html';
});

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


document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar el campo de texto
    var campoDeTexto = document.getElementById('b-buscar');
  
    // Inicializar el temporizador
    var temporizador;
  
    // Agregar un evento de escucha para el evento 'input' (cuando se escribe algo)
    campoDeTexto.addEventListener('input', function () {
      // Limpiar el temporizador existente si existe
      clearTimeout(temporizador);
  
      // Configurar un nuevo temporizador que ejecutará la función después de 1000 milisegundos (1 segundo)
      temporizador = setTimeout(async function () {
        // Lógica que se ejecutará después de 1 segundo de inactividad
        //console.log('Han pasado 1 segundo desde la última letra escrita: ', campoDeTexto.value);
        // Aquí puedes llamar a tu función personalizada
        const campoTexto = document.getElementById('b-buscar');
        const valorCampoTexto = quitarCaracteresEspeciales(campoTexto.value);
        const campoFiltro = document.getElementById('b-filtrar-por');
        const valorCampoFiltro = campoFiltro.value;
        const podemosContinuar = validarCampos(valorCampoFiltro,valorCampoTexto);
        if(!podemosContinuar){
            return;
        }
        await inicializarTablaFiltrada(valorCampoTexto,valorCampoFiltro,valorCampoFiltro,'ASC');
        blanquearCasillas();
        const cabecera = document.getElementById(valorCampoFiltro);
        console.log(valorCampoFiltro);
        console.log(cabecera);
        console.log(cabecera.classList);
        cabecera.classList.remove('blanco');
        cabecera.classList.add('texto-rojo');
        
        const icono = cabecera.querySelector('i');
        icono.classList.remove('fa-sort-up');
        icono.classList.remove('fa-sort');
        icono.classList.add('fa-sort-down');
      }, 1000);
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar el elemento select
    var miSelect = document.getElementById('b-filtrar-por');
  
    // Agregar un evento de escucha para el evento 'change'
    miSelect.addEventListener('change', async function () {
      // Lógica que se ejecutará cuando se seleccione otra opción
      //console.log('Se seleccionó la opción: ', miSelect.value);
      // Aquí puedes llamar a tu función personalizada
        const campoTexto = document.getElementById('b-buscar');
        const valorCampoTexto = quitarCaracteresEspeciales(campoTexto.value);
        //const campoFiltro = document.getElementById('b-filtrar-por');
        const valorCampoFiltro = this.value;
        const podemosContinuar = validarCampos(valorCampoFiltro,valorCampoTexto);
        if(!podemosContinuar){
            return;
        }
        await inicializarTablaFiltrada(valorCampoTexto,valorCampoFiltro,valorCampoFiltro,'ASC');
        blanquearCasillas();
        const cabecera = document.getElementById(valorCampoFiltro);
        console.log(valorCampoFiltro);
        console.log(cabecera);
        console.log(cabecera.classList);
        cabecera.classList.remove('blanco');
        cabecera.classList.add('texto-rojo');
        
        const icono = cabecera.querySelector('i');
        icono.classList.remove('fa-sort-up');
        icono.classList.remove('fa-sort');
        icono.classList.add('fa-sort-down');
    });
  });

// botonEnviar.addEventListener('click', async (event)=>{
//     event.preventDefault();
//     // console.log(cuerpoTablaBuscador.rows);
//     // await vaciarTabla();
//     // console.log(tablaBuscador.tBodies[0]);
//     // console.log(tablaBuscador.tBodies.length);

// });

function validarCampos(valorCampoFiltro, valorCampoTexto){
    if(valorCampoFiltro == 'id_miembro' || valorCampoFiltro == 'telefono')
    {
        if(contieneCaracteresPermitidosNumeros(valorCampoTexto) == false)
        {
            console.log('No se pudo mi chavo xd');
            mostrarAlerta(0,223);
            return false;
        }
    }
    else if(valorCampoFiltro == 'nombre' || valorCampoFiltro == 'apellido_pat' || valorCampoFiltro == 'apellido_mat')
    {
        if(contieneCaracteresPermitidosNombres(valorCampoTexto) == false)
        {
            console.log('No se pudo mi chavo xd');
            mostrarAlerta(0,222);
            return false;
        }
    }
    else if(valorCampoFiltro == 'correo')
    {
        if(contieneCaracteresPermitidosCorreos(valorCampoTexto) == false)
        {
            console.log('No se pudo mi chavo xd');
            mostrarAlerta(0,224);
            return false;
        }
    }
    return true;
}

function blanquearCasillas(){
    casillas.forEach(e => {
        const eicono = e.querySelector('i');
        e.classList.remove('texto-rojo');
        e.classList.add('blanco');
        eicono.classList.remove('fa-sort-up');
        eicono.classList.remove('fa-sort-down');
        eicono.classList.add('fa-sort');
    });
}

// Agregamos un evento a cada elemento
casillas.forEach(casilla => {
    casilla.addEventListener('click', async function(event) {
        //Verificamos en que estado se encuentra actualmente el span
        const icono = this.querySelector('i');
        let anadirFaSortDown;
        
        console.log(this.classList);
        if(icono.classList.contains('fa-sort') || icono.classList.contains('fa-sort-up'))
        {
            // console.log('Debes añadir la clase fa-sort-down');
            anadirFaSortDown = true;
        }
        else /*if(this.classList.contains('fa-sort-down'))*/
        {
            // console.log('Debes añadir la clase fa-sort-up');
            anadirFaSortDown = false;
        }
        
        // Afecta a todos los elementos con la misma clase
        blanquearCasillas();

        // Afecta solo al elemento específico que desencadenó el evento
        this.classList.remove('blanco');
        this.classList.add('texto-rojo');

        //Cambiamos el icono de la casilla
        // this.textContent = 'Hola';
        const campoTexto = document.getElementById('b-buscar');
        const valorCampoTexto = quitarCaracteresEspeciales(campoTexto.value);
        const campoFiltro = document.getElementById('b-filtrar-por');
        const valorCampoFiltro = campoFiltro.value;

        const podemosContinuar = validarCampos(valorCampoFiltro,valorCampoTexto);
        if(!podemosContinuar){
            return;
        }

        const valorOrden = this.getAttribute('name');

        if(anadirFaSortDown == true)
        {
            icono.classList.remove('fa-sort-up');
            icono.classList.remove('fa-sort');
            icono.classList.add('fa-sort-down');
            await inicializarTablaFiltrada(valorCampoTexto,valorCampoFiltro,valorOrden,'ASC');
        }
        else{
            icono.classList.remove('fa-sort-down');
            icono.classList.remove('fa-sort');
            icono.classList.add('fa-sort-up');
            await inicializarTablaFiltrada(valorCampoTexto,valorCampoFiltro,valorOrden,'DESC');
        }
        
        // icono.classList.remove('fa-solid fa-sort');

        // Evita que el evento se propague a elementos superiores (opcional)
        event.stopPropagation();
    });
});

inicializarTabla();

async function inicializarTabla(){
    //await vaciarTabla();
    const datosTabla = JSON.parse(await llamarBuscadorGlobal());
    console.log(datosTabla);
    await rellenarTabla(datosTabla);
    blanquearCasillas();
    const cabecera = document.getElementById('id_miembro');
    console.log(cabecera);
    console.log(cabecera.classList);
    cabecera.classList.remove('blanco');
    cabecera.classList.add('texto-rojo');
    
    const icono = cabecera.querySelector('i');
    icono.classList.remove('fa-sort-up');
    icono.classList.remove('fa-sort');
    icono.classList.add('fa-sort-down');
    calcularResultadosEncontrados(datosTabla.length);
}

async function inicializarTablaFiltrada(valor, campo, filtro, orden){
    //await vaciarTabla();
    console.log('Imprimiendo atributos desde inicializarTablaFiltrada');
    console.log('Valor: ' + valor + " Campo: " + campo + " Filtro: " + filtro + " Orden: " + orden)
    const datosTabla = JSON.parse(await llamarBuscadorFiltrado(valor, campo, filtro, orden));
    console.log('Imprimiendo datos de la tabla');
    console.log(datosTabla);
    rellenarTabla(datosTabla);
    calcularResultadosEncontrados(datosTabla.length);
}

function vaciarTabla() {
    return new Promise(resolve => {
      const tabla = document.getElementById('tabla-buscador');
      const tbodyExistente = tabla.querySelector('tbody');
  
      if (tbodyExistente) {
        // Si hay un tbody existente, elimínalo
        tabla.removeChild(tbodyExistente);
      }
  
      // Crea un nuevo tbody
      const nuevoTbody = document.createElement('tbody');
      tabla.appendChild(nuevoTbody);
  
      resolve(); // Resuelve la promesa una vez que la operación está completa
    });
  }

// async function vaciarTabla(){
//     // console.log(cuerpoTablaBuscador.rows);
//     console.log(tablaBuscador.tBodies[0]);
//     while(cuerpoTablaBuscador.rows.length > 0){
//         cuerpoTablaBuscador.deleteRow(0);
//     }
//     console.log(tablaBuscador.tBodies[0]);
//     // const tabla = document.getElementById('tabla-buscador');
//     // const tbodyExistente = tabla.querySelector('tbody');
//     // console.log(tablaBuscador.tBodies[0]);
//     // if(tbodyExistente){
//     //     tbodyExistente.innerHTML = '';
//     // }
//     //console.log(tablaBuscador.childElementCount);
//     // console.log(tablaBuscador.tBodies[0]);
//     // while(tablaBuscador.chi){

//     // }
//     // return new Promise(resolve =>{
//     //     const tablaBuscadorTemporal = document.getElementById('tabla-buscador');
//     //     const cuerpoTablaBuscadorTemporal = tablaBuscadorTemporal.tBodies[0];
//     //     console.log(cuerpoTablaBuscadorTemporal);

//     //     resolve();
//     // });
// }

function calcularResultadosEncontrados(cantResultados){
    if (cantResultados == 0)
    {
        cantidadResultadosTabla.textContent = 'Ningún resultado encontrado :(';
    }
    else
    {
        cantidadResultadosTabla.textContent = '¡' + cantResultados + ' resultado(s) encontrados!';
    }
}

function rellenarTabla(sociosRegistrados){
    console.log('Estamos en rellenarTabla');
    console.log(sociosRegistrados);
    // for(var socio of sociosRegistrados){
    //     console.log(socio.id_miembro);
    //     let nuevaFilaTablaBuscador = tablaBuscador.insertRow(-1);
    //     let nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(0);
    //     nuevaCeldaTablaBuscador.textContent = socio.id_miembro;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(1);
    //     nuevaCeldaTablaBuscador.textContent = socio.nombre;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(2);
    //     nuevaCeldaTablaBuscador.textContent = socio.apellido_pat;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(3);
    //     nuevaCeldaTablaBuscador.textContent = socio.apellido_mat;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(4);
    //     nuevaCeldaTablaBuscador.textContent = socio.telefono;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(5);
    //     nuevaCeldaTablaBuscador.textContent = socio.correo;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(6);
    //     nuevaCeldaTablaBuscador.textContent = socio.miembro_desde;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(7);
    //     nuevaCeldaTablaBuscador.textContent = socio.vigencia;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(8);
    //     nuevaCeldaTablaBuscador.textContent = socio.activo;

    //     nuevaCeldaTablaBuscador = nuevaFilaTablaBuscador.insertCell(9);
    //     nuevaCeldaTablaBuscador.textContent = socio.nombre_nivel;
    // }
    let cuerpo = document.querySelector('#t-body');
    let out = "";
    for(let socio of sociosRegistrados)
    {
        out+= `<tr>
            <td>${socio.id_miembro}</td>
            <td>${socio.nombre}</td>
            <td>${socio.apellido_pat}</td>
            <td>${socio.apellido_mat}</td>
            <td>${socio.telefono}</td>
            <td>${socio.correo}</td>
            <td>${socio.miembro_desde}</td>
            <td>${socio.vigencia}</td>
            <td>${socio.activo}</td>
            <td>${socio.nombre_nivel}</td>
        </tr>`;
    }
    cuerpo.innerHTML = out;
}

async function llamarBuscadorGlobal(){
    return new Promise((resolve, reject) => {
      console.log('Verificando socios en la Base de Datos');
    
        // Realizar una solicitud al servidor para manejar el archivo.
        const xhr = new XMLHttpRequest();
    
        xhr.open('POST','/buscador-global','true');
        
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

  async function llamarBuscadorFiltrado(valor, campo, filtro, orden){
    return new Promise((resolve, reject) => {
      console.log('Verificando socios filtrados en la Base de Datos');
    
        //Realizar una solicitud al servidor para manejar el archivo.
        const xhr = new XMLHttpRequest();
    
        xhr.open('POST','/buscador-filtrado','true');
        
        xhr.onload = function ()
        {
          //let respuesta = JSON.parse(xhr.responseText); 
          //console.log(respuesta);
          resolve(xhr.responseText);
        }
  
        xhr.onerror = function()
        {
          console.error('Error de red al intentar realizar la solicitud');
          reject(new Error(`Error en la petición. Código: ${xhr.status}`));
        };
      
        xhr.setRequestHeader('content-type', 'application/json');
      
        // console.log(JSON.stringify(objeto));
        let objeto = {
            valor: "",
            campo: "",
            filtro: "",
            orden: ""
        };

        objeto.valor = valor;
        objeto.campo = campo;
        objeto.filtro = filtro;
        objeto.orden = orden;

        console.log('Imprimiendo atributos desde llamarBuscadorFiltrado');
        console.log(objeto);

        xhr.send(JSON.stringify(objeto));
        //xhr.send('');
    });
  }

  function mostrarAlerta(tipo, codigo){
    /*ESTE CÓDIGO ES PARA ASIGNAR UN MENSAJE A LA ALERTA*/
    var mensaje = "";
    switch(codigo)
    {
    //   /* ERRORES EN LA BASE DE DATOS */
    //   case 23503:
    //     mensaje = "ERROR: EL NÚMERO DE SOCIO INGRESADO NO EXISTE"
    //   break;
    //   /* CASOS EXITOSOS */
    //   case 1000:
    //     mensaje = "¡Genial! Imagen subida correctamente";
    //   break;
    //   /* ERRORES DE LÓGICA */
    //   case 777:
    //     mensaje = "ERROR: NO SE PUEDE VOLVER A REGISTRAR UNA ENTRADA SIN ANTES REGISTRAR UNA SALIDA";
    //   break;
    //   case 888:
    //     mensaje = "ERROR: NO SE PUEDE REGISTRAR UNA SALIDA SIN REGISTRAR UNA ENTRADA ANTES";
    //   break;
        case 222:
            mensaje = "ERROR: Si quieres buscar a un socio por su nombre o apellidos, solo puedes ingresar letras y espacios en el campo de búsqueda";
        break;
        case 223:
            mensaje = "ERROR: Si quieres buscar a un socio por su no. de socio o telefono, solo puedes ingresar números en el campo de búsqueda";
        break;
        case 224:
            mensaje = "ERROR: Si quieres buscar a un socio por su correo, solo puedes ingresar letras, guiones (-), guiones bajos (_), puntos (.) y arrobas (@) en el campo de búsqueda";
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