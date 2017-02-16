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

const scoringSchema = new Schema({
    jrss: String,
    event_ref:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'event'
    },
    questionnaire:[],
    proficiency_range:[]
    
},{ collection: 'scoring' });

mongoose.model('scoring', scoringSchema);