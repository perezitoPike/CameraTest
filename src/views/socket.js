const socket = io();

var contentImages_UP = document.getElementById("contentImages");
var contentImages_Down = document.getElementById("contentImages1");
const urlImage = 'static/';

function UpgradeStartImages(images){
    contentImages_UP.innerHTML += GetDivCreated(images);
    contentImages_Down.innerHTML += GetDivCreated(images.reverse());
}

function GetDivCreated(currentImages) {
    var direction = "";
    currentImages.forEach(element => {
        direction += GetCurrentImage(element);
    });
    return direction;
}

function GetCurrentImage(fileName) {
    var currentDirImage = urlImage + fileName;
    return "<div class='swiper-slide swiper-auto-full ver2'> <a href='" + currentDirImage + "'><img src='" + currentDirImage + "' alt='' /></a></div>";
    //return "<div class='swiper-slide swiper-auto-full ver2'> <a href='" + currentDirImage + "'><img src='" + currentDirImage + "' alt='' /></a></div>";
}
socket.on("updateNewImage", function (fileName) {
    contentImages_UP.innerHTML = GetCurrentImage(fileName) + contentImages_UP.innerHTML;
});