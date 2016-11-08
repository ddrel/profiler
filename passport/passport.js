const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy

module.exports = (passport)=>{
// Serialize the user id to push into the session
  passport.serializeUser( (user, done)=> {
    done(null, user.id);
  });

  // Deserialize the user object based on a pre-serialized token
  // which is the user id
  passport.deserializeUser((id, done)=> {
     mongoose.model('User').findOne({
      _id: id
    }, '-salt -hashed_password', (err, user)=> {
      done(err, user);
    });
  });

  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done)=> {
       mongoose.model('User').findOne({
        email: email
      }, (err, user)=> {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
        return done(null, user);
      });
    }
  ));

}