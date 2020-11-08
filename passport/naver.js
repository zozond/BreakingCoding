const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const User = require('../models/users');

module.exports = () => {
    passport.use(new NaverStrategy({
        clientID : process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL : '/auth/naver/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        // 사용자의 정보는 profile에 들어있다.
        try{
            const findUser = await User.findOne({where : { userId: profile.id, provider: 'naver' }});
            
            if(findUser){
                done(null, findUser);
            }else {
                const newUser = await User.create({
                    userId: profile.id,
                    password: profile.id,
                    email: profile.emails[0].value,
                    nickname: profile.displayName ? profile.displayName : profile._json.email,
                    provider: 'naver'
                });
                done(null, newUser)
            }
        }catch(error){
            console.error(error);
            done(error);
        }
      }
    ));
};
