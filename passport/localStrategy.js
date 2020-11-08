const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/users');

module.exports = () => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'userId',
            passwordField: 'password',
        },
        async (userId, password, done) => {
            try {
                console.log(userId, password);
                const exUser = await User.findOne({ where: { userId: userId } });
                console.log('exUser.password >> ', exUser.password);
                console.log('password >> ', password);
                if (exUser) {
                    const result = await bcrypt.compare(password, exUser.password);
                    if (result) {
                        done(null, exUser)
                    } else {
                        done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                    }

                } else {
                    done(null, false, { message: '가입되지 않은 회원입니다.' });
                }

            } catch (error) {
                console.error(error);
                done(error);
            }
        }
    ));
};