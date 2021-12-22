const express 	= require('express');
const router 	= express.Router();

const authRouter 	   = require('./auth.router');
// const postRouter = require('./post.router');
// const followerRouter 	   = require('./follower.router');
// const followingRouter 	   = require('./folllowing.route');




router.get('/', function (req, res, next) {
	res.render('index', { title: 'Master' });
});

router.use('/auth', authRouter);
// router.use('/post',postRouter);
// router.use('/follower',followerRouter);
// router.use('/following',followingRouter);


module.exports = router;