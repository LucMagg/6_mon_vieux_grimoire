const token = require('jsonwebtoken');

const User = require('../models/user')
const signupMsgOk = 'Utilisateur créé :)'
const loginMsgKo = 'Utilisateur et/ou mot de passe incorrect :('

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 5)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        })
        user.save()
          .then(() => res.status(201).json({ message: signupMsgOk }))
          .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(500).json({ error }))
  }

  exports.login = (req, res) => {
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
                        token: token.sign(
                            { userId: user._id },
                            '8Vy0tRO5qBvZZVIGx576bNMsHrJUsaMQjLZiLlI2wWBx5Xzcya8aiSUksQ99Fv9q',
                            { expiresIn: '12h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
 }