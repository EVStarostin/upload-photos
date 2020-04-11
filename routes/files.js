const express = require('express');
const multer = require('multer');
const mime = require('mime');
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = mime.getExtension(file.mimetype);

        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
    }
});

const upload = multer({ storage: storage })

// Получить список фотографий
router.get('/', function (req, res, next) {
    // Читаем БД
    const bdRaw = fs.readFileSync("bd.json", "utf8");

    // Отправляем БД на клиент
    res.send(bdRaw);
});

// Добавить фотографию в БД
router.post('/', upload.single('photo'), function (req, res, next) {
    // Читаем БД
    const bdRaw = fs.readFileSync("bd.json", "utf8");
    const bd = bdRaw ? JSON.parse(bdRaw) : [];

    const newField = {
        id: bd.length,
        tags: ['человек', 'кошка', 'собака', 'дом', 'еда'],
        ...req.file
    };
    
    // Добавляем запись в БД
    bd.push(newField);

    // Сохраняем БД
    fs.writeFileSync('bd.json', JSON.stringify(bd));

    // Отправляем добавленную запись на клиент
    res.send(newField);
});

module.exports = router;
