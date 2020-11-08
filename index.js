const express = require('express')
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const { sequelize } = require('./models');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
dotenv.config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const boardRouter = require('./routes/board');
const passportConfig = require('./passport/index');

app.set('port', process.env.Port || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
})

passportConfig();


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: "session-cookie"
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/board', boardRouter);

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공')
    })
    .catch((err) => {
        console.error('데이터베이스 연결 실패 >>> ', err)
    });

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url}`);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 시작');
})