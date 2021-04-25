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


