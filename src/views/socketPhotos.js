const socket = io();

const urlImage = 'static/';

function UpgradeStartImages(images, amount) {
    for (var count = 0; count < amount; count++) {
        var id = "contentImages" + count.toString();
        var contentImage = document.getElementById(id);
        if (count % 2 == 0) {
            contentImage.innerHTML += GetDivCreated(images);
        } else {
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
    var currentRedirection = "http://164.92.118.98:4000/watermark/"+fileName;
    return "<div class='swiper-slide swiper-auto-full ver2'> <a href='" + currentRedirection + "'><img src='" + currentDirImage + "' alt='' /></a></div>";
    //return "<div class='swiper-slide swiper-auto-full ver2'> <a href='" + currentDirImage + "'><img src='" + currentDirImage + "' alt='' /></a></div>";
}
socket.on("updateNewImage", function (fileName) {
    for (var count = 0; count < 20; count++) {
        var id = "contentImages" + count.toString();
        var contentImage = document.getElementById(id);
        contentImage.innerHTML = GetCurrentImage(fileName) + contentImage.innerHTML;
    }
});