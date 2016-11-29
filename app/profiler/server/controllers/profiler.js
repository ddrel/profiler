'use strict';
const mongoose = require('mongoose');
const ObjectId  = mongoose.Types.ObjectId;


 const _jrs = [
                    "Application Developer-Java.Core",
                    "Application Developer-Java.WebSphere",
                    "Application Developer-Java.Spring",
                    "Application Developer-Java.Weblogic",
                    "Application Developer-Java.EJB",
                    "Application Developer-Cloud.Java",
                    "Application Architect-Java",
                    "Technical Team Leader-Java",
                    "Test Specialist-Custom Applications",
                    "Application Developer-SAP.ABAP",
                    "Application Developer-SAP.ABAP.HR",
                    "Application Developer-SAP.ABAP.CRM",
                    "Application Developer-SAP.ABAP.Workflow",
                    "Technical Team Leader-SAP.ABAP",
                    "Application Developer-C#.NET", 
                    "Data Management Support Specialist-ETL.DataStage",
                    "Application Developer-COBOL", 
                    "Application Developer-Oracle Database",
                    "Application Developer-Oracle Applications", 
                    "Application Developer-AIX/UNIX",
                    "Architect-SAP.BA.Basis",
                    "Application Architect-SAP.Basis",
                    "Architect-SAP.Basis",
                    "Application Developer-Web Technologies",
                    "Application Developer-VB.NET", 
                    "Application Database Administrator-Oracle Database",
                    "Application Database Administrator-Oracle Applications",
                    "Application Developer-COGNOS.BI",
                    "Packaged Application Enablement Specialist-Oracle.Customer Care & Billing",
                    "Package Solution Consultant-Oracle.Customer Care & Billing",
                    "Test Specialist-Automation Tools"]
