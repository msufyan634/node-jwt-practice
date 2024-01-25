require("./config/database").connect()
const express = require('express')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())


// Register
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        // validate user input

        if (!(firstName && lastName && email && password)) {
            res.status(400).send("All input is required")
        }

        // check if user already exist

        const oldUser = await User.findOne({ email })
        if (oldUser) {
            return res.status(409).send('User Already Exist. Please Login')
        }

        //Encrypt user password

        encryptedPassword = await bcrypt.hash(password, 10)

        // Create user in our database

        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword
        })

        // craete Token

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: '2h'
            }
        )
        user.token = token;
        res.status(201).json(user);
    }
    catch (err) {
        console.log(err);
    }

})

// Login

app.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {

            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            )
            user.token = token
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");


    }
    catch (err) {
        console.log(err);

    }

})


const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});


module.exports = app