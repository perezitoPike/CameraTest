const socket = io();

const urlImage = 'static/';

function UpgradeStartImages(images){
    for (var count = 0; count<20;count++){
        var id = "contentImages" + count.toString();
        var contentImage = document.getElementById(id);
        if(count%2==0){
            contentImage.innerHTML += GetDivCreated(images);
        }else{
            contentImage.innerHTML += GetDivCreated(images.reverse());
        }
    }
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
    for (var count = 0; count<20;count++){
        var id = "contentImages" + count.toString();
        var contentImage = document.getElementById(id);
        contentImage.innerHTML += GetCurrentImage(fileName) + contentImages_UP.innerHTML;
    }
});