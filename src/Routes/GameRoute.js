const express = require('express');
const router = express.Router();
const { createNewGame, guessNumber, getGameResult, getGameHistory, Leaderboard  } = require('../Controllers/GameController');
const auth = require('../Middlewares/AuthMiddleware');

router.post('/new/:user_id', auth , createNewGame);
router.post('/guess/:user_id/:game_id', auth, guessNumber);   
router.get('/history/:user_id', auth, getGameHistory);
router.get('/history/:user_id/:game_id', auth, getGameResult);
router.get('/leaderboard', Leaderboard);

module.exports = router;