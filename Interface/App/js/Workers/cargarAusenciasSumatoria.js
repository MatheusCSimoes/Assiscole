onmessage = function(e) {
  var data = e.data;
  var historial = data.historial;
  var tipo = data.tipo;
  for (var j = 0; j < historial.length; j++) {
    //Si son alumnos no se coloca Id
    var historialTemp = {};
    if(tipo == 4){
      historialTemp = {
        Id: historial[j].Id, //Id me sirve para buscarlo despues en la lupa
        Numero: (j+1),
      }
    }
    historialTemp.Dia = historial[j].Nombre;
    historialTemp.Cantidad = historial[j].CantidadAusencias;
    historialTemp.CantidadLlamadas = historial[j].CantidadLlamadas;
    historialTemp.Porcentaje = Math.round((historial[j].CantidadAusencias*100)/(historial[j].CantidadEstudiantes*historial[j].CantidadLlamadas/historial[j].CantidadCursos)*10)/10
    
    postMessage(
      {
        caso: "atualizar",
        historialTemp: historialTemp,
        j: j,
      });
  }
  postMessage(
      {
        caso: "fin",
      });
  self.close();
}
