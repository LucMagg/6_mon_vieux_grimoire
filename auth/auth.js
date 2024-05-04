const tokenLib = require('jsonwebtoken')

const tokenKey = '8Vy0tRO5qBvZZVIGx576bNMsHrJUsaMQjLZiLlI2wWBx5Xzcya8aiSUksQ99Fv9q'
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]
       const decodedToken = tokenLib.verify(token, tokenKey)
       const userId = decodedToken.userId
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
}