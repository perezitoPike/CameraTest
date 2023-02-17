const slider = document.querySelector("#slider");

const btnLeft = document.querySelector("#btn_left");
const btnRight = document.querySelector("#btn_right");

function Next() {
    let sliderSection = document.querySelectorAll(".slider__section_");
    let sliderSectionFirst = sliderSection[0];
    slider.style.marginLeft = "-200%";
    slider.style.transition = "all 0.5s";
    setTimeout(function () {
        slider.style.transition = "none";
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = "-100%";
    }, 500);
}

function Previous(){
    let sliderSection = document.querySelectorAll(".slider__section_");
    let sliderSectionLast = sliderSection[sliderSection.length - 1];
    slider.insertAdjacentElement('afterbegin', sliderSectionLast);
    slider.style.marginLeft = "0";
    slider.style.transition = "all 0.5s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.style.marginLeft = "-100%";
    },500); 
}

btnRight.addEventListener('click', function(){
    Next();
});

btnLeft.addEventListener('click', function(){
    Previous();
});