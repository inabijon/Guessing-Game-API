const { Game } = require("../Models/GameModel");
const { Guess } = require("../Models/GuessModel");
const { GameResult } = require("../Models/GameResultModel");
const { User } = require("../Models/UserModel");
const { secret_number } = require("../Helpers/SecretNumberGenerator");

exports.createNewGame = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const game = await Game.create({
      secret_number: secret_number(),
      user: user_id
    });

    await game.save();

    res.status(201).json({
      status: "success",
      message: "Game created successfully",
      game_id: game._id,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      details: err.message,
    });
  }
};

exports.guessNumber = async (req, res) => {
  try {
    const { user_id, game_id } = req.params;
    const { guess_number } = req.body;

    if (!user_id || !game_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID and Game ID are required",
      });
    }

    if (!guess_number) {
      return res.status(400).json({
        status: "error",
        message: "Guess number is required",
      });
    }

    const USER = await User.findById(user_id);
    const GAME = await Game.findById(game_id);
    const GUESS = await Guess.findOne({ game: game_id, user: user_id });
    const gameResult = await GameResult.findOne({ game: game_id, user: user_id });

    let attempt = 1;

    if (!USER || !GAME) {
      return res.status(404).json({
        status: "error",
        message: "User or Game not found",
      });
    }

    if(gameResult) {
      if(gameResult.isWon) {
        res.status(200).json({
          status: "success",
          message: "You already won the game",
          result: gameResult
        })
        return;
      } else if(!gameResult.isWon){
        res.status(200).json({
          status: "success",
          message: "You already lost the game",
          result: gameResult
        })
        return;
      }
    }

    if (GUESS) {
      attempt = GUESS.attempt + 1;
      GUESS.attempt = attempt;
      await GUESS.save();
    }

    const secret_number = GAME.secret_number;
    const secret_number_array = secret_number.toString().split("");
    const guess_array = guess_number.toString().split("");

    let M = 0;
    let P = 0;

    for (let i = 0; i < secret_number_array.length; i++) {
      if (secret_number_array[i] == guess_array[i]) {
        P++;
      } else if (secret_number_array.includes(guess_array[i])) {
        M++;
      }
    }

    if(P == 4) {

      if(gameResult) {
        if(gameResult.isWon) {
          res.status(200).json({
            status: "success",
            message: "You already won the game",
            result: gameResult
          })
          return;
        }
      }

      const guessResult = await Guess.create({
        game: game_id,
        user: user_id,
        guess_number: guess_number,
        M: M,
        P: P,
        attempt: attempt
      }).then(async (guessResult) => {
        await guessResult.save();
        const gameResult = await GameResult.create({
          game: game_id,
          user: user_id,
          isWon: true,
          attempt: attempt
        })
        await gameResult.save();

        return {
          guess: guessResult,
          game: gameResult
        }
      })
      
      res.status(200).json({
        status: "success",
        message: "You won the game",
        gameResult: guessResult.game,
        guessResult: guessResult.guess
      })

      return;
    }
    
    if(attempt == 8) {
      const guessResult = await Guess.create({
        game: game_id,
        user: user_id,
        guess_number: guess_number,
        M: M,
        P: P,
        attempt: attempt
      }).then(async (guessResult) => {
        await guessResult.save();
        
        const gameResult = await GameResult.create({
          game: game_id,
          user: user_id,
          isWon: false,
          attempt: attempt
        })
        await gameResult.save();

        return {
          guess: guessResult,
          game: gameResult
        }
      })
      
      res.status(200).json({
        status: "success",
        message: "You lost the game",
        gameResult: guessResult.game,
        guessResult: guessResult.guess
      })

      return;
    }

    const lastResult = await Guess.create({
      game: game_id,
      user: user_id,
      guess_number: guess_number,
      M: M,
      P: P,
      attempt: attempt
    })

    await lastResult.save();
    
    res.status(200).json({
      status: "success",
      message: "Guess number saved",
      result: {
        attempt: lastResult.attempt,
        M: lastResult.M,
        P: lastResult.P,
      }
    })

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      details: err.message,
    });
  }
};

exports.getGameResult = async (req, res) => {
  try {
    const { user_id, game_id } = req.params;

    if (!user_id || !game_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID and Game ID is required",
      });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const gameResult = await GameResult.find({ game: game_id, user: user_id });

    if (!gameResult) {
      return res.status(400).json({
        status: "error",
        message: "Game result not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Game result fetched successfully",
      data: gameResult,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      details: err.message,
    });
  }
};

exports.getGameHistory = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const gameHistory = await Game.find({ user: user_id });

    res.status(200).json({
      status: "success",
      message: "Game history fetched successfully",
      data: gameHistory.map((game) => {
        return {
          _id: game._id,
          created_at: game.created_at,
          user: game.user,
        };
      }),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      details: err.message,
    });
  }
};

exports.Leaderboard = async (req, res) => {
  try {
    const gameResult = await GameResult.find({});

    const sortedGameResult = gameResult.sort((a, b) => {
      return a.attempt - b.attempt;
    })

    const groupedGameResult = sortedGameResult.reduce((r, a) => {
      r[a.user._id] = [...(r[a.user._id] || []), a];
      return r;
    })

    const users = await User.find({});

    const leaderboard = users.map((user) => {
      const userGameResult = groupedGameResult[user._id];
      const won = userGameResult.filter((gameResult) => gameResult.isWon == true).length;
      const lost = userGameResult.filter((gameResult) => gameResult.isWon == false).length;
      const total = won + lost;
      const winRate = (won / total) * 100;
      return {
        _id: user._id,
        username: user.username,
        won: won,
        lost: lost,
        total: total,
        winRate: winRate
      }
    })

    const sortedLeaderboard = leaderboard.sort((a, b) => {
      return b.winRate - a.winRate;
    })

    res.status(200).json({
      status: "success",
      message: "Leaderboard fetched successfully",
      data: sortedLeaderboard,
    })

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      details: err.message,
    });
  }
}