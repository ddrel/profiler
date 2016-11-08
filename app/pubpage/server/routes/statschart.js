'use strict';
module.exports = (app)=>{ 
    app.get("/chart",(req,res)=>{
            res.locals.ipaddress = app.get("ipaddress") + ":"  + app.get("socketPORT");
            res.render("statschart");
    });    
}