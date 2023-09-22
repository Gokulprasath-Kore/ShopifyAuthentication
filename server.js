const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session')
const app = express();
require('./passport-setup')
app.set("view engine", "ejs")

//Setting up cookies
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))

//Logged In Middleware
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

//Passport Initialized
app.use(passport.initialize());

//Setting Up Session
app.use(passport.session())

const PORT = process.env.PORT || 3000;

app.get('/r/:uid', (req, res) => {
    const uid = req.params.uid;
    console.log(uid);
    res.render('pages/index')
})

app.get('/failed', (req, res) => res.send('You Failed to log in!'))

app.get('/good',  (req, res) => {
    console.log("good Working");
    console.log(req.user);
    console.log(req.user.photos[0].value)
    res.render('pages/profile.ejs',{user:{
        name:req.user.displayName,
        pic:req.user._json.picture,
        email:req.user.emails[0].value,
        profile: "google"
    }})
})

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', 
    passport.authenticate('google', 
    {failureRedirect: '/failed'}), 
    (req, res) => {
        res.redirect('/good');
    })

app.get('/profile',  (req,res) => {
    console.log("profile Working");
    console.log("----->",req.user)
    res.render('pages/profile', {
        profile: "facebook",
        name:req.user.displayName,
        pic:req.user.photos[0].value,
        email:req.user.emails[0].value // get the user out of session and pass to template
    });
})

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is up ${PORT}`)
})