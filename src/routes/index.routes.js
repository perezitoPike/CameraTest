const { Router } = require('express');
const path = require('path');
const router = Router();
const { v1: uuidv1 } = require('uuid');

const fs = require('fs');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuidv1() + path.extname(file.originalname).toLowerCase());
    }
});

//Routes
router.get('/',(req, res)=>{
    res.render('index');
});

router.get('/photoGalery', (req, res) => {
    let images = GetImagesFromDirectoty(path.join(__dirname, '../public/uploads'));
    res.render('PhotoGalery', { images: images });
});

function GetImagesFromDirectoty(dirPath) {
    let allImages = [];
    let files = fs.readdirSync(dirPath);

    for (let i in files) {
        let file = files[i];
        let fileLocation = path.join(dirPath, file);
        var stat = fs.statSync(fileLocation);

        if (stat && stat.isDirectory()) {
            getImagesFromDir(fileLocation);
        } else if (stat && stat.isFile() && ['.jpg', '.png'].indexOf(path.extname(fileLocation)) !== -1) {
            allImages.push('static/'+ file);
        }
    }
    return allImages
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

router.post('/upload', upload,(req,res)=>{
    console.log(req.file);
    res.render('index');
});


module.exports = router;