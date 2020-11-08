const express = require('express');
const passport = require("passport")
const bcrypt = require("bcrypt");

const User = require("../models/users");

const router = express.Router()

router.use((req, res, next) => {
    res.locals.user = null;
    next();
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req,res,next);

    // const { userId, password } = req.body;

    // try {
    //     const hashpwd = await bcrypt.hash(password, 20);
    //     const findUser = await User.findOne({ where: { userId: userId, password: hashpwd } });
    //     if (findUser) {
    //         return res.redirect('/login?error=exist')
    //     }

    //     req.cookies['login'] = userId;
    //     return res.redirect('/');
    // } catch (error) {
    //     console.error(error);
    //     return next();
    // }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', async (req, res) => {
    const { userId, password, email, nickname, isAllowAd } = req.body ;

    try {
        const findUser = await User.findOne({ where: { userId: userId } });
        if (findUser) {
            return res.redirect('/register?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        
        await User.create({
            userId, 
            password: hash,
            email, 
            nickname, 
            isAllowAd
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next();
    }
})

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});

router.get('/google', passport.authenticate('google'));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});


module.exports = router;