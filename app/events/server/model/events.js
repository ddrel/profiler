'use strict';
const mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId  = mongoose.Types.ObjectId,
    crypto    = require('crypto'),
          _   = require('lodash');

const eventSchema = new Schema({
title :{
    type:String,
    unique : true
    },
created_by : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
},
updated_by: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
},
description:String,
event_date:{
    type : Date,
    default : Date.now
},
created_date:{
    type : Date,
    default : Date.now
},
updated_date:{
    type : Date,
    default : Date.now
},
questionnaire:[], 
active: {type:Boolean,
        default:false
        }
},{ collection: 'event' });

mongoose.model('event', eventSchema);
          

          
          