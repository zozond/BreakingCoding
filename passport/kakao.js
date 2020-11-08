const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/users');

module.exports = () => {
    console.log(process.env.KAKAO_ID);
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        // 사용자의 정보는 profile에 들어있다.
        try{
            const findUser = await User.findOne({where : { userId: profile.id, provider: 'kakao' }});
            
            if(findUser){
                done(null, findUser);
            }else {
                console.log(profile);
                const newUser = await User.create({
                    userId: profile.id,
                    password: profile.id,
                    email: profile._json && profile._json.kakao_account.email,
                    nickname: profile.displayName,
                    provider: 'kakao'
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
