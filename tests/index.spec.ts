import 'mocha';
import {expect} from 'chai';
import {prueba} from '../src/index';

describe('prueba test', () => {
  it('prueba(', () => {
    expect(prueba(5)).to.be.equal(6);
  });
});