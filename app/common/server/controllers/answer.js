const mongoose = require('mongoose');

exports.getanswersbyuserevent = (req,res)=>{
    var k = req.query;
    mongoose.model("answer").findOne({user_id:req.user._id,
                                      event_id:k.event_id,
                                      question_id:k.question_id},
                (err,doc)=>{
                    if(!doc || err){
                        return res.status(500).json({status:false});
                    }else{
                        return res.status(200).json(doc);
                    }
                });
}
exports.getanswersbyevent = (req,res)=>{
    var k = req.body;
    mongoose.model("answer").find({
                                    event_id:k.event_id,
                                  },
                (err,doc)=>{
                    if(!doc || err){
                        return res.status(500).json({status:false});
                    }else{
                        return res.status(200).json(doc);
                    }
                });
}

exports.saveanswer = (req,res)=>{
    var k = req.body;
    mongoose.model("answer").findOne({user_id:req.user._id,
                                     $and:[
                                            {event_id:k.event_id},{question_id:k.question_id}
                                         ]
                                    },
                (err,doc)=>{
                    if(!doc){
                        var ans = mongoose.model("answer");
                        var _data = {};
                            _data.user_id = req.user._id;
                            _data.event_id = k.event_id;
                            _data.event_ref = k.event_id;
                            _data.question_id = k.question_id;
                            _data.answer = k.answer;
                            console.log(k)                        
                        new ans(_data).save(function(err,data){
                                if(err){
                                    return res.status(500).json(err);
                                }else{
                                    return res.status(200).json(data);
                                }
                        });
                    }else{
                        doc.answer = k.answer.value;
                        doc.answer = k.answer;
                        doc.updated_date = new Date();
                        doc.save(function(err,data){
                                if(err){
                                    return res.status(500).json(err);
                                }else{
                                    return res.status(200).json(data);
                                }
                        });
                    }
                });
}
exports.getcurrentrespond =(req,res)=>{
     mongoose.model("published").findOne({}).exec(function(err,doc){
        if(!doc){
            return res.status(500).json(err);
        }else if(!err && doc.question){  
                    mongoose.model("answer").find({event_id:doc.event_ref,question_id:doc.question._id})
                    .populate("user_id","name email")
                    .exec(function(err,doc){
                          if(!err){
                                return res.status(200).json(doc || []);
                            }else{
                                return res.status(500).json(err);
                            } 
                    });
        }else{
            return res.status(500).json(err);
        } 
    });

} 