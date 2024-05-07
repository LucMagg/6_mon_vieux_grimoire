const sharp = require('sharp')
const fs = require('fs')

const processImage = async (pic) => {
    const toReturn = await sharp(pic)
        .resize(463)
        .webp({ quality: 80 })
        .toBuffer()
    return toReturn
}

const uploadImage = async (req, res, next) => {
    console.log(req.file)
    const processedImage = await processImage(req.file.buffer)
    req.file.fileName = `./images/${req.auth.userId}_${req.file.originalname.split('.')[0].split(' ').join('_')}.webp`
    fs.writeFile(req.file.fileName, processedImage, () => { req.file.path = req.file.fileName })
    next()
}

module.exports = uploadImage