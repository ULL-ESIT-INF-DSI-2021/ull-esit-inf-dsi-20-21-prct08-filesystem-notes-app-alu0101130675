/**
 * clase para representar una nota de la aplicación
 */
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
