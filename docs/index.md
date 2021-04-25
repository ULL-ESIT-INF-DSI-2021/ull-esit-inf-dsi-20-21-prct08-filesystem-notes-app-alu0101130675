# Práctica 6 - Clases e interfaces genéricas. Principios SOLID
## Introducción
En esta práctica haremos una  aplicación de notas de texto que manejaremos con el uso de comandos mendiante la terminal. La [explicacion](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/) de la aplicacion se explicaran a continuación
### Clase nota
~~~
export class nota {
  /**
   *
   * @param titulo titulo de la nota
   * @param cuerpo cuerpo de la nota
   * @param color color con el que se imprimira la nota
   */
  constructor(private titulo:string,
     public cuerpo:string, private color:string ) {
  }
  /**
    * getter del titulo
    * @returns titulo
    */
  getTitulo() {
    return this.titulo;
  }
  /**
   * getter del cuerpo
   * @returns el contenido del cuerpo
   */
  getCuerpo() {
    return this.cuerpo;
  }
  /**
   * getter del color de la nota
   * @returns el color con el que se imprimira la nota
   */
  getcolor() {
    return this.color;
  }
  /**
   * setter para modificar el cuerpo de la nota
   * @param modificacion cuerpo modificado de la nota
   */
  setCuerpo(modificacion:string) {
    this.cuerpo=modificacion;
  }
}

~~~
Lo primero que hemos realizado para realizar la aplicación es crear una clase nota con sus caracteristicas principales que son:titulo,cuerpo y color.
El resto de la clase se compone de getters de los atributos y un setter para el cuerpo por si quiere cambiar el mensaje
### Clase notaDb
~~~
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
import {nota} from './nota';
export class notaDb {
  constructor(public notes: nota) {
  }
  /**
   * metodo para añadir una nota en formato json
   * @param usuario propietario de la nota
   */
  addNote(usuario:string) {
    const adapter = new FileSync(
        `./notas/${usuario}/${this.notes.getTitulo()}.json`);
    const db = low(adapter);
    db.defaults({usuario: [{titulo: this.notes.getTitulo(),
      body: this.notes.getCuerpo(), color: this.notes.getcolor()}]}).write();
  }
  /**
   * metodo para devolver el cuerpo de una nota en particular
   * @param usuario usuario que es propìetario de la nota
   * @returns cuerpo de la nota seleccionada
  */
  getBody(usuario:string) {
    const adapter = new FileSync(
        `./notas/${usuario}/${this.notes.getTitulo()}.json`);
    const db = low(adapter);
    return db.get('usuario').find({titulo: this.notes.getTitulo()}).value().body;
  }
  /**
   * metodo para devolver el titulo de una nota en particular
   * @param usuario usuario que es propìetario de la nota
   * @returns titulo de la nota seleccionada
   */
  getTitulo(usuario:string) {
    const adapter = new FileSync(
        `./notas/${usuario}/${this.notes.getTitulo()}.json`);
    const db = low(adapter);
    return db.get('usuario').find({titulo: this.notes.getTitulo()}).value().titulo;
  }
  /**
   * metodo para devolver el color de una nota en particular
   * @param usuario usuario que es propìetario de la nota
   * @returns titulo de la nota seleccionada
   */
  getColor(usuario:string) {
    const adapter = new FileSync(
        `./notas/${usuario}/${this.notes.getTitulo()}.json`);
    const db = low(adapter);
    return db.get('usuario').find({titulo: this.notes.getTitulo()}).value().color;
  }
  /**
   * metodo para modificar el cuerpo de una nota
   * @param usuario usuario que es propìetario de la nota
   */
  modificarNota(usuario:string) {
    const adapter = new FileSync(
        `./notas/${usuario}/${this.notes.getTitulo()}.json`);
    const db = low(adapter);
    db.get('usuario').find({titulo: this.notes.getTitulo()})
        .assign({body: this.notes.getCuerpo()}).write();
  }
}

~~~
Esta clase se crea para manejar lo relacionado con la base de datos. Para ello hemos utilizado lowdb como en la anterior práctica.
El metodo addNote añade una nota en formato json en la carpeta en la que el usuario tiene guardadas todas sus notas. Las notas se encuentran en un directorio de nombre notas y dentro se encuentran los directorios de los usuarios.Para añadir una nota le pasamos el usuario a este método como parámetro.Para el nombre del fichero cogemos el título de la nota que lo obtemos con de la misma nota con el getter y con esto ya nos montamos la ruta absoluta para crear la nota en el directorio del usuario.
Las comprobaciones para saber si la nota ya existe se hacen antes de llamar a este método.
La nota añadida tendria un formato como el mostrado a continuación
~~~
{
  "usuario": [
    {
      "titulo": "tituloNota",
      "body": "modificado",
      "color": "yellow"
    }
  ]
}
~~~
Los métodos getBody, getTitulo y getColor son getters para obtener datos desde la nota ya creada.
Buscamos la nota por el nombre de esta, que se corresponde con el titulo y después obtenemos el color, el titulo o el cuerpo dependiendo del método que usemos.
El método modificarNota buscamos la nota por título como en anteriores métodos y modificamos el valor que queremos con assign.
El nombre de usuario que reciben todos los métodos se utiliza para lo mismo, para saber cual es el directorio en el que tenemos que buscar la nota.
### Main de la aplicación
Para el main se explicarán los diferentes comandos de manera individual
#### Comando add
~~~
import * as fs from 'fs';
import * as chalk from 'chalk';
import * as yargs from 'yargs';
import {notaDb} from './notaDb';
import {nota} from './nota';

yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'user name',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'color text',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // comprobamos si el directiorio de notas del usuario existe
    // si no se crea uno
    if (!fs.existsSync(`/home/usuario/practica8/notas/${argv.user}`)) {
      fs.mkdir(`/home/usuario/practica8/notas/${argv.user}`,
          {recursive: false}, (err) => {
            if (err) throw err;
          });
    }
    if (fs.existsSync(
        `/home/usuario/practica8/notas/${argv.user}/${argv.title}.json`)) {
      console.log(chalk.red('la nota ya existe'));
    } else {
      if (typeof argv.title === 'string' && typeof argv.body === 'string' &&
      typeof argv.color === 'string' && typeof argv.user === 'string') {
        if (argv.color =="red" || argv.color =="green" ||
          argv.color =="yellow" || argv.color =="blue") {
          const note=new nota(argv.title, argv.body, argv.color);
          const manejador=new notaDb(note);
          manejador.addNote(argv.user);
          console.log(chalk.green('nota añadida'));
        } else {
          console.log(chalk.red('has introducido un color no disponible'));
        }
      }
    }
  },
});
~~~
Lo primero que hacemos es declarar el comando add que recibe 4 argumentos: el título, el usuario, el el cuerpo y el color.
Una vez declarado lo primero que hacemos es comprobar si el directorio del usuario existe. En caso de que no se crea uno con **fs.mkdir** dentro de del directorio notas
Lo segundo que hacemos es comprobar si la nota existe, en caso de que si imprimimos un mensaje en rojo por la terminal de que la nota existe. En caso de que no, comprobamos que todos los argumentos sean string para que podamos crear el objeto nota ya que si no compruebas esto te da un fallo de que no es de tipo string. Antes de crear el objeto también comprobamos que el color introducido sea válido. En caso de que no mostramos un mensaje rojo por cosola el que decimos que el color no lo tenemos disponible
Una vez la nota creada con los argumentos pasados creamos manejador, que es un objeto de la clase que maneja la base de datos. 
Con manejador llamamos al método addNote pasandole como parametro el usuario que hemos recibido por argumento y ya tendríamos la nota añadida.
#### Comando read
~~~
yargs.command({
  command: 'read',
  describe: 'lista las notas del usuario',
  builder: {
    user: {
      describe: 'user',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (fs.existsSync(
        `/home/usuario/practica8/notas/${argv.user}/${argv.title}.json`)) {
      if (typeof argv.title === 'string' && typeof argv.user === 'string') {
        const note=new nota(argv.title, "body", "color");
        const manejador=new notaDb(note);
        const color=manejador.getColor(argv.user);
        switch (color) {
          case "red":
            console.log(chalk.red(manejador.getTitulo(argv.user)));
            console.log(chalk.red(manejador.getBody(argv.user)));
            break;
          case "blue":
            console.log(chalk.blue(manejador.getTitulo(argv.user)));
            console.log(chalk.blue(manejador.getBody(argv.user)));
            break;
          case "yellow":
            console.log(chalk.yellow(manejador.getTitulo(argv.user)));
            console.log(chalk.yellow(manejador.getBody(argv.user)));
            break;
          case "green":
            console.log(chalk.green(manejador.getTitulo(argv.user)));
            console.log(chalk.green(manejador.getBody(argv.user)));
            break;
          default:
            break;
        }
      }
    } else {
      console.log(chalk.red('la nota no existe'));
    }
  },
});
~~~
El comando read recibe como argumento el usuario y el titulo de la nota que quiere leer.
Lo primero que hacemos es comprobar si la nota existe, en caso de que no imprimimor por pantalla un mensaje en rojo de la nota no existe. En caso de que si utilizamos el if que se uso tambien en el comoando anterior para comprobar si todos los argumentos son string. Despues obtenemos el color de la nota que estamos buscando y con un switch dependiendo del color que nos devuelva dicha nota imprimimos el body y el título de un color u otro.
#### Comando read
~~~
yargs.command({
  command: 'erase',
  describe: 'elimina una nota del usuario',
  builder: {
    user: {
      describe: 'user',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (fs.existsSync(
        `/home/usuario/practica8/notas/${argv.user}/${argv.title}.json`)) {
      fs.rm(
       `/home/usuario/practica8/notas/${argv.user}/${argv.title}.json`,(err) => {
            if (err) throw err;
            else {
              console.log(chalk.green('nota eliminada'));
            }
          });
    } else {
      console.log(chalk.red('la nota no existe'));
    }
  },
});
~~~
El comando erase tiene como argumento el usuario y el titulo de la nota. 
Lo primero que hacemos es comprobar si la nota existe, en caso de que no imprimimos por pantalla un mensaje de color rojo dicienod que no existe la nota.
En caso de que exista la eliminamos utilizando fs.rm. En caso de exito imprimimos un mensaje de color verde que indica que la nota se ha eliminado.

#### Comando ls
~~~
yargs.command({
  command: 'ls',
  describe: 'lista las notas del usuario',
  builder: {
    user: {
      describe: 'user',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (fs.existsSync(`/home/usuario/practica8/notas/${argv.user}`)) {
      const notas: string[] = fs.readdirSync(
          `/home/usuario/practica8/notas/${argv.user}`);
      console.log('Notas');
      notas.forEach((titulo) => {
        if (typeof argv.user === 'string') {
          const note=new nota(titulo.slice(0, titulo.length-5),
              "body", "color");
          const manejador=new notaDb(note);
          const color=manejador.getColor(argv.user);
          switch (color) {
            case "red":
              console.log(chalk.red(manejador.getTitulo(argv.user)));
              break;
            case "blue":
              console.log(chalk.blue(manejador.getTitulo(argv.user)));
              break;
            case "yellow":
              console.log(chalk.yellow(manejador.getTitulo(argv.user)));
              break;
            case "green":
              console.log(chalk.green(manejador.getTitulo(argv.user)));
              break;
            default:
              break;
          }
        }
      });
    } else {
      console.log(chalk.red('el directorio no existe'));
    }
  },
});
~~~
El comando ls recibe como argumento el nombre de usuario.
Primero comprobamos que el directorio del usuario existe, en caso de que no imprimimos que el directorio no existe.
En caso de que sí, leemos el contenido con fs.readdirSync que nos devuelve el nombre de los ficheros del directorio y lo guardamos en notas.
Recorremos ese vector y en cada iteracion creamos una nota con el titulo de la nota.Como los nombres de los ficheros son iguales que los titulos de las notas menos el formato que es .json, a la hota de obtener el titulo usamos el metodo slice para quitarle el formato y asi obtener el titulo con el que poder buscar la nota que quiere el usuario.
El switch que se ha utilizado es el mismo que el de anteriores comandos solo que se imprime unicamente el título de la nota.
#### Comando mod
~~~
yargs.command({
  command: 'mod',
  describe: 'modificar una nota del usuario',
  builder: {
    user: {
      describe: 'user',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'body',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (fs.existsSync(
        `/home/usuario/practica8/notas/${argv.user}/${argv.title}.json`)) {
      if (typeof argv.title === 'string' && typeof argv.user === 'string' &&
           typeof argv.body === 'string') {
        const note=new nota(argv.title, argv.body, "color");
        const manejador=new notaDb(note);
        manejador.modificarNota(argv.user);
        console.log(chalk.green('nota modificada'));
      }
    } else {
      console.log(chalk.red('la nota no existe'));
    }
  },
});
yargs.parse();
~~~
Esta nota recibe como argumento el nombre de usuario, el título de la nota y el cuerpo.
Lo primero que se hace es comprobar si la nota que queremos modicar existe. En caso de que no imprimimos por consola un mensaje en rojo diciendo que la nota no existe.
En caso contrario creamos una nota como en anteriores comandos y llamamos al método modificarNota en el que se realizará la sustitución por el nuevo cuerpo pasado por argumento.
## Diseño
Para el diseño pense que habia que crear una clase para representar una nota con los getter y setter que llevaba y separa de esta otra clase para manejar la base de datos. Por último en el fichero que van los comando lo redacte uno debajo de otro ya que no se me ocurrió otra forma de hacerlo u organizarlo.

## Conclusión
Me ha costado realizar está práctica ya que en la anterior a mi grupo no le dio tiempo de acabar bien lo de lowdb y era algo que aún no entendía bien y he utilizado para resolver esta. Al princio iba a usar diferentos metodos de fs y spawn pero no encontraba la forma de redirigir la salida del comando ls para usarla en mi comando de listar por lo que opté finalmente por lowDb. En definitiva ya se usar lowDb, una herramienta que parecia más complicada de lo que era.


