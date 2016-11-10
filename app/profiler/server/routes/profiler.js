'use strict';
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

    app.get("/faqs",(req,res)=>{
      res.render("faqs");

    });

  
}
