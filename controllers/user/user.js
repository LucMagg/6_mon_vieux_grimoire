const tokenLib = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const env = require('dotenv').config()

const { checkKeys, checkValues, checkEmail } = require('../utils/checks')

const User = require('../../models/user')

const tokenKey = process.env.TOKEN_KEY

exports.signup = (req, res) => {
	const isValidRequest = checkAuthBody(req)
	if (isValidRequest[0]) {
		req.body = isValidRequest[1]
		bcrypt.hash(req.body.password, 10)
			.then(hash => {
				const user = new User({
					email: req.body.email,
					password: hash
				})
				user.save()
					.then(() => { res.status(201).json({ message: 'Utilisateur créé' }) })
					.catch(error => res.status(400).json({ error }))
			})
			.catch(error => {res.status(500).json({ error })
		})
	} else {
		res.status(isValidRequest[1]).json(isValidRequest[2])
	}
}

exports.login = (req, res) => {
	const isValidRequest = checkAuthBody(req)
	if (isValidRequest[0]) {
		req.body = isValidRequest[1]
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					return res.status(401).json({ message: 'Utilisateur et/ou mot de passe incorrect' })
				}

				bcrypt.compare(req.body.password, user.password)
					.then(validPwd => {
						if (!validPwd) {
							return res.status(401).json({ message: 'Utilisateur et/ou mot de passe incorrect' })
						}
						res.status(200).json({
							userId: user._id,
							token: tokenLib.sign(
								{ userId: user._id },
								tokenKey,
								{ expiresIn: '12h' }
							)
						})
					})
					.catch(error => res.status(500).json({ error }))
			})
			.catch(error => res.status(500).json({ error }))
	} else {
		res.status(isValidRequest[1]).json(isValidRequest[2])
	}
}

const checkAuthBody = (req) => {
	const keysToCheck = ['email','password']

    const hasValidKeys = checkKeys(req.body, keysToCheck)
    if (!hasValidKeys[0]) {
        return hasValidKeys
    }

	req.body = checkValues(req.body, keysToCheck)

	const hasValidEmail = checkEmail(req)
	if (!hasValidEmail[0]) {
        return hasValidKeys
    }

	return [true, req.body]
}