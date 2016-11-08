'use strict';
const mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId  = mongoose.Types.ObjectId,
    crypto    = require('crypto'),
          _   = require('lodash');

const publishedSchema = new Schema({
eventTitle :{
    type:String
    },
updated_by: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
},
question:Schema.Types.Mixed,
event_ref:{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'event'
},
active: {type:Boolean,
        default:true
        }
},{ collection: 'published' });

mongoose.model('published', publishedSchema);
          