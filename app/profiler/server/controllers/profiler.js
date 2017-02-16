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
    var _format =req.query.format || "short";
        _format = _format.toLowerCase();
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
                                .select("-_id user_id answer.value question_id answer.text")    
                                .exec(function(err,_answer){                                
                                if(err) return res.status(500).json(err);
                                var _fields = [];
                                var _fieldsText = [];
                                _fields.push('Practitioner');
                                _fieldsText.push('Practitioner');

                                var _data = [];
                                var _user = [];
                                for(var i=0;i<_event[0].questionnaire.length;i++){
                                        var _f = 'Q'+ (i + 1);
                                        var _q = _event[0].questionnaire[i];
                                        console.log(_f);
                                        _fieldsText.push(_q.title.toString().replace(/,/g ,""));
                                        _fields.push(_f);                                        
                                        var _res = _answer.filter(function(d){return d.question_id == _q._id})
                                        _res.forEach(function(prac){
                                            console.log(prac.answer);
                                            if(!_user[prac.user_id.email]){
                                                _user[prac.user_id.email] = [];
                                                var _objd = {};
                                                _objd.Practitioner =  prac.user_id.intranet_name.replace(/,/g ,"")  
                                                _objd[_f]= (_format=="short")?prac.answer.value: prac.answer.value  + ". "  + prac.answer.text.toString().replace(/,/g ,"");
                                                _user[prac.user_id.email].push(_objd);

                                            }else{
                                                 var _objd = {};
                                                _objd.Practitioner = prac.user_id.intranet_name.replace(/,/g ,"") ;
                                                _objd[_f]= (_format=="short")?prac.answer.value:prac.answer.value  + ". "  + prac.answer.text.toString().replace(/,/g ,"");
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
                                _final_row = (_format=="short")?_fields.join(","):_fieldsText.join(",");
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

/*
exports.getTechinicalScore =  (req,res)=>{
    //console.log(req.query.event_id);
    mongoose.model('event').findOne({_id:req.query.event_id}).exec(function(err,event){
        if(!err && event){
            var techn = event.questionnaire.filter(function(d){
                return d.title.indexOf("(TECHNICAL") > -1;
            }).map(function(d){return d._id});

            var _cquestion= techn.length;
            //console.log(_cquestion);
            var _wscore = {A:0,B:1,C:2,D:3,E:4};
            //can be optimize by d3.quantile
            var _quantile =  function(a,b){
                    var _a = b / 4;
                        //level1
                        if(a<=_a){
                            return "Entry";
                        }else if(a>=_a&& a<=(_a*2)){
                            return "Foundation";    
                        }else if(a>=(_a*2)&& a<=(_a*3)){
                            return "Intermidiate"; 
                        }else if(a>(_a *3) ){
                            return "Advanced";
                        }
            }

            var _q_definition =  function(b){
                var _a = parseInt(b / 4);
                return [
                        {text:"Entry",value_min:"0",value_max:_a},
                        {text:"Foundation",value_min:(_a + 1),value_max:(_a * 2)},
                        {text:"Intermidiate",value_min:(_a * 2 + 1 ),value_max:(_a * 3)},
                        {text:"Advanced",value_min:(_a * 3 + 1),value_max: ">"}
                        ]
            }

            //get answers
        mongoose.model('answer').find({ question_id:{$in:techn}},(err,answer)=>{           
           if(err && answer.length==0) return res.status(200).json({});
           //get user associated with jrss
            mongoose.model('User').find({ jrss:event.title,profiler_done:true},(err,user)=>{
                var _maxScore = (_cquestion * 5);
                var _techscore = {};                
                _techscore.define = {}
                _techscore.define.question_count = _cquestion
                _techscore.define.maxScore = _maxScore
                _techscore.define.legend = _q_definition(_maxScore)                                        
                _techscore.data = [];

                    user.forEach(function(_user){                        
                            var _a = answer.filter(function(d){return d.user_id.toString()==_user._id});
                            //console.log(_a.length + "  " +  _a)
                            var _mscore = 0;
                            _a.forEach(function(v){
                                _mscore += _wscore[v.answer.value];       
                            });

                    var _data = {user_id:_user._id,v_score:_mscore,t_score:_quantile(_mscore,_maxScore)};                    
                    _techscore.data.push(_data);
                  });             
                  return res.status(200).json(_techscore);
            });//user
            });//answer
        }

    });
}
*/

exports.getTechinicalScore =  (req,res)=>{
    //console.log(req.query.event_id);
    mongoose.model('scoring').findOne({event_ref:req.query.event_id}).exec(function(err,scoring){
        if(!err && scoring){
            var techn = scoring.questionnaire.map(function(d){return d._id});

            var _proficiency_range = []
                scoring.proficiency_range.forEach(function(d){                            
                   var _min = _proficiency_range.length==0? 0: (_proficiency_range[_proficiency_range.length-1].value_max + 1);
                   _proficiency_range.push({value_min:_min,value_max:d.max,text:d.text});                     
                })

            var _quantile =  function(a,b){
                var _t="";
                        b.forEach(function(p){
                                if((a >= p.value_min) && (a<=p.value_max)){
                                    _t =  p.text;
                                }
                        });

                        return _t;
            }


              //get answers
            mongoose.model('answer').find({ question_id:{$in:techn}},(err,answer)=>{           
                if(err && answer.length==0) return res.status(200).json({});
                mongoose.model('User').find({ jrss:scoring.jrss,profiler_done:true},(err,users)=>{
                    var _techscore = {};                
                    _techscore.define = {}
                    _techscore.define.question_count = techn.length;
                    _techscore.define.legend = _proficiency_range;                                        
                    _techscore.data = [];

                    users.forEach(function(_user){
                         var _a = answer.filter(function(d){return d.user_id.toString()==_user._id});                            
                            var _mscore = 0;
                            _a.forEach(function(v){
                                //_mscore += _wscore[v.answer.value];
                                 var idq = scoring.questionnaire.map(function(d){return d._id}).indexOf(v.question_id);   
                                 if(idq>-1){
                                        //scoring details
                                        var qd = scoring.questionnaire[idq];
                                        //answer details
                                          var _idv =  qd.items.map(function(d){return d.value}).indexOf(v.answer.value);
                                             if(_idv>-1){
                                                       _mscore +=  (qd.weight * qd.items[_idv].score) / qd.weight;
                                             }
                                 }
                            });

                              var _data = {user_id:_user._id,v_score:_mscore,t_score:_quantile(_mscore,_proficiency_range)};                    
                                _techscore.data.push(_data);
                    });  

                    return res.status(200).json(_techscore);
                })
            });            
        }
    });
}

exports.getscoring = (req,res)=>{
    mongoose.model("scoring").findOne({event_ref:req.query.event_id}).exec((err,doc)=>{
        if(err) res.status(500).json(err);         
        res.status(200).json(doc);        
    });
};

exports.savescoring = (req,res)=>{
    var _scoring = req.body.scoring;        
    mongoose.model("scoring").findOne({event_ref:_scoring.event_ref}).exec((err,doc)=>{
            doc.proficiency_range = [];
            doc.questionnaire = [];
            doc.proficiency_range = _scoring.proficiency_range; 
            doc.questionnaire = _scoring.questionnaire;            
            doc.save(function(err){
                if(err) res.status(500).json(err);         
                res.status(200).json({status:"save"});
            })
             
                  
    });
};


