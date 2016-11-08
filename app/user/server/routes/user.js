'use strict';
const user = require("../controllers/user");
module.exports = (app)=>{
    app.get("/login",(req,res)=>{
            res.render("login");
    });

    app.get("/register",(req,res)=>{
            res.render("register");
    });
    
    
}