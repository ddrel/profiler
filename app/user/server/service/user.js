'use strict';
const user = require("../controllers/user");
module.exports = (app,passport)=>{
      
    app.post("/register",(req,res)=>{
            user.create(req,res);
    });

    app.post('/login',passport.authenticate('local', {
      failureFlash: true
    }), function(req, res) {
      console.log(req.user);
      res.send({
        user: req.user,
        redirect: '/'
      });
    });
    app.get('/logout',user.signout);
    app.get('/ws/users/getall',user.getusers);
    app.post('/ws/users/updateroles',user.updateroles);
    app.delete('/ws/users/delete',user.delete);
}