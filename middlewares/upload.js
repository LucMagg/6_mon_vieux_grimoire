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
    if (req.file != undefined) {
        const processedImage = await processImage(req.file.buffer)
        req.file.fileName = `${req.file.originalname.split('.')[0].split(' ').join('_')}_${Date.now()}.webp`
        fs.writeFile('./images/' + req.file.fileName, processedImage, (error => {error && res.status(400).json({ error })}))
    }
    next()
}

module.exports = uploadImage