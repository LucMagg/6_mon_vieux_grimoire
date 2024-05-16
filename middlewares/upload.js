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
    if (req.file != undefined && res.statusCode < 204) {
        console.log('here')
        console.log(req.file.fileName)
        const processedImage = await processImage(req.file.buffer)
        fs.writeFile('./images/' + req.file.fileName, processedImage, (error => {error && res.status(400).json({ error })}))
    }
}

module.exports = uploadImage