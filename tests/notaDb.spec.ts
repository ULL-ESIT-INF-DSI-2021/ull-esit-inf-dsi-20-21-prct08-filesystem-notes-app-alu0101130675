import 'mocha';
import {expect} from 'chai';
import {nota} from "../src/nota";
import {notaDb} from "../src/notaDb";
import * as fs from 'fs';

if (fs.existsSync(
    `/home/usuario/practica8/notas/ejemploTest/tituloNota.json`)) {
  fs.rm(`/home/usuario/practica8/notas/ejemploTest/tituloNota.json`, (err) => {
    if (err) throw err;
  });
}
let note=new nota("tituloNota", "cuerpo nota", "yellow");
let manejador=new notaDb(note);

describe('notadb function test', () => {
  it('Comprobación de getCuerpo()', () => {
    manejador.addNote("ejemploTest");
    expect(manejador.getBody("ejemploTest")).to.be.equal('cuerpo nota');
  });
  it('Comprobación de getTitulo()', () => {
    expect(manejador.getTitulo("ejemploTest")).to.be.equal('tituloNota');
  });
  it('Comprobación de getcolor()', () => {
    expect(manejador.getColor("ejemploTest")).to.be.equal('yellow');
  });
  it('Comprobación de setCuerpo()', () => {
    note.setCuerpo("modificado");
    manejador.modificarNota("ejemploTest");
    expect(manejador.getBody("ejemploTest")).to.be.equal('modificado');
  });
});
