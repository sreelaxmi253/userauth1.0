const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

function init(passport, getUserByEmail, getUserById){

    const Authenticator = async (email, password, done) => {

        const user = getUserByEmail(email)

        if(user == null){
           return done(null, false, {message: 'Email is incorrect'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else {
                return done(null, false, {message: 'Password is incorrect'})
            }
        }
        catch(e){
            return done(e)
        }
    }

    passport.use(new localStrategy({usernameField: 'email'},
    Authenticator))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    }) 

    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = init