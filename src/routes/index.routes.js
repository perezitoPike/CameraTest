const { Router } = require('express');
const path = require('path');
const router = Router();

const fs = require('fs');
// const Jimp = require("jimp-watermark");

const multer = require('multer');
// const { dir } = require('console');
const sharp = require("sharp");


const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

//Routes
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/photos', (req, res) => {
    let images = GetImagesFromDirectory(path.join(__dirname, '../public/uploads'));
    res.json(images);
});

router.get('/photoGalery', (req, res) => {
    let images = GetImagesFromDirectory(path.join(__dirname, '../public/uploads'));
    res.render('PhotoGalery', { images: images });
});

router.get('/photoMobileGalery', (req, res) => {
    let images = GetImagesFromDirectory(path.join(__dirname, '../public/uploads'));
    res.render('PhotoMobileGalery', { images: images });
});

router.get('/deletePhotoGalery', (req, res) => {
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

function DeleteImagesFromDirectory(dirPath) {
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
// Sharp
router.get('/Watermark/:imageName', function (req, res) {
    var image = req.params['imageName'];
    var newimage = compositeImages(image, res, req);
});

async function compositeImages(name, res, req) {
    try {
        await sharp(path.join(__dirname, '../public/uploads/', name))
            .composite([
                {
                    input: path.join(__dirname, '../public/frame1.png'),
                    top: 260,
                    left: 0,
                },
            ])
            .toFile(path.join(__dirname, '../public/uploads/', 'wa' + name))
            .then((data) => {
                res.redirect('http://164.92.118.98:4000/static/wa' + name)
            });
    } catch (error) {
        console.log(error);
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

module.exports = router;