// require package
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const { UserData, PropertyData, BookingData, ContactData } = require('../schema/schema.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');

// middleware
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(`views`))
app.set('trust proxy', 1) // trust first proxy


app.use(cookieParser());
app.use('/profile', express.static(path.join(__dirname, '/profile')));

// profile save stroge
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'profile');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.parse(file.originalname).name + path.extname(file.originalname));
    }
});

// multer docs
const profile = multer({ storage: storage });

// send login page using api
app.get('/login', (req, res) => {
    res.sendFile(path.resolve('./views/login.html'));
})

// send register file here using api
app.get('/register', (req, res) => {
    res.sendFile(path.resolve('./views/register.html'));
})

// check and ave register data
app.post('/register', profile.single("Profile"), async (req, res) => {
    console.log(req.body.Password);
    // create use id here
    var userVal = 0;

    if (await UserData.count({}) == 0) {
        userVal = 1;
    } else {
        let userId = await UserData.findOne().sort('-_id')
        userVal = userId.userId + 1;
    }

    console.log(req.body.Password);

    // bcrypt password here
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(req.body.Password, salt);

    // connect with schema
    const newUser = new UserData({
        userId: userVal,
        userName: req.body.Username,
        userType: req.body.UserType,
        email: req.body.Email,
        name: `${req.body.Firstname} ${req.body.Secondname}`,
        password: hashedPassword,
        mobile: req.body.Moblie,
        DOB: req.body.Dob,
        country: req.body.Country,
        state: req.body.State,
        city: req.body.City,
        gender: req.body.Gender,
        profilePicture: req.file.filename
    })

    // check these data alresy there or not
    if (await UserData.findOne({ userName: req.body.Username })) {
        req.session.RegisterError='Username is already exists';
        res.redirect('/register');
    } else if (await UserData.findOne({ mobile: req.body.mobile })) {
        req.session.RegisterError='Mobile number is already exists';
        res.redirect('/register');
    } else if (await UserData.findOne({ email: req.body.email })) {
        req.session.RegisterError='Email is already exists';
        res.redirect('/register');
    } else {
        if (req.body.Password == req.body.ConformPassword) {
            // if no means save user
            newUser.save((err, result) => {
                if (err) {
                    console.log('error');
                } else {
                    console.log('Added');
                }
            })
            // eirevt o login
            res.redirect('/login');
        } else {
            req.session.RegisterError='password and conform password is not same';
            res.redirect('/register');
        }
    }


})

// get login data and check is correct or not
app.post('/login', async (req, res) => {
    console.log(req.body.loginpassword);

    // check email
    const logUserEmail = await UserData.findOne({ email: req.body.loginuserdata });

    console.log(logUserEmail);


    // if email
    if (logUserEmail == null) {
        req.session.logInError = 'Invalid email address';
        res.redirect('/login');

    } else {
        // check password
        const passCompare = await bcrypt.compare(req.body.loginpassword, logUserEmail.password);
        // check password true or false
        if (passCompare == true) {
            // check user type
            if (logUserEmail.userType == 'Host') {

                req.session.userId=logUserEmail.userId;
                res.redirect('/host');
            } else {
                req.session.userId = logUserEmail.userId;
                req.session.save();
                // console.log(
                //     req.session
                // );
                res.redirect('/intro');
            }
        } else {
            req.session.logInError = 'Invalid password';
            res.redirect('/login');
        }
    }


})


// if error in register means send to user register error 
app.get('/registererror', async (req, res) => {
    const error = await req.session.RegisterError;
    if (await error == undefined) {
        res.json('')
    } else {
        req.session.destroy;
        res.json(error)
    }
})

// if error in login means send error to user
app.get('/loginerror', async (req, res) => {
    const error = await req.session.logInError;
    if (await error == undefined) {
        res.json('')
    } else {
        req.session.destroy;
        res.json(error)
    }
})

// logout clear all session
app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log(req.session);
    res.redirect('/');
})

// module export here
module.exports = app;