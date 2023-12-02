////////////////////////////Step 1 Rendering your html page////////////////////////////////////////////

const express=require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises'); // Importa el módulo 'fs/promises' para manejar promesas de funciones fs
const app=express();
const port= 3333;

const bodyParser=require('body-parser'); 

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "\\login.html");
});

app.get('/submit',function(req,res){
  console.log("Data Saved");
})

////////////////////////////Step 2 Connection with Postgres////////////////////////////////////////////

const { Pool } = require('pg');

const config = {
		user: 'postgres',
		port: '5433',
		password: 'oracle',
		database: 'rafis2'
};

const pool = new Pool(config);

const selectAdmins = async () => {
	try {
		const text = 'SELECT * FROM administradores';
		const res = await pool.query(text);
		console.log(res.rows);
	} catch (e) {
		console.log(e);
	}
	
}

// const insertAdmins = async (arr) => {
//   try {
// 		console.log(arr);
//     const text = 'INSERT INTO administradores VALUES ($1,$2,$3,$4,MD5($5),MD5($6),$7)';
// 		const res = await pool.query(text,arr);
// 		console.log(res.rows);
//     console.log('¡Datos insertados correctamente!')
//     return 500;
// 	} catch (e) {
// 		console.log(e);
//     return e.code;
// 	}
// }

////////////////////////////Step 3  Inserting the values////////////////////////////////////////////

// app.post("/",(req,res)=>{
//     console.log(req.body);
//     const { r_nombre, r_apellido_pat, r_apellido_mat, r_username, r_contra, r_conf_contra, r_privilegiado}=req.body
//     let arr = [r_username, r_nombre, r_apellido_pat, r_apellido_mat, r_contra, r_conf_contra, r_privilegiado];
//     if(r_privilegiado === undefined){
//       arr = [r_username, r_nombre, r_apellido_pat, r_apellido_mat, r_contra, r_conf_contra, "false"];
//     }
//     pool.connect();
//     client.query('INSERT INTO Form VALUES ($1, $2, $3)', [f_name, mail,phone], (err,res)=> {
//         console.log(err,res);
//         client.end() 
//         alert("Data Saved");
//     })
//     selectAdmins();
//     pool.end();

//     insertAdmins(arr);

//     console.log(insertAdmins(arr));
//     res.send(1000);
//     res.sendFile(__dirname + "\\login.html");
//   })

app.get("/registro", (req, res) => {
  res.sendFile(__dirname + "\\login.html");
});

app.post('/registro', async (req, res) => {
  console.log(req.path);
  console.log(req.body);
  const { r_nombre, r_apellido_pat, r_apellido_mat, r_username, r_contra, r_conf_contra, r_privilegiado}=req.body
  let arr = [r_username, r_nombre, r_apellido_pat, r_apellido_mat, r_contra, r_conf_contra, r_privilegiado];
  if(r_privilegiado === undefined){
    arr = [r_username, r_nombre, r_apellido_pat, r_apellido_mat, r_contra, r_conf_contra, "false"];
  }
  pool.connect();
  try {
		console.log(arr);
    const text = 'INSERT INTO administradores VALUES ($1,$2,$3,$4,MD5($5),MD5($6),$7)';
		const response = await pool.query(text,arr);
		console.log("Se recibieron los siguientes datos:");
    console.log(response.rows);
    console.log('¡Datos insertados correctamente!');
    res.send('1000');
	} catch (e) {
		console.log(e);
    res.send((e.code).toString());
    //res.sendFile(__dirname + "\\login.html");
	}
});

