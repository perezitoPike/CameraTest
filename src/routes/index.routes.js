const { Router } = require('express');
const path = require('path');
const router = Router();
// const { v1: uuidv1 } = require('uuid');

const fs = require('fs');
const Jimp = require("jimp-watermark");

const multer = require('multer');
// const { dir } = require('console');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        // cb(null, uuidv1() + path.extname(file.originalname).toLowerCase());
        cb(null, file.originalname);
    }
});

//Routes
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/photos',(req,res)=>{
    let images = GetImagesFromDirectory(path.join(__dirname, '../public/uploads'));
    res.json(images);
});

router.get('/addWaterMark',(req,res)=>{
    AddWatermark();
    console.log("Terminado");
});

router.get('/photoGalery', (req, res) => {
    let images = GetImagesFromDirectory(path.join(__dirname, '../public/uploads'));
    res.render('PhotoGalery', { images: images });
});

router.get('/photoMobileGalery', (req, res) => {
    let images = GetImagesFromDirectory(path.join(__dirname, '../public/uploads'));
    res.render('PhotoGalery', { images: images });
});

router.get('/deletePhotoGalery',(req,res)=>{
    DeleteImagesFromDirectory(path.join(__dirname, '../public/uploads'));
    let images = [];
    res.render('PhotoGalery', { images: images });
});

function GetImagesFromDirectory(dirPath) {
    let allImages = [];
    let files = fs.readdirSync(dirPath);

    for (let i in files) {
        let file = files[i];
        let fileLocation = path.join(dirPath, file);
        var stat = fs.statSync(fileLocation);

        if (stat && stat.isDirectory()) {
            getImagesFromDir(fileLocation);
        } else if (stat && stat.isFile() && ['.jpg', '.png'].indexOf(path.extname(fileLocation)) !== -1) {
            // allImages.push('static/'+ file);
            allImages.push(file);
        }
    }
    return allImages;
}

function DeleteImagesFromDirectory(dirPath){
    let files = fs.readdirSync(dirPath);

    for (let i in files) {
        let file = files[i];
        let fileLocation = path.join(dirPath, file);
        var stat = fs.statSync(fileLocation);

        if (stat && stat.isDirectory()) {
            getImagesFromDir(fileLocation);
        } else if (stat && stat.isFile() && ['.jpg', '.png'].indexOf(path.extname(fileLocation)) !== -1) {
            fs.unlinkSync(fileLocation);
        }
    }
}

const upload = multer({
    storage,
    dest: path.join(__dirname, '../public/uploads'),
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extMineType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname));
        if (extMineType && extName) {
            return cb(null, true);
        }
        cb("Error: Archivo con formato no valido");
    }
}).single('image');

router.post('/upload', upload, (req, res) => {
    console.log(req.file);
    res.render('index');
});

function AddWatermark(){
    let images = GetImagesFromDirectory(path.join(__dirname, '../public/uploads'));
    images.forEach(element => {
        let options ={
                'ratio': 0.5,
                'opacity': 0.7,
                dest:'static',
            };
                Jimp.addWatermark('static/'+element, "./img/Logo.png", options);
    });
    console.log("Actualizaicon completa");
}

module.exports = router;