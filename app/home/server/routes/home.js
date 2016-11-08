'use strict';

module.exports = (app)=>{
//Home Page    
app.get("/maintenance",(req,res)=>{
    
    if ( !req.user ){
            res.redirect('/login');
    } else {
        res.locals.users = (req.user || null);
        res.locals.ipaddress = app.get("ipaddress") + ":"  + app.get("socketPORT"); 
        res.render("index");    
    }
        
});


}