'use strict';
const questionnaire = require('../controllers/questionnaire');
module.exports = (app)=>{

app.post('ws/questionnaire/add',(req,res)=>{
    questionnaire.addQuestionnaire(req,res);
});

app.get('ws/questionnaire/getall',(req,res)=>{
    questionnaire.getAllQuestionnaire(req,res);
});

};