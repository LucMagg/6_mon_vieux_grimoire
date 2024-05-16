const tokenLib = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const env = require('dotenv').config()

const User = require('../models/user')

const signupMsgOk = 'Utilisateur créé :)'
const loginMsgKo = 'Utilisateur et/ou mot de passe incorrect :('
const tokenKey = process.env.TOKEN_KEY

exports.signup = (req, res) => {
	const isValidRequest = checkAuthBody(req)
	if (isValidRequest[0]) {
		bcrypt.hash(req.body.password, 10)
			.then(hash => {
				const user = new User({
					email: req.body.email,
					password: hash
				})
				user.save()
					.then(() => { res.status(201).json({ message: signupMsgOk }) })
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
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					return res.status(401).json({ message: loginMsgKo })
				}

				bcrypt.compare(req.body.password, user.password)
					.then(validPwd => {
						if (!validPwd) {
							return res.status(401).json({ message: loginMsgKo })
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
	if (!req.body.hasOwnProperty('email')) {
		return [false, 400, {'error': 'email manquant'}]
	}
	if (!req.body.hasOwnProperty('password')) {
		return [false, 400, {'error': 'password manquant'}]
	}
	validEmail = new RegExp(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
	if (!validEmail.test(req.body.email)) {
		return [false, 400, {'error': 'email non valide'}]
	}
	if (req.body.password.substring(0,1) === '<') {
		return [false, 400, {'error': 'tentative d\'injection de script détectée'}]
	}
	if (req.body.password === '') {
		return [false, 400, {'error': 'password vide'}]
	}
	return [true]
}