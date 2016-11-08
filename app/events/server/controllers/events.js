'use strict';
const mongoose = require('mongoose');
const Events = mongoose.model('event'); 
const ObjectId  = mongoose.Types.ObjectId;



exports.getall = (req,res)=>{
    Events.find({}).exec((err,data)=>{
         if(!err){
            return res.status(200).json(data);
        }else{
            return res.status(500).json(err);
        } 
    });
};

exports.saveevents = (req,res)=>{
    let data = req.body;
    let id = data._id || null;

    if(id){
        Events.findById({_id:id}).exec((err,doc)=>{
            if(!err){
                    doc.title = data.title;
                    doc.description=data.description;
                    doc.updated_by =  req.user._id || 0;
                    doc.active = data.active;
                    doc.event_date =  new Date(data.event_date);
                    //doc.questionnaire = data.questionnaire;             
                    data.questionnaire.forEach(function(obj){
                        if(obj.hasOwnProperty("_id")==false){
                            obj._id = new ObjectId().toString();
                        }else

                        var _iindex = doc.questionnaire.map((d)=>d._id).indexOf(obj._id);
                        if(_iindex>-1){
                            doc.questionnaire.splice(_iindex,1);
                            doc.questionnaire.push(obj);
                            //console.log(doc.questionnaire[_iindex]);        
                        }else{
                            doc.questionnaire.push(obj);
                        };                        
                    }); 
                    doc.updated_date =  new Date();
                    doc.modified_by =  req.user._id || 0;
                    doc.save((err)=>{
                        if(!err){
                            return res.status(200).json({"type":"update","status":"saved"});
                        }else{
                            return res.status(500).json(err);
                        } 
                    });
            }else{
                    return res.status(500).json(err);
            }

        });   
    }else{
        var _newEvents = new Events(data);
        _newEvents.modified_by =  req.user._id || 0;
        _newEvents.created_by =  req.user._id || 0;
        _newEvents.save(function(err){
            if(!err){
                return res.status(200).json({"type":"insert","status":"success","data":_newEvents});
            }else{
                return res.status(500).json(err);
            }; 
        });
    }
};
//delete event
exports.delete = (req,res)=>{
	var _id = req.query._id;
    Events.findOne({
        _id : _id
        }).exec((err, docs)=> {
            if (err) {
                return res.status(500).json({
                    msg: 'Failed to delete events.',
                    err : err
                });
            }
            docs.remove(function(){			     	   
                res.status(200).json({
                    msg: 'Successfully deleted events.'
                });
            })
        });
};

//questionnaire on event
exports.questiondelete = (req,res)=>{
    let event_id = req.query.event_id;
    let question_id = req.query.question_id;
    
    Events.findOne({
        _id : event_id
        }).exec((err, docs)=> {
            if (err) {
                return res.status(500).json({
                    msg: 'Failed to delete events.',
                    err : err
                });
            };

            var _index = docs.questionnaire.map((d)=>d._id).indexOf(question_id);
            if(_index>-1){
                docs.questionnaire.splice(_index,1);
                docs.save((err)=>{
                    res.status(200).json({msg: 'Successfully deleted question.'});
                    return;
                });
            }else{
                return res.status(500).json({msg: 'Failed to delete question.'});
            }                 
        });
}