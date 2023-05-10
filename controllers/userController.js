const ApiError = require('../error/ApiError')
const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController{
    async registration(req, res, next){
        const {email, password, role, name} = req.body
        if(!email || !password){
            return next(ApiError.badRequest("Некорректный email или пароль"))
        }
        const candidate = await User.findOne({email:email})
        if(candidate){
            return next(ApiError.badRequest("Пользователь с таким email уже существует"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password:hashPassword, name})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next){
        const {email, password} = req.body
        const user = await User.findOne({email:email})
        if(!user){
            return next(ApiError.badRequest("Пользователь с таким email не найден"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
            return next(ApiError.internal("Пароль неверный"))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }
    async check(req, res, next){
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
    
}

module.exports = new UserController()