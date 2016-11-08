'use strict';
const mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId,
    crypto    = require('crypto'),
          _   = require('lodash');

/**
 * Element Type:
 * 1. text
 * 2. check
 * 3. radio
 * 4. image
 * 
*/

const itemunitSchema = new Schema({
    label:String,
    keyvalue:String,
    textvalue:{
        type:String,
        default:''
        },
    default:{
        type:Boolean,
        default:false,
    }
},{collection:'itemunit'});

//moongose.mode('selection',selectionSchema);

const formitemSchema = new Schema({
title :String,
created_by : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
},
created_date:{
    type : Date,
    default : Date.now
},
event : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'event'
}, 
group: String,
selectedvalue:[],
type:String,
selection : [itemunitSchema],
},{ collection: 'formitemSchema' });

mongoose.model('formitemSchema', formitemSchema);