app.post('/iniciar-sesion', async (req, res) => {
  console.log(req.path);
  console.log('Mueve el body');
  console.log(req.body);
  const { is_username, is_contra }=req.body
  let arr = [is_username];
  let arr2 = [is_contra];
  pool.connect();
  try {
		console.log(arr);
    const text = 'SELECT contrasena FROM administradores WHERE user_name = $1';
    const response = await pool.query(text,arr);
    console.log(response.rows);
    const text2 = 'SELECT MD5($1) as contrasena';
    const response2 = await pool.query(text2,arr2);
    console.log(response2.rows);
		console.log("Sesión Iniciada correctamente");

    let contra_base = "";
    if(response.rows[0] === undefined){
      res.send('555');
      return;
    }
    else
    {
      contra_base = response.rows[0].contrasena;
      console.log(contra_base);
    }
    

    let contra_ingresada = response2.rows[0].contrasena;
    console.log(contra_ingresada);

    if(contra_base == contra_ingresada)
    {
      console.log('Exito');
      
      const text3 = 'SELECT COUNT(fecha) FROM dias WHERE fecha = CURRENT_DATE';
      const response3 = await pool.query(text3);
      console.log(response3.rows[0].count);
      const diaYaInsertado  = response3.rows[0].count;

      if(diaYaInsertado == '0'){
        //const text4 = 'INSERT INTO dias VALUES (CURRENT_DATE,EXTRACT(DOW FROM CURRENT_DATE))';
        const text4 = 'SELECT EXTRACT(DOW FROM CURRENT_DATE)';
        const response4 = await pool.query(text4);
        console.log(response4.rows[0].date_part);
        dia = response4.rows[0].date_part;
        if(dia == 0){
          const text5 = 'INSERT INTO dias VALUES (CURRENT_DATE,7)';
          console.log('Se insertó una fecha en dias');
          const response4 = await pool.query(text5);
          console.log(response4.rows);
        }
        else
        {
          const text5 = 'INSERT INTO dias VALUES (CURRENT_DATE,EXTRACT(DOW FROM CURRENT_DATE))';
          console.log('Se insertó una fecha en dias');
          const response4 = await pool.query(text5);
          console.log(response4.rows);
        }
      }

      /*const text2 = 'SELECT MD5($1) as contrasena';
      const response2 = await pool.query(text2,arr2);
      console.log(response2.rows);
      console.log("Sesión Iniciada correctamente");*/
  
      // let contra_base = "";
      // if(response.rows[0] === undefined){
      //   res.send('555');
      //   return;
      // }

      //res.send('1000');
      res.status(200).sendFile(__dirname + "\\inicio.html");
    }else
    {
      console.log('Fracaso');
      res.send('666');
    }
    // console.log('¡Datos insertados correctamente!');
    // res.send('1000');
	} catch (e) {
		console.log(e);
    res.send((e.code).toString());
    //res.sendFile(__dirname + "\\login.html");
	}
});

var nueva_insercion;

async function obtenerNombre (){
  //const insertQuery = 'SELECT CURRVAL(pg_get_serial_sequence(\'miembros\',\'id_miembro\'))+1;';
  //miembros_id_miembro_seq
  const insertQuery = 'SELECT NEXTVAL(\'miembros_id_miembro_seq\');';
  const result = await pool.query(insertQuery);
  //res.status(200).json(result.rows[0]);
  const resultado_id = parseInt(result.rows[0].nextval);
  console.log(resultado_id);
  nueva_insercion = resultado_id + 1;
  console.log(nueva_insercion);
}

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ruta donde se guardarán las imágenes
    cb(null, 'C:\\Users\\carlo\\OneDrive\\Documentos Laptop\\JS\\RAFIs 2\\profile_pics');
  },
  filename: function (req, file, cb) {
    // Nombre del archivo en el servidor
    cb(null, nueva_insercion + path.extname(file.originalname));
  }
});

//const upload = multer({ storage: storage });
const upload = multer({
  limits: { fileSize: 1024 * 1024 }, // Ajusta el límite según tus necesidades
  /*storage: storage*/
});

