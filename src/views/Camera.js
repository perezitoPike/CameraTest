var videoWidth = 1080;
var videoHeight = 920;
var canvasContext;
var videoTag = document.getElementById('theVideo');
var canvasTag = document.getElementById('theCanvas');
var btnCapture = document.getElementById("btnCapture");

videoTag.setAttribute('width', videoWidth);
videoTag.setAttribute('height', videoHeight);
canvasTag.setAttribute('width', videoWidth);
canvasTag.setAttribute('height', videoHeight);

window.onload = () => {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: videoWidth,
            height: videoHeight
        }
    }).then(stream => {
        videoTag.srcObject = stream;
    }).catch(e => {
        document.getElementById('errorTxt').innerHTML = 'ERROR: ' + e.toString();
    });

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