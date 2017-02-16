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

    app.get('/ws/profiler/practitioners_count',(req,res)=>{
        profiler.getPractionerStatus(req,res);
    });

    app.get('/ws/profiler/jrssgroupcount',(req,res)=>{
        profiler.getjrssgroupcount(req,res);
    });

    app.get('/ws/profiler/getanswerbyjrss',(req,res)=>{
        profiler.getpractitionerperquestion(req,res);
    });

    app.get('/ws/profiler/getpractitionernoresponse',(req,res)=>{
        profiler.getpractitionernoresponse(req,res);
    });

    app.get('/ws/profiler/getPractionerByStatus',(req,res)=>{
        profiler.getPractionerByStatus(req,res);
    });

    app.get('/ws/profiler/getPractionerByStatusDone',(req,res)=>{
        profiler.getPractionerByStatusDone(req,res);
    });

    app.get('/ws/profiler/exportPerJrss',(req,res)=>{
        profiler.exportPerJrss(req,res);
    });
    
    app.get('/ws/profiler/gettechnicalscore',(req,res)=>{
        profiler.getTechinicalScore(req,res);
    });

    app.get('/ws/profiler/getscoring',(req,res)=>{
            profiler.getscoring(req,res);
    });

    app.post('/ws/profiler/savescoring',(req,res)=>{
            profiler.savescoring(req,res);
    });

    
};