// Ruta para manejar la subida de imágenes
app.post('/enviar-fotos', upload.single('file'), async (req, res) => {
  await obtenerNombre();
  try {
    console.log(1);
    const { originalname, buffer } = req.file;

    // Ruta donde se guardará el archivo de manera local
    console.log(originalname);
    console.log(buffer);
    console.log(nueva_insercion);
    const filePath = path.join('C:\\Users\\carlo\\OneDrive\\Documentos Laptop\\JS\\RAFIs 2\\profile_pics', nueva_insercion + '.jpg');

    // Guardar el archivo en el servidor
    console.log(3);
    await fs.writeFile(filePath, buffer);

    // Puedes hacer más cosas aquí, si es necesario
    console.log(4);
    //res.status(200).json({ mensaje: 'Imagen guardada exitosamente' });
    const rutaRelativa = path.join('profile_pics', nueva_insercion + '.jpg');
    //const rutaRelativa = 'profile_pics\\14.jpg';
    res.send(rutaRelativa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar la imagen' });
  }
});

app.post('/registro-socios', async (req, res) => {
  console.log(req.path);
  console.log(req.body);
  const objetoRecibido = req.body;
  for (const propiedad in objetoRecibido) {
    if (objetoRecibido.hasOwnProperty(propiedad)) {
      const valor = objetoRecibido[propiedad];
      console.log(`Propiedad: ${propiedad}, Valor: ${valor}`);
      // Puedes hacer algo con cada propiedad y valor aquí
    }
  }
  /*for(item of objetoRecibido){
    console.log(item[0]);
    console.log(item[1]);
  }*/
  const { s_nombre, s_apellido_pat, s_apellido_mat, s_telefono, s_correo, s_entrenamiento, s_foto, s_vigencia }=req.body;
  if(s_apellido_mat === undefined){
    s_apellido_mat = 'NULL';
  }
  if(s_telefono === undefined){
    s_telefono = 'NULL';
  }
  if(s_foto === undefined){
    s_foto = 'NULL';
  }
  let arr = [s_nombre, s_apellido_pat, s_apellido_mat, s_telefono, s_correo, s_foto, s_vigencia, s_entrenamiento];
  pool.connect();
  try {
		console.log(arr);
    const text = 'INSERT INTO miembros (nombre,apellido_pat,apellido_mat,telefono,correo,foto,miembro_desde,vigencia,id_nivel,activo) VALUES (UPPER($1),UPPER($2),UPPER($3),$4,$5,$6,CURRENT_DATE,$7,$8,TRUE)';
    //const text = 'SELECT contrasena FROM administradores WHERE user_name = $1';
    const response = await pool.query(text,arr);
    console.log(response.rows);
		console.log("Socio registrado correctamente");

    const insertQuery = 'SELECT CURRVAL(\'miembros_id_miembro_seq\');';
    const result = await pool.query(insertQuery);
    //res.status(200).json(result.rows[0]);
    const resultado_id = result.rows[0].currval;
    console.log(resultado_id);

    res.send(resultado_id);
    // let contra_ingresada = response2.rows[0].contrasena;
    // console.log(contra_ingresada);

    // if(contra_base == contra_ingresada)
    // {
    //   console.log('Exito');
    //   //res.send('1000');
    //   res.status(200).sendFile(__dirname + "\\inicio.html");
    // }else
    // {
    //   console.log('Fracaso');
    //   res.send('666');
    // }
    // console.log('¡Datos insertados correctamente!');
    // res.send('1000');
	} catch (e) {
		console.log(e);
    res.send((e.code).toString());
    //res.sendFile(__dirname + "\\login.html");
	}
});

/*app.post('/enviar-fotos', upload.single('file') ,async (req, res) => {
  console.log('1');
  try {
    console.log('2');
    const { originalname, buffer } = req.file;
    console.log(originalname);
    console.log(buffer);
    const insertQuery = 'INSERT INTO prueba_imagen2 (name, imagen) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(insertQuery, [originalname, buffer]);
    console.log('foto subida correctamente');
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir la foto' });
  }
});*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

app.post('/checador', async (req, res) => {
  console.log('Imprimiendo Body');
  console.log(req.body);
  const { ent , id_socio } = req.body;
  let arr = [id_socio];
  
  console.log('Imprimiendo arr');
  console.log(ent);
    try {
      //console.log(arr);
      const text0 = 'SELECT COUNT(id_miembro) FROM visitas WHERE id_miembro = $1 AND fecha = CURRENT_DATE AND hora_salida IS NULL';
      console.log('VERIFICANDO ENTRADAS');
      const response0 = await pool.query(text0,arr);
      console.log(response0.rows[0].count);
      let cantidadDeFilas = response0.rows[0].count;
      if(cantidadDeFilas > 0)
      {
        if(ent == true)
        {
          /* Se trata de checar la entrada dos veces */
          res.send('777');
          return;
        }
        else
        {
          /* Se checa la salida */
          const text = 'UPDATE visitas SET hora_salida = CURRENT_TIME, entrenando = FALSE WHERE id_miembro = $1 AND entrenando = TRUE';
          console.log('ES SALIDA');
          await pool.query(text,arr);
        }
      }
      else
      {
        if(ent == true)
        {
          /* Se checa la entrada */
          const text = 'INSERT INTO visitas (hora_entrada,entrenando,id_miembro,fecha) VALUES (CURRENT_TIME,TRUE,$1,CURRENT_DATE)';
          console.log('ES ENTRADA');
          await pool.query(text,arr);
        }
        else
        {
          /* Se trata de checar la salida sin haber checado la entrada */
          res.send('888');
          return;
        }
      }

      const text2 = 'SELECT m.id_miembro, m.nombre, m.apellido_pat, m.foto, TO_CHAR(m.vigencia, \'DD-MM-YYYY\') AS vigencia, TO_CHAR(v.hora_entrada, \'HH12:MI:SS AM\') AS hora_entrada , COALESCE(TO_CHAR(v.hora_salida, \'HH12:MI:SS AM\'),\'-----\') AS hora_salida, (m.vigencia - CURRENT_DATE) as diferencia FROM miembros m JOIN visitas v ON m.id_miembro = v.id_miembro WHERE v.id_miembro = $1 AND v.hora_entrada = (SELECT MAX(hora_entrada) FROM visitas WHERE id_miembro = $1 AND fecha = CURRENT_DATE)'
      console.log('SELECCIONANDO DATOS');
      const response2 = await pool.query(text2,arr);
      console.log(response2.rows);

      // const text3 = 'SELECT COUNT(id_miembro) FROM visitas WHERE id_miembro = $1 AND fecha = CURRENT_DATE';
      // console.log('VERIFICANDO ENTRADAS');
      // const response3 = await pool.query(text3,arr);
      // console.log(response3.rows);

      console.log("Entrada checada correctamente");
      res.send(response2.rows);

    } catch (e) {
      console.log(e);
      res.send((e.code).toString());
    }

  // const { is_username, is_contra }=req.body
  // let arr = [is_username];
  // let arr2 = [is_contra];
  // pool.connect();
  // try {
	// 	console.log(arr);
  //   const text = 'SELECT contrasena FROM administradores WHERE user_name = $1';
  //   const response = await pool.query(text,arr);
  //   console.log(response.rows);
  //   const text2 = 'SELECT MD5($1) as contrasena';
  //   const response2 = await pool.query(text2,arr2);
  //   console.log(response2.rows);
	// 	console.log("Sesión Iniciada correctamente");

  //   let contra_base = "";
  //   if(response.rows[0] === undefined){
  //     res.send('555');
  //     return;
  //   }
  //   else
  //   {
  //     contra_base = response.rows[0].contrasena;
  //     console.log(contra_base);
  //   }
    

  //   let contra_ingresada = response2.rows[0].contrasena;
  //   console.log(contra_ingresada);

  //   if(contra_base == contra_ingresada)
  //   {
  //     console.log('Exito');
      
  //     const text3 = 'SELECT COUNT(fecha) FROM dias WHERE fecha = CURRENT_DATE';
  //     const response3 = await pool.query(text3);
  //     console.log(response3.rows[0].count);
  //     const diaYaInsertado  = response3.rows[0].count;

  //     if(diaYaInsertado == '0'){
  //       const text4 = 'INSERT INTO dias VALUES (CURRENT_DATE,EXTRACT(DOW FROM CURRENT_DATE))';
  //       const response4 = await pool.query(text4);
  //       console.log('Se insertó una fecha en dias')
  //       console.log(response4.rows);
  //     }

  //     /*const text2 = 'SELECT MD5($1) as contrasena';
  //     const response2 = await pool.query(text2,arr2);
  //     console.log(response2.rows);
  //     console.log("Sesión Iniciada correctamente");*/
  
  //     // let contra_base = "";
  //     // if(response.rows[0] === undefined){
  //     //   res.send('555');
  //     //   return;
  //     // }

  //     //res.send('1000');
  //     res.status(200).sendFile(__dirname + "\\inicio.html");
  //   }else
  //   {
  //     console.log('Fracaso');
  //     res.send('666');
  //   }
  //   // console.log('¡Datos insertados correctamente!');
  //   // res.send('1000');
	// } catch (e) {
	// 	console.log(e);
  //   res.send((e.code).toString());
  //   //res.sendFile(__dirname + "\\login.html");
	// }
});

