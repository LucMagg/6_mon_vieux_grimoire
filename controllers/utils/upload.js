const sharp = require('sharp')
const fs = require('fs').promises

const processImage = async (pic) => {
    const toReturn = await sharp(pic)
        .resize(463)
        .webp({ quality: 80 })
        .toBuffer()
    return toReturn
}

const uploadImage = async (req) => {
    if (req.file != undefined) {
        const processedImage = await processImage(req.file.buffer)
        await fs.writeFile('./images/' + req.file.fileName, processedImage)
            .catch(error => { error })
    }
}

module.exports = uploadImage