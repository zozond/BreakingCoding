const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users');

module.exports = () => {
    passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL : '/auth/google/callback',
        passReqToCallback : true
      },
      async (request, accessToken, refreshToken, profile, done) => {
        // 사용자의 정보는 profile에 들어있다.
        try{
            const findUser = await User.findOne({where : { userId: profile.id, provider: 'google' }});
            
            if(findUser){
                done(null, findUser);
            }else {
                const newUser = await User.create({
                    userId: profile.id,
                    password: profile.id,
                    email: profile._json && profile._json.kakao_account.email,
                    nickname: profile.displayName,
                    provider: 'google'
                });
                done(null, newUser);
            }
        }catch(error){
            console.error(error);
            done(error);
        }
      }
    ));
};
