'use strict';
const mongoose = require('mongoose');
const ObjectId  = mongoose.Types.ObjectId;


exports.getsurvey =  function(req,res){
    const event = mongoose.model('event'); 
    var user = req.user;
    event.findOne({title:user.jrss}).exec(function(err,doc){
         if(!err && doc){
             var _user = {};
                _user.email= user.email;
                _user.jrss= user.jrss;
                _user.name= user.name;
                _user.intranet_name= user.intranet_name;        
                return res.status(200).json({user:_user, title:doc.title,description:doc.description,questionnaire:doc.questionnaire})
         }else {
            return res.status(500).json(err);
        } 
    });
}




exports.savebulkAnswerProfiler = (req,res)=>{
    var k = req.body;
    if(!req.user) return res.status(500).json({"error":"Authentication Required"});
    mongoose.model('event').findOne({title:req.user.jrss}).exec(function(err,doc){
         if(!err && doc){
            mongoose.model('answer').remove({$and:[{event_id:doc._id},{user_id:req.user._id}]}, function(err) {
                    var _dataArray = [];
                    k.data.forEach(function(o) {
                        var _data = {}
                        _data.user_id = req.user._id;
                        _data.event_id = doc._id;
                        _data.event_ref = doc._id;
                        _data.question_id = o.question_id;
                        _data.answer = o.answer;
                        _dataArray.push(_data);   
                    });
                    

                    mongoose.model("answer").insertMany(_dataArray)
                    .then(function(docs) {
                        mongoose.model('User').update({_id:req.user._id},{profiler_done:true},{multi:false},function(err,n){});
                        return res.status(200).json({"status":"saved"});

                    })
                    .catch(function(err) {
                        // error handling here
                        return res.status(500).json(err);
                    });
            })//remove all duplicate

         }else {
            return res.status(500).json(err);
        } 
    });
}