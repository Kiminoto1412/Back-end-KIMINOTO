//npm i multer ใช้รับข้อมูลที่เป็น file data
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
// module.exports = multer({dest: 'public/images'}) //ทำแบบกากๆ

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, "public/images"); //cb(error obj ,destinationที่จะให้รูปส่งไป)
  },
  filename: (req, file, cb) => {
    // cb(null, "earthSudLoh.jpeg"); //cb(error obj ,ตั้งชื่อรูป)
    // cb(null, file.originalname); //cb(error obj ,ตั้งชื่อรูป โดยตามชื่อfileข้างนอกเลย)
    // cb(null, new Date().getTime() + "." + file.mimetype.split("/")[1]); //cb(error obj ,ตั้งชื่อรูป มักตั้งตามเวลาที่add และเติมจุด + ชนิดไฟล์)
    // Best
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]); //cb(error obj ,ตั้งชื่อรูป ใช้uuidแทน เพราะถ้uploadรูปพร้อมกันมันจะerrorได้ และเติมจุด + ชนิดไฟล์)
  },
});

module.exports = multer({ storage });
