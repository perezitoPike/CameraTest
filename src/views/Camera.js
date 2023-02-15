var videoWidth = 1080;
var videoHeight = 920;
var canvasContext;
var videoTag = document.getElementById('theVideo');
var canvasTag = document.getElementById('theCanvas');
var btnCapture = document.getElementById("btnCapture");
var listaDeDispositivos = document.getElementById('listaDeDispositivos');

videoTag.setAttribute('width', videoWidth);
videoTag.setAttribute('height', videoHeight);
canvasTag.setAttribute('width', videoWidth);
canvasTag.setAttribute('height', videoHeight);


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
                        const option = document.createElement('option');
                        option.value = dispositivo.deviceId;
                        option.text = dispositivo.label;
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
                // $estado.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
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
    // navigator.mediaDevices.getUserMedia({
    //     audio: false,
    //     video: {
    //         width: videoWidth,
    //         height: videoHeight
    //     }
    // }).then(stream => {
    //     videoTag.srcObject = stream;
    // }).catch(e => {
    //     document.getElementById('errorTxt').innerHTML = 'ERROR: ' + e.toString();
    // });

    canvasContext = canvasTag.getContext('2d');
    
    btnCapture.addEventListener("click", () => {
        CaptureImage();
    });
};

function CaptureImage(){
    canvasContext.drawImage(videoTag, 0, 0, videoWidth, videoHeight);
    SendCaptureToServer();
}

function SendCaptureToServer(){
    var dataURL = theCanvas.toDataURL();
    var blob = dataURLtoBlob(dataURL);
    var data = new FormData();
    data.append("image", blob, "capturedImage.png");

    var xmlHttp = new XMLHttpRequest();
    // xmlHttp.onreadystatechange = function () {
    //     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    //         alert(xmlHttp.responseText);
    //     }
    // }
    // xmlHttp.open("post", "http://164.92.118.98:4000/upload");
    xmlHttp.open("post", "/upload");
    xmlHttp.send(data);
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