const mongoose = require('mongoose');

exports.setpublished = (req,res)=>{
    var data = req.body;
    mongoose.model("published")
    .remove({}, function(err) {
    if(err){
    return res.status(500).json(err);
    }
    var _published = {}
        _published.eventTitle = data.eventTitle;
        _published.updated_by = req.user._id;
        _published.event_ref = data.event_ref;
        _published.question = new Object();
        var published = mongoose.model("published")
        new published(_published).save(function(err,doc){
            if(!err){
                return res.status(200).json(doc);
            }else{
                return res.status(500).json(err);
            } 
        });
    });
}

exports.setquestionpublished = (req,res)=>{
    var data = req.body;
    mongoose.model("published").findOne({}).exec(function(err,doc){
        if(!err){
            doc.question = {};              
            for(var key in data){                
                    doc.question[key] = data[key];
            }            
            doc.save(function(err,doc){
                if(!err){
                    return res.status(200).json(doc);
                }else{
                    return res.status(500).json(err);
                } 

            }); 
        }else{
            return res.status(500).json(err);
        } 
    });
}

exports.getpublished = (req,res)=>{
    mongoose.model("published").findOne({}).exec(function(err,doc){
        if(!err){  
        return res.status(200).json(doc || {});
        }else{
        return res.status(500).json(err);
        } 
    });
}
