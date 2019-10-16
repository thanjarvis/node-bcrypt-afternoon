module.exports = {
    usersOnly: (req, res, next) => {
        if(!req.session.user){
           return res.status(404).send('please log in')
        }
        next()
    },

    adminsOnly: (req, res, next) => {
        if(!req.session.user.isAdmin){
            return res.status(403).send('yo stupid ass aint no admin')
        }
        next()
    }
}