app.post('/socios-entrenando', async (req, res) => {
  // console.log('Imprimiendo Body');
  // console.log(req.body);
  // const { ent , id_socio } = req.body;
  // let arr = [id_socio];
  
  // console.log('Imprimiendo arr');
  // console.log(ent);
    try {
      //console.log(arr);
      const text0 = 'SELECT COUNT(id_miembro) FROM visitas WHERE entrenando = TRUE AND fecha = CURRENT_DATE';
      console.log('VERIFICANDO MIEMBROS ENTRENANDO');
      const response0 = await pool.query(text0);
      console.log(response0.rows[0].count);
      let cantidadDeFilas = response0.rows[0].count;
      if(cantidadDeFilas > 0)
      {
        const text1 = 'SELECT m.id_miembro, m.nombre, m.apellido_pat , m.foto FROM miembros m JOIN visitas v ON m.id_miembro = v.id_miembro WHERE v.fecha = CURRENT_DATE AND v.entrenando = TRUE ORDER BY m.id_miembro';
        const response1 = await pool.query(text1);
        console.log(response1.rows);
        const respuesta = response1.rows;
        res.send(respuesta);
      }
      else
      {
        res.send('423');
      }
    } catch (e) {
      console.log(e);
      res.send((e.code).toString());
    }
});

