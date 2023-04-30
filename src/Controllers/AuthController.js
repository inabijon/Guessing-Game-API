const { User } = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const joi = require('joi');
const secret = require('../Config/secret');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
     
        const schema = joi.object({
            username: joi.string().required().min(6).max(20),
            password: joi.string().required().min(3),
        })

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }

        const uniqueUser = await User.findOne({username});

        if(uniqueUser){
            return res.status(200).json({
                status: 'error',
                message: 'Username already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            username,
            password: hashedPassword,
        })
        
        const token = jsonwebtoken.sign({ username }, secret.JWT, { expiresIn: '1d' });
        
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                username: user.username,
                avatar: user.avatar,
                token: token,
                _id: user._id
            }
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: err.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const schema = joi.object({
            username: joi.string().required().min(6).max(20),
            password: joi.string().required().min(3),
        })

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(200).json({
                status: 'error',
                message: 'Username or password is incorrect',
            });
        } else {
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(200).json({
                    status: 'error',
                    message: 'Username or password is incorrect',
                });
            }

            const token = jsonwebtoken.sign({ username }, secret.JWT, { expiresIn: '1d' });

            res.status(200).json({
                status: 'success',
                message: 'Login successfully',
                data: {
                    username: user.username,
                    avatar: user.avatar,
                    token: token,
                    _id: user._id
                }
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: err.message,
        });
    }
}