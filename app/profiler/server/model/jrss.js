'use strict';
const mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId  = mongoose.Types.ObjectId,
    crypto    = require('crypto'),
          _   = require('lodash');

const jrssSchema = new Schema({
    Name:String,
    intranet_id:String,
    JRSS:String
},{ collection: 'jrss' });

mongoose.model('jrss', jrssSchema);