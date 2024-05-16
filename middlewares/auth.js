const tokenLib = require('jsonwebtoken')
const env = require('dotenv').config()

const tokenKey = process.env.TOKEN_KEY
 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = tokenLib.verify(token, tokenKey)
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
	    next()
    } catch(error) {
        res.status(401).json({ error })
    }
}