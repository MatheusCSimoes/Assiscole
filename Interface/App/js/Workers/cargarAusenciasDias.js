onmessage = function(e) {
  var data = e.data;
  var dias = data.dias;
  var historial = data.historial;
  var esDiasSemana = data.esDiasSemana;
  var dataW = [];
  var nombres = [];
  var pos = [];
  //Primero los Dias
  for (var i = 0; i < historial.length; i++) {
    if(nombres.indexOf(historial[i].Nombre) < 0){
      nombres.push(historial[i].Nombre);      
      if(!esDiasSemana)    
        dataW.push([]);
      else
        dataW.push([0,0,0,0,0]);
      pos.push({
        index:pos.length,
        cantidad:0,
      })
    }
  }

  for (var i = 0; i < dias.length; i++) {
    //Luego los nombres (Sedes,Jornadas,Cursos o Alumnos)
    for (var k = 0; k < nombres.length; k++) {
      if(!esDiasSemana)
        dataW[k].push(0);
      //Revisa lo que respondio la consulta para cargar las ausencias
      for (var j = 0; j < historial.length; j++) {
        if(historial[j].Nombre == nombres[k]){              
          var date = new Date(historial[j].Dia);
          var mes = date.getUTCMonth() + 1;
          var dia = date.getUTCDate();
          if(dias[i] == mes + '/' + dia)
          {
            if(!esDiasSemana)    
              dataW[k][i] += parseInt(historial[j].Cantidad);
            else
              dataW[k][date.getDay()] += parseInt(historial[j].Cantidad);
            pos[k].cantidad += parseInt(historial[j].Cantidad);
          }
        }
      }          
    }

    postMessage(
      {
        caso: "atualizar",
        i: i,
      });
  }

  pos.sort(function(a, b){
      return b.cantidad - a.cantidad;
    })

  postMessage(
    {
      caso: "fin",
      data: dataW,
      nombres: nombres,
      pos: pos,
    });
  self.close();
}
