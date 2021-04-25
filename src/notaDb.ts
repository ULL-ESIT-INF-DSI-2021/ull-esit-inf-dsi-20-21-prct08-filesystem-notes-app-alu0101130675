const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
import {nota} from './nota';
/**
 * clase para manejar la base de datos
 */
export class notaDb {
  /**
   * 
   * @param notes nota de la que se quiere crear o modificar un fichero
   */
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
