'use strict';
const published = require("../controllers/published");
module.exports=(app)=>{

app.post('/ws/published/setpublished',function(req,res){
    published.setpublished(req,res);
});

app.post('/ws/published/setquestionpublished',function(req,res){
    published.setquestionpublished(req,res);
})

app.get('/ws/published/getpublished',function(req,res){
    published.getpublished(req,res);
});


}