const express = require('express')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require("./middleware/ErrorHandlingMiddleware")
const { default: mongoose } = require('mongoose')
const path = require('path')

const PORT = 5000;
const URL = "mongodb://localhost/dental"

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api', router)
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})
app.get('/register', (req, res) => {
    res.sendFile(`${__dirname}/public/register.html`)
})
app.post('/', () => {console.log('text')})
app.post("/registration", registration);

async function registration(req, res, next){
        // const {email, password, role, name} = req.body
        const data = req
        console.log(data)
        // if(!email || !password){
        //     return next(ApiError.badRequest("Некорректный email или пароль"))
        // }
        // const candidate = await User.findOne({email:email})
        // if(candidate){
        //     return next(ApiError.badRequest("Пользователь с таким email уже существует"))
        // }
        // const hashPassword = await bcrypt.hash(password, 5)
        // const user = await User.create({email, role, password:hashPassword, name})
        // const token = generateJwt(user.id, user.email, user.role)
        // return res.json({token})
    }

// app.use(errorHandler)
const start = async () => {
    try {
        await mongoose.connect(URL, {family:4});
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
        console.log("MongoDB successfully connected");
    }catch (e){
        console.log(e)
    }
}
start()