exports.getsurvey =  function(req,res){

    if(!req.user) return res.status(500).json({"error":"authentication required"});

    const event = mongoose.model('event'); 
    const user = req.user;


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



exports.getprofileranswer =  function(req,res){
    if(!req.user) return res.status(500).json({"error":"authentication required"});

    const user = req.user;
    const answer = mongoose.model('answer');     
    const event = mongoose.model('event'); 

    event.findOne({title:user.jrss}).exec(function(err,doc){
         if(!err && doc){
                answer.find({user_id:user._id}).exec(function(err,docAnswer){
                    if(!err && doc){
                        var _user = {};
                            _user.email= user.email;
                            _user.jrss= user.jrss;
                            _user.name= user.name;
                            _user.intranet_name= user.intranet_name;        

                            var _qarray = [];
                                doc.questionnaire.forEach(function(d){
                                 _qarray.push({_id:d._id,
                                              title:d.title});

                                })
                                //doc.questionnaire
                                

                                
                            return res.status(200).json({user:_user, title:doc.title,description:doc.description,questionnaire:_qarray,answer:docAnswer});
                    }else {
                        return res.status(500).json(err);
                    } 
                });            
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

exports.getPractionerStatus = (req,res)=>{
    if(!req.user) return res.status(500).json({"error":"Authentication Required"});
    const user =  mongoose.model("User");    
    user.aggregate([
                { $match: { profiler_done: true } },
                { $group: { _id: "$jrss", total: { $sum: 1 } } },
                { $sort: { total: -1 } }
            ],
    function(err,done_true) {
            if(err) return res.status(500).json(err);

            user.aggregate([
                { $match: { profiler_done: false } },
                { $group: { _id: "$jrss", total: { $sum: 1 } } },
                { $sort: { total: -1 } }
            ],
            function(err,done_false) {
                if(err) return res.status(500).json(err);

                var _ret = {};
                    _ret.done_true = done_true;
                    _ret.done_false = done_false;
                    return res.status(200).json(_ret);
            });

    });


}

exports.getjrssgroupcount = (req,res)=>{
    if(!req.user) return res.status(500).json({"error":"Authentication Required"});
    const jrss =  mongoose.model("jrss");    
    jrss.aggregate([{$group:{_id:"$JRSS",count:{$sum:1}}},{$sort:{count:-1}}],function(err,done){
            if(err) return res.status(500).json(err);
            return res.status(200).json(done);
    })
}


exports.getpractitionerperquestion = (req,res)=>{
    if(!req.user) return res.status(500).json({"error":"Authentication Required"});
    const answer =  mongoose.model("answer");
    const user =  mongoose.model("User");
    const event_id = req.query.event_id;
    const question_id = req.query.question_id;

    var query = {event_id:event_id,question_id:question_id};
    if(typeof req.query.users!="undefined"){
         var _q = [];
         req.query.users.split(",").forEach(function(a){if(a!="")_q.push(a);});         


        user.find({email:{$in:_q}}).select("_id").exec(function(err,doc){
            query.user_id = {$in:doc};            
            answer.find(query)    
            .populate("user_id","-_id email intranet_name")
            .select("-_id user_id answer.value")    
            .exec(function(err,doc){
                if(err) return res.status(500).json(err);
                return res.status(200).json(doc);
            })
        })
        return;
    }

    answer.find(query)    
    .populate("user_id","-_id email intranet_name")
    .select("-_id user_id answer.value")    
    .exec(function(err,doc){
         if(err) return res.status(500).json(err);
         return res.status(200).json(doc);
    })


  
} 


exports.getpractitionernoresponse = (req,res)=>{
     const jrss =  mongoose.model("jrss");
     const users =  mongoose.model('User');
    

      users.find({}).select("-_id email").exec(function(err,_users){
            var _u = _users.map(function(d){return d.email});
            jrss.find({$and:[
                            {"intranet_id":{$nin:_u}},
                            {"JRSS":{$in:_jrs}}    
                            ]})
                            .select("-_id Name JRSS intranet_id")
                            .exec(function(err,_jrss){                
                            return res.status(200).json({length:_jrss.length,data:_jrss});
            })


      })
};


exports.getPractionerByStatus = (req,res)=>{
    const users =  mongoose.model('User');
    var b = req.query.status;
    var c = req.query.jrss;
    users.find({$and:[
                    {profiler_done:b},
                    {jrss:{ "$regex": c, "$options": "i" }}
                    ]}).select("-_id intranet_name email").exec(function(err,doc){
         if(err) return res.status(500).json(err);
         return res.status(200).json(doc);
    });

};


exports.getPractionerByStatusDone = (req,res)=>{
    const users =  mongoose.model('User');
    users.find({profiler_done:true})
        .select("_id intranet_name email jrss").exec(function(err,doc){
         if(err) return res.status(500).json(err);
         return res.status(200).json(doc);
    });
};


exports.exportPerJrss = (req,res)=>{
     if(!req.user) return res.status(500).json({"error":"Authentication Required"});
    const answer =  mongoose.model("answer");
    const event =   mongoose.model('event');
    var _jrss = decodeURIComponent(req.query.jrss);
    var _users = req.query.users;
       console.log(_jrss); 
    event.find({title:{$in:_jrss}
                    }).exec(function(err,_event){                       
                        if(err) return res.status(500).json(err);                            
                        if(_event.length>0){
                            var _event_id = _event[0]._id;
                            var qry = {event_id:_event_id};
                            if(typeof _users!="undefined"){
                                 var _q = [];
                                _users.split(",").forEach(function(a){if(a!="")_q.push(a);});
                                qry.user_id = {$in:_q};     
                            }

                             console.log(qry);
                             answer.find(qry)    
                                .populate("user_id","-_id email intranet_name")
                                .select("-_id user_id answer.value question_id")    
                                .exec(function(err,_answer){                                
                                if(err) return res.status(500).json(err);
                                var _fields = []
                                _fields.push('Practitioner');
                                var _data = [];
                                var _user = [];
                                for(var i=0;i<_event[0].questionnaire.length;i++){
                                        var _f ='Q' + (i + 1);
                                        var _q = _event[0].questionnaire[i];
                                        _fields.push(_f);                                        
                                        var _res = _answer.filter(function(d){return d.question_id == _q._id})
                                        _res.forEach(function(prac){
                                            if(!_user[prac.user_id.email]){
                                                _user[prac.user_id.email] = [];
                                                var _objd = {};
                                                _objd.Practitioner =  prac.user_id.intranet_name.replace(/,/g ,"")  
                                                _objd[_f]=prac.answer.value
                                                _user[prac.user_id.email].push(_objd);

                                            }else{
                                                 var _objd = {};
                                                _objd.Practitioner = prac.user_id.intranet_name.replace(/,/g ,"") ;
                                                _objd[_f]=prac.answer.value
                                                 _user[prac.user_id.email].push(_objd);   
                                            }                                            
                                        });                                       
                                };

                                var _data_row = "";
                                for(var u in _user){
                                    var _uObj = _user[u];                                                                       
                                    var aa = []
                                        aa.push(_uObj[0].Practitioner);
                                        for(var f in _fields){
                                            if((_fields[f])!="Practitioner"){
                                                var _f = _fields[f];                                                
                                                    for(var o in _uObj){
                                                        if(_uObj[o][_f]){
                                                                aa.push(_uObj[o][_f]);                                                                
                                                        }
                                                    }
                                            }                                           
                                        }   
                                      
                                      _data_row += aa.join(","); ;
                                      _data_row += "\r\n"; 
                                }
                                
                                var _final_row = "";
                                _final_row = _fields.join(",");
                                _final_row +="\r\n"; 
                                _final_row += _data_row;

                                var _intDate = parseInt((new Date / 1000));
                                console.log(_jrss);
                                var _filename =  "attachment;filename=" + (_jrss.toLowerCase()+"-" + _intDate).replace(/ /g,"_").replace(".","-") + ".csv";

                                console.log(_filename);
                                res.setHeader("Content-disposition", _filename);
                                res.set("Content-Type", "text/csv");
                                res.status(200).send(_final_row);
                                    
                            });                                      
                        }    
                    });



}







