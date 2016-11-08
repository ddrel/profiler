'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  User = mongoose.model('User')



/**
 * Create user
 */
exports.create = (req, res)=> {  
  var user = new User(req.body);
  user.provider = 'local';
  // because we set our user.provider to local our models/user.js validation will always be true
  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('email', 'You must enter a valid email address').isEmail();
  req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
 /* req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);*/
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);


  var errors = req.validationErrors();
  if(errors.length>0){
       res.status(500).json(errors);
       return;
  }

  var modelErrors = [];
  
mongoose.model('jrss').findOne({intranet_id:user.email}).exec(function(err,doc){
  if(!err){
  var _jrss = doc && doc.JRSS;
  var _intranet_name = doc && doc.Name;
    user.jrss = _jrss || "";
    user.intranet_name = _intranet_name || "";
   
   user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
        console.log(err);
          modelErrors.push([{
            msg: 'Username already taken',
            param: 'username'
          }]);
          break;
        default:          
          if (err.errors) {
            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }            
             res.status(500).json(modelErrors);
             return;
          }
      }

    }else{      
      res.status(200).json(user);
      return;
    }
      
  });
  
  }else{ //ERROR JRSS
      res.status(500).json({error:"No JRSS Found"});    
  }
});

 
};

/**
 * Send User
 */
exports.me = (req, res)=> {
  res.json(req.user || null);
};

exports.signout = (req,res)=>{
    req.logout();
    res.redirect('/login');
};
exports.getusers = (req, res)=> {
  User.find({}).select({name:1,email:1,roles:1,_id:1})
      .exec((err,user)=>{
          if(err){
          }else{
            res.status(200).json(user);
          }

      });
};
exports.updateroles = (req, res)=> {
  var _user = (req.body);
  var roles =  _user.roles.indexOf("ADMIN")>-1?"ADMIN":"USER";

  User.update({_id:_user._id},{roles:[roles]},{multi:false},function(err,n){
     if(err){
                     res.status(500).json(err); 
                  }else{

                     res.status(200).json({status:"saved"});
                  }

  });

  //console.log(_user);
  /*
  User.findOne({_id:_user._id})
      .exec((err,user)=>{
          if(err){
            res.status(500).json(user);
          }else{
              user.roles.splice(0,1);
              var roles =  _user.roles.indexOf("ADMIN")>-1?"ADMIN":"USER";
              user.roles.push(roles);
              user.save((err)=>{
                     // console.log(err);       
                  if(err){
                     res.status(500).json(err); 
                  }else{

                     res.status(200).json({status:"saved"});
                  }
              })
          }

      });
    */
};

//delete event
exports.delete = (req,res)=>{
	var _id = req.query._id;
    User.findOne({
        _id : _id
        }).exec((err, docs)=> {
            if (err) {
                return res.status(500).json({
                    msg: 'Failed to delete users.',
                    err : err
                });
            }
            docs.remove(function(){			     	   
                res.status(200).json({
                    msg: 'Successfully deleted users.'
                });
            })
        });
};