app.get('/buscar-socio', async (req, res) => {
  try 
  {
    res.status(200).sendFile(__dirname + "\\buscador.html");
	} 
  catch (e) 
  {
		console.log(e);
    res.send((e.code).toString());
    //res.sendFile(__dirname + "\\login.html");
	}
});

app.get('/inicio', async (req, res) => {
  try 
  {
    res.status(200).sendFile(__dirname + "\\inicio.html");
	} 
  catch (e) 
  {
		console.log(e);
    res.send((e.code).toString());
    //res.sendFile(__dirname + "\\login.html");
	}
});

app.post('/buscador-global', async (req, res) => {
  // console.log('Imprimiendo Body');
  // console.log(req.body);
  // const { ent , id_socio } = req.body;
  // let arr = [id_socio];
  
  // console.log('Imprimiendo arr');
  // console.log(ent);
  try {
      // //console.log(arr);
      // const text0 = 'SELECT COUNT(id_miembro) FROM visitas WHERE entrenando = TRUE AND fecha = CURRENT_DATE';
      // console.log('VERIFICANDO MIEMBROS ENTRENANDO');
      // const response0 = await pool.query(text0);
      // console.log(response0.rows[0].count);
      // let cantidadDeFilas = response0.rows[0].count;
      // if(cantidadDeFilas > 0)
      // {
      //   const text1 = 'SELECT m.id_miembro, m.nombre, m.apellido_pat , m.foto FROM miembros m JOIN visitas v ON m.id_miembro = v.id_miembro WHERE v.fecha = CURRENT_DATE AND v.entrenando = TRUE ORDER BY m.id_miembro';
      //   const response1 = await pool.query(text1);
      //   console.log(response1.rows);
      //   const respuesta = response1.rows;
      //   res.send(respuesta);
      // }
      // else
      // {
      //   res.send('423');
      // }
      const text = 'SELECT m.id_miembro, m.nombre, m.apellido_pat, CASE WHEN m.apellido_mat = \'\' THEN \'------\' ELSE m.apellido_mat END AS apellido_mat, CASE WHEN m.telefono = \'\' THEN \'------\' ELSE m.telefono END AS telefono , m.correo, TO_CHAR(m.miembro_desde, \'DD/MM/YYYY\') AS miembro_desde, TO_CHAR(m.vigencia, \'DD/MM/YYYY\') AS vigencia, CASE WHEN m.activo = TRUE THEN \'Si\' ELSE \'No\' END AS activo, n.nombre_nivel FROM miembros m JOIN niveles_de_entrenamiento n ON (m.id_nivel = n.id_nivel) ORDER BY m.id_miembro';
      const response = await pool.query(text);
      const respuesta = response.rows;
      console.log(respuesta);
      res.send(respuesta);
    } catch (e) {
      console.log(e);
      res.send((e.code).toString());
    }
});

