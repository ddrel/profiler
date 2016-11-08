'use strict';
const mongoose = require('mongoose');
const profiler = require('../controllers/profiler');
module.exports = (app)=>{

    app.get('/ws/profiler/getsurvey',(req,res)=>{
        profiler.getsurvey(req,res);
    });

    app.get('/ws/profiler/getprofileranswer',(req,res)=>{
        profiler.getprofileranswer(req,res);
    });

    app.post('/ws/profiler/save',(req,res)=>{
        profiler.savebulkAnswerProfiler(req,res);
    });

};



