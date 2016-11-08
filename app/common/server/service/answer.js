'use strict';

const answer = require("../controllers/answer");
module.exports=(app)=>{
app.get('/ws/answer/getbyuserevent',function(req,res){
    answer.getanswersbyuserevent(req,res);
});

app.get('/ws/answer/getbyevent',function(req,res){
    answer.getanswersbyevent(req,res);
});

app.post('/ws/answer/save',function(req,res){
    answer.saveanswer(req,res);
});

app.get('/ws/answer/getallcurrent',function(req,res){
    answer.getcurrentrespond(req,res);
});

}