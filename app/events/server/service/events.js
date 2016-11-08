'use strict';
const mongoose = require('mongoose');
const events = require('../controllers/events');
module.exports = (app)=>{

    app.get('/ws/events/getall',(req,res)=>{
        events.getall(req,res);
    });

    app.post('/ws/events/update',(req,res)=>{
        events.update(req,res);
    });

    app.post('/ws/events/save',(req,res)=>{
        events.saveevents(req,res);
    });

    app.post('/ws/events/insert',(req,res)=>{
        events.insert(req,res);
    });

    app.delete('/ws/events/delete',(req,res)=>{
        events.delete(req,res);
    });
    app.delete('/ws/events/questionnaire/delete',(req,res)=>{
        events.questiondelete(req,res);
    });
};
