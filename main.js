// IMPORTANDO MODULOS
const http = require('http');
const url = require('url');
const fs = require('fs');

// CREANDO SERVIDOR
http
    .createServer((request, response) => {

        // CONSTANTES
        const params = url.parse(request.url, true).query;
        const archivo = params.archivo;
        const contenido = params.contenido;
        const nombre = params.nombre;
        const nuevoNombre = params.nuevoNombre;

        // Variable para almacenar la fecha (cumpliendo la condicion de los 0's)
        let hoy = new Date();
        let fechaHoy = `${hoy.getDate()}/0${hoy.getMonth() + 1}/${hoy.getFullYear()}`;

        // CREAR
        if (request.url.includes('/crear')) {
            fs.writeFile(archivo, `${fechaHoy}\n\n${contenido}`, 'utf8', () => {
                response.end(`Archivo ${archivo} creado con exito!`);
            })
        }

        // LEER
        else if (request.url.includes('/leer')) {
            fs.readFile(archivo, 'utf8', (err, data) => {
                response.write(`El archivo ${archivo} fue leido con exito.\nContiene:\n\n${data}`);
                response.end();
            })
        }

        // RENOMBRAR
        else if (request.url.includes('/renombrar')) {
            fs.rename(nombre, nuevoNombre, (err, data) => {
                if (err) {
                    response.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
                    response.end("Ha ocurrido un error al renombrar el archivo");
                } else {
                    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", });
                    response.end(`El archivo con nombre: ${nombre}, fue renombrado como: ${nuevoNombre}`);
                }
            })
        }

        // ELIMINAR
        else if (request.url.includes('/eliminar')) {
            try {
                fs.unlink(archivo, (err) => {
                    if (err) {
                        response.writeHead(400, { "Content-Type": "text/html; charset=utf-8", });
                        response.write(
                            `<h1 style="color: red;">El archivo ${archivo} no fue encontrado.</h1>`
                        )
                        response.end(`El archivo ${archivo} no fue encontrado`);
                    } else {
                        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", });
                        response.write(
                            `<h1 style="color: blue;">Tu solicitud para eliminar el archivo ${archivo} se está
                            procesando...</h1>`
                        );
                        setTimeout(() => {
                            response.end(
                                `<h1 style="color: green;">El archivo "${archivo}" fue eliminado con exito.</h1>`
                            );
                        }, 3000);
                    }
                })
            } catch (error) {
                response.end("Ha ocurrido un error al procesar la solicitud")
            }
        }
        else {
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end("Recurso no disponible");
        }
    })
    .listen(8080, () => { console.log('Escuchando en el puerto 8080') });