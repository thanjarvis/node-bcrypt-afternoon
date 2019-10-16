const bcrypt = require('bcryptjs')

module.exports = {
    register: async(req, res) => {
        const {username, password, isAdmin} = req.body
        const db = req.app.get('db')

        // console.log(db);
        
        const result = await db.get_user(username)
        const existingUser = result[0]

        if(existingUser){
            return res.status(409).send('Username taken')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash =  bcrypt.hashSync(password, salt)

        let registeredUser = await db.register_user(isAdmin, username, hash)
        user = registeredUser[0]
        
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }

        res.status(201).send(req.session.user)
    },

    login: async (req, res) => {

        // console.log('hit endpoint');
        

        const {username, password} = req.body
        const db = req.app.get('db')

        const foundUser = await db.get_user(username)
        const user = foundUser[0]

        // console.log(user);
        
        if (!user){
            return res.status(401).send(`User not found, "stop being ridiculous and just register damnit" - capstic`)
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        if(!isAuthenticated){
            return res.status(403).send(`"try again worm" - snape`)
        }

        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        return res.send(req.session.user)
    },

    logout: async (req, res) => {
        req.session.destroy
        res.sendStatus(200)
    }

    
}