app.post('/buscador-filtrado', async (req, res) => {
  console.log('Imprimiendo Body desde buscador-global');
  console.log(req.body);
  const { valor , campo, filtro, orden } = req.body;
let arr = [campo/*, valor, filtro*//*, orden*/];
  
  console.log('Imprimiendo arr desde buscador-global');
  console.log(arr);
  try {
      // //console.log(arr);
      // const text0 = 'SELECT COUNT(id_miembro) FROM visitas WHERE entrenando = TRUE AND fecha = CURRENT_DATE';
      // console.log('VERIFICANDO MIEMBROS ENTRENANDO');
      // const response0 = await pool.query(text0);
      // console.log(response0.rows[0].count);
      // let cantidadDeFilas = response0.rows[0].count;
      // if(cantidadDeFilas > 0)
      // {
      //   const text1 = 'SELECT m.id_miembro, m.nombre, m.apellido_pat , m.foto FROM miembros m JOIN visitas v ON m.id_miembro = v.id_miembro WHERE v.fecha = CURRENT_DATE AND v.entrenando = TRUE ORDER BY m.id_miembro';
      //   const response1 = await pool.query(text1);
      //   console.log(response1.rows);
      //   const respuesta = response1.rows;
      //   res.send(respuesta);
      // }
      // else
      // {
      //   res.send('423');
      // }
      let text;
      if(campo == 'id_miembro')
      {
        text = 'SELECT m.id_miembro, m.nombre, m.apellido_pat, CASE WHEN m.apellido_mat = \'\' THEN \'------\' ELSE m.apellido_mat END AS apellido_mat, CASE WHEN m.telefono = \'\' THEN \'------\' ELSE m.telefono END AS telefono , m.correo, TO_CHAR(m.miembro_desde, \'DD/MM/YYYY\') AS miembro_desde, TO_CHAR(m.vigencia, \'DD/MM/YYYY\') AS vigencia, CASE WHEN m.activo = TRUE THEN \'Si\' ELSE \'No\' END AS activo, n.nombre_nivel FROM miembros m JOIN niveles_de_entrenamiento n ON (m.id_nivel = n.id_nivel) WHERE CAST(m.' + campo + ' AS VARCHAR) ILIKE \'%' + valor + '%\' ORDER BY ' + filtro + ' ' + orden;
      }
      else if(campo == 'nombre_nivel')
      {
        text = 'SELECT m.id_miembro, m.nombre, m.apellido_pat, CASE WHEN m.apellido_mat = \'\' THEN \'------\' ELSE m.apellido_mat END AS apellido_mat, CASE WHEN m.telefono = \'\' THEN \'------\' ELSE m.telefono END AS telefono , m.correo, TO_CHAR(m.miembro_desde, \'DD/MM/YYYY\') AS miembro_desde, TO_CHAR(m.vigencia, \'DD/MM/YYYY\') AS vigencia, CASE WHEN m.activo = TRUE THEN \'Si\' ELSE \'No\' END AS activo, n.nombre_nivel FROM miembros m JOIN niveles_de_entrenamiento n ON (m.id_nivel = n.id_nivel) WHERE n.' + campo + ' ILIKE \'%' + valor + '%\' ORDER BY ' + filtro + ' ' + orden;
      }
      else
      {
        text = 'SELECT m.id_miembro, m.nombre, m.apellido_pat, CASE WHEN m.apellido_mat = \'\' THEN \'------\' ELSE m.apellido_mat END AS apellido_mat, CASE WHEN m.telefono = \'\' THEN \'------\' ELSE m.telefono END AS telefono , m.correo, TO_CHAR(m.miembro_desde, \'DD/MM/YYYY\') AS miembro_desde, TO_CHAR(m.vigencia, \'DD/MM/YYYY\') AS vigencia, CASE WHEN m.activo = TRUE THEN \'Si\' ELSE \'No\' END AS activo, n.nombre_nivel FROM miembros m JOIN niveles_de_entrenamiento n ON (m.id_nivel = n.id_nivel) WHERE m.' + campo + ' ILIKE \'%' + valor + '%\' ORDER BY ' + filtro + ' ' + orden;
      }
      
      const response = await pool.query(text);
      const respuesta = response.rows;
      // console.log('Imprimiendo Response');
      // console.log(response);
      console.log('Imprimiendo Respuesta');
      console.log(respuesta);
      res.send(respuesta);
    } catch (e) {
      console.log(e);
      res.send((e.code).toString());
    }
});
