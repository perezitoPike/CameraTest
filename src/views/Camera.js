var videoWidth = 1080;
var videoHeight = 920;
var canvasContext;
var videoTag = document.getElementById('theVideo');
var canvasTag = document.getElementById('theCanvas');
var btnCapture = document.getElementById("btnCapture");
var listaDeDispositivos = document.getElementById('listaDeDispositivos');
var backGroundCamera = document.getElementById('TheBackGroundCamera');
var takingPicture = false;

const socket = io();

const tieneSoporteUserMedia = () =>
    !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia);
const _getUserMedia = (...arguments) =>
    (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);

function obtenerDispositivos(){
    return navigator.mediaDevices.enumerateDevices();
}

const limpiarSelect = ()=>{
    for (let x = listaDeDispositivos.options.length; x >= 0; x--){
        listaDeDispositivos.remove(x);
    }
};

const llenarSelectConDispositivosDisponibles = () => {

        limpiarSelect();
        obtenerDispositivos()
            .then(dispositivos => {
                const dispositivosDeVideo = [];
                dispositivos.forEach(dispositivo => {
                    const tipo = dispositivo.kind;
                    if (tipo === "videoinput") {
                        dispositivosDeVideo.push(dispositivo);
                    }
                });
    
                if (dispositivosDeVideo.length > 0) {
                    dispositivosDeVideo.forEach(dispositivo => {
                        var option = document.createElement('option');
                        option.value = dispositivo.deviceId;
                        option.text = dispositivo.label; 
                        option.className ="btn-dark";                       
                        listaDeDispositivos.appendChild(option);
                    });
                }
            });
    }

    const mostrarStream = idDeDispositivo => {
        _getUserMedia({
                video: {
                    deviceId: idDeDispositivo,
                }
            },
            (streamObtenido) => {    
                stream = streamObtenido;
    
                videoTag.srcObject = stream;
                videoTag.play();
    
                
            }, (error) => {
                console.log("Permiso denegado o error: ", error);
            });
    }

window.onload = () => {
    if(!tieneSoporteUserMedia()){
        alert("Not Camera Connected");
        return;
    }
    llenarSelectConDispositivosDisponibles();
    let stream;
    obtenerDispositivos().then(dispositivos=>{
        const dispositivosDeVideo = [];
        dispositivos.forEach(function(dispositivo){
            const tipo = dispositivo.kind;
            if(tipo == "videoinput"){
                dispositivosDeVideo.push(dispositivo);
            }
        });

        if(dispositivosDeVideo.length > 0){
            mostrarStream(dispositivosDeVideo[0].deviceId);
        }
    
        listaDeDispositivos.onchange = () => {

            if (stream) {
                stream.getTracks().forEach(function(track) {
                    track.stop();
                });
            }
            mostrarStream(listaDeDispositivos.value);
        }
    });
    canvasContext = canvasTag.getContext('2d');    
    btnCapture.addEventListener("click", () => {
        CaptureImage();
    });
};

function CaptureImage() {
    if(takingPicture){
        console.log("Esperando a que termine la anterior captura");
        return;
    }
    takingPicture = true;
    let temporizador = new Temporizador('temporizador', 5, 0, true, SaveCurrentImage);
    temporizador.CurrentCounter();
    backGroundCamera.className = "contentBlack";
    console.log("Capturando Imagen");
}

function SaveCurrentImage() {
    backGroundCamera.className = "Opacidad-Zero-Div";
    canvasTag.setAttribute('width', videoTag.videoWidth);
    canvasTag.setAttribute('height', videoTag.videoHeight);
    canvasContext.drawImage(videoTag, 0, 0, videoTag.videoWidth, videoTag.videoHeight);   
    videoTag.pause();
    SendCaptureToServer();
    let temporizador = new Temporizador('temporizador', 1, 0, false, () => {
        videoTag.play();
        takingPicture = false;
    });
    temporizador.CurrentCounter();
}

function SendCaptureToServer(){
    console.log("Enviando: Datos");
    // var dataURL = theCanvas.toDataURL();
    var dataURL = canvasTag.toDataURL();
    var blob = dataURLtoBlob(dataURL);
    var data = new FormData();
    var fileName = Date.now().toString() +".png";
    data.append("image", blob, fileName);

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        // if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        //     alert(xmlHttp.responseText);
        // }
    }
    //xmlHttp.open("post", "http://164.92.118.98:4000/upload");
    xmlHttp.open("post", "/upload");
    xmlHttp.send(data);
    setTimeout(function () {
        socket.emit("updateImages",fileName);
    }, 1500);
}

function dataURLtoBlob(dataURL) {
    var arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

function Temporizador(id, start, end, showText, call) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.showText = showText;
    this.contador = this.start;

    this.CurrentCounter = function () {
        if (this.contador == this.end) {
            this.contador = null;
            if(this.showText){
                document.getElementById(this.id).innerHTML = "";
            }
            clearTimeout();
            call();
            return;
        }
        if(showText){
            document.getElementById(this.id).innerHTML = this.contador;
        }
        this.contador--;
        setTimeout(this.CurrentCounter.bind(this), 1000);
    };
}

socket.on('arduinoMessage', function (data) {
    var takePicture = process_data(data[0]);
    if (takePicture) {
      CaptureImage();
    }
  });

  function process_data(data) {
    console.log("DATA: "+data == 'T');
    return data == 'T';
  }