'use strict';
const mongoose = require('mongoose');
const ObjectId  = mongoose.Types.ObjectId;
module.exports = (app)=>{ 
    app.get("/",(req,res)=>{
        if ( !req.user ){
                res.redirect('/login');
        } else {
            var _page = req.user.profiler_done?"thankyoupage":"profiler";
            res.locals.users = (req.user || null);             
            res.render(_page);    
        }
            
    });

    app.get("/faq",(req,res)=>{
        res.render("faqs");
    });

    
    app.get("/practitioners_count",(req,res)=>{
        if ( !req.user ){
                res.redirect('/login');
        } else {            
                res.render("practitioners_count");
        }
        
    });


    app.get("/sme",(req,res)=>{
        if ( !req.user ){
                res.redirect('/login');
        } else if(req.user && (req.user.roles.indexOf("ADMIN") || req.user.roles.indexOf("SME")))  {      
            res.render("sme");
        }else{
            var _page = req.user.profiler_done?"thankyoupage":"profiler";
            res.locals.users = (req.user || null);             
            res.render(_page);    
        }
        
    });

    app.get("/lnk",(req,res)=>{
        if ( !req.user ){
                res.redirect('/login');
        } else if(req.user && (req.user.roles.indexOf("ADMIN") || req.user.roles.indexOf("LNK") || req.user.roles.indexOf("SME")))  {      
            res.render("lnk");
        }else{
            var _page = req.user.profiler_done?"thankyoupage":"profiler";
            res.locals.users = (req.user || null);             
            res.render(_page);    
        }
        
    });


    app.get("/profiler_report",(req,res)=>{
        if ( !req.user ){
                res.redirect('/login');
        } else if(req.user && (req.user.roles.indexOf("ADMIN") || req.user.roles.indexOf("LNK") || req.user.roles.indexOf("SME")))  {      
                res.render("profiler_report");
        }else{
            var _page = req.user.profiler_done?"thankyoupage":"profiler";
            res.locals.users = (req.user || null);             
            res.render(_page);    
        }
        
    });
 
}