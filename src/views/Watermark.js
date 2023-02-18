var canvas1 = document.getElementById("theCanvas");
var ctx1 = canvas1.getContext("2d");

// Creamos un nuevo canvas
var canvas2 = document.getElementById("theLogo");
var ctx2 = canvas2.getContext("2d");

// Imagen original
var imageOriginal = new Image();

// Imagen marca de agua
var imageAgua = new Image();

// Función inicial de jQuery
function StartWatermark(urlData) {
    // Original
    imageOriginal.crossOrigin = "anonymous";
  imageOriginal.src = $('#original').attr('src');
  // Marca de agua
  imageAgua.crossOrigin = "anonymous";
  imageAgua.src = $('#logo').attr('src');
  // Siempre la marca de agua tiene que ser menor que la imagen original
  if(imageOriginal.width < imageAgua.width || 
    imageOriginal.height < imageAgua.height)
  {
    alert('Marca de agua menor que imagen original');
  }
  else
  {
    // Asignamos la misma altura y ancho de la imagen al canvas
    ctx1.canvas.height = imageOriginal.height;
    ctx1.canvas.width = imageOriginal.width;

    // Dibujamos la imagen en el canvas
    ctx1.drawImage(imageOriginal,0,0);

    // Asignamos la misma altura y ancho de la imagen al canvas
    ctx2.canvas.height = imageAgua.height;
    ctx2.canvas.width = imageAgua.width;

    // Dibujamos la imagen en el canvas
    ctx2.drawImage(imageAgua,0,0);

    // Obtenemos la matriz de información de la imagen original
    var imgData1 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    var data1 = imgData1.data;

    // Obtenemos la matriz de información de la imagen logo
    var imgData2 = ctx2.getImageData(0,0,canvas2.width,canvas2.height);
    var data2 = imgData2.data;

    // Calculo de la posición central de la imagen
    var centroXmin = Math.round((imageOriginal.width /2) - (imageAgua.width / 2));
    var centroXmax = Math.round((imageOriginal.width /2) + (imageAgua.width / 2));
    var centroYmin = Math.round((imageOriginal.height /2) - (imageAgua.height / 2));
    var centroYmax = Math.round((imageOriginal.height /2) + (imageAgua.height / 2));

    // Variable para almacenar posición
    var posicion = 0;
    var posicionLogo = 0;

    // Recorremos las filas y las columnas de la imagen, píxel a píxel
    for (var x = centroXmin; x < centroXmax; x++) {
      for (var y = centroYmin; y < centroYmax; y++) {

        // Obtenemos posición
        posicion = 4 * (y * imageOriginal.width + x);
        posicionLogo = 4 * ((y - centroYmin) * imageAgua.width + (x - centroXmin));

        // No tenemos en cuenta el negro
        if(data2[posicionLogo] >= 100 &&
          data2[posicionLogo + 1] >= 100 &&
          data2[posicionLogo + 2] >= 100)
        {
          data1[posicion] = (data2[posicionLogo] + data1[posicion])/2;
          data1[posicion + 1] = (data2[posicionLogo + 1] + data1[posicion + 1])/2;
          data1[posicion + 2] = (data2[posicionLogo + 2] + data1[posicion + 2])/2;
        }
      }
    }

    // Asignamos la imagen al Canvas
    ctx1.putImageData(imgData1,0,0);
    ctx2.putImageData(imgData2,0,0);
  }
}