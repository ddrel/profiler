const mongoose = require('mongoose');
const formitemSchema = mongoose.model('formitemSchema');

exports.addQuestionnaire = (req,res)=>{
    const form = new formitemSchema(req.body);
    form.save(function(err){
        if(err){
            return res.status(500).json(err);
        }else{
            return res.status(200).json({"type":"insert","status":"success","data":form});
        }
    });
};

exports.getAllQuestionnaire = (req,res)=>{    
    formitemSchema.find({}).exec((err,data)=>{
            if(!err){
                res.status(200).json(data);
            }else{
                res.status(500).json(err);
            }
    });
}