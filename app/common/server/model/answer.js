'use strict';
const mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    ObjectId  = mongoose.Types.ObjectId,
    crypto    = require('crypto'),
          _   = require('lodash');
const answerSchema = new Schema({
user_id: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
},
answer:Schema.Types.Mixed,
question_id:String,
event_id:{
    type : mongoose.Schema.Types.ObjectId
},
event_ref:{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'event'
},
created_date: {
        type:Date,
        default:Date.now
        }
,
updated_date: {
        type:Date,
        default:Date.now
        }
},{ collection: 'answer' });

mongoose.model('answer', answerSchema);
          