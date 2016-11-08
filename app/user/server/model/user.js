'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId;
const crypto    = require('crypto');
const  _   = require('lodash');

const escapeProperty = (value)=> {
  return _.escape(value);
};
/**
 * Validations
 */
const validatePresenceOf = (value)=> {
  // If you are authenticating by any of the oauth strategies, don't validate.
  return (this.provider && this.provider !== 'local') || (value && value.length);
};

const validateUniqueEmail = (value, callback)=> {
  const User = mongoose.model('User');
  User.find({
    $and: [{
      email: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, (err, user)=> {
    callback(err || user.length === 0);
  });
};


var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    get: escapeProperty
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    validate: [validateUniqueEmail, 'E-mail address is already in-use']
  },
  roles: {
    type: Array,
    default: ['USER']
  },
  hashed_password: {
    type: String,
    validate: [validatePresenceOf, 'Password cannot be blank']
  },
  provider: {
    type: String,
    default: 'local'
  },
  salt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profile: {},
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  linkedin: {},
  ibm:{},
  jrss:String,
  profiler_done:{
    type:Boolean,
    default:false
  },
  intranet_name:String,
  devkey: {
    type: String,
    default: ''
  }
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.hashPassword(password);
}).get( ()=> {
  return this._password;
});

/**
 * Pre-save hook
 */
UserSchema.pre('save',function (next) {
  if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
    return next(new Error('Invalid password'));
  next();
});

/**
 * Methods
 */

UserSchema.statics.changePassword = function(userId, currentpassword,newpassword,cb){
  this.findOne({
      _id: userId
    }).exec((err,result)=>{
      if(err){
        cb(false,new Error('Failed to load User'));
      }else{
        if(result.hashed_password!=UserSchema.methods.cHash(currentpassword,result.salt)){
          cb(false,new Error('Invalid Password'));
        }else{
          var salt = UserSchema.methods.makeSalt();
          var newhash = UserSchema.methods.cHash(newpassword,salt);
          cb(true,result,newhash,salt);
        }
      }
    });
};

UserSchema.methods = {

  /**
   * HasRole - check if the user has required role
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  hasRole: function(role) {
    var roles = this.roles;
    return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
  },

  /**
   * IsAdmin - check if the user is an administrator
   *
   * @return {Boolean}
   * @api public
   */
  isAdmin: function() {
    return this.roles.indexOf('admin') !== -1;
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.hashPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Hash password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  hashPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },
  cHash: function(password,salt){
      var salt = new Buffer(salt, 'base64');
      return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  /**
   * Hide security sensitive fields
   *
   * @returns {*|Array|Binary|Object}
   */
  toJSON: function()  {
    var obj = this.toObject();
    delete obj.hashed_password;
    delete obj.salt;
    return obj;
  }
};

mongoose.model('User', UserSchema);