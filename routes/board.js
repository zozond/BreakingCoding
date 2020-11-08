const express = require('express');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();
const Board = require("../models/boards");
const User = require("../models/users");

router.get('/', isLoggedIn, async (req, res) => {
    const list = await Board.findAll({});

    console.log(list);
    res.render('board', {
        title: "게시판",
        list: list
    });
});

router.get('/writing', isLoggedIn, (req, res) => {
    res.render('write_board');
});

router.post('/writing', isLoggedIn, async (req, res, next) => {
    try {
        console.log(req.body);
        const user = await User.findOne({ where: { userId: req.user.userId } });

        if (!user) {
            res.redirect('/?Error=유저를 찾을 수 없습니다');
        }
        await Board.create({
            authorId: req.user.id,
            author: req.user.nickname,
            title: req.body.title,
            content: req.body.content,
        });
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await Board.findOne({ where: { id: req.params.id } });

        if (!board) {
            res.redirect('/?Error=글을 찾을 수 없습니다');
        }
        
        return res.render("board_detail", { board: board });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;