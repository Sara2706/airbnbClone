// require package
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const { UserData, PropertyData, BookingData, ContactData } = require('../schema/schema.js');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const bcrypt = require('bcrypt');

// middleware
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(`views`))

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

    // connect with schema
    const newUser = new UserData({
        userId: userVal,
        userName: req.body.Username,
        userType: req.body.UserType,
        email: req.body.Email,
        name: `${req.body.Firstname} ${req.body.Secondname}`,
        password: req.body.Password,
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
        res.cookie('RegisterError', 'Username is already exists ');
        res.redirect('/register');
    } else if (await UserData.findOne({ mobile: req.body.mobile })) {
        res.cookie('RegisterError', 'Mobile number is already exists ');
        res.redirect('/register');
    } else if (await UserData.findOne({ email: req.body.email })) {
        res.cookie('RegisterError', 'Email is already exists ');
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
            res.cookie('RegisterError', 'password and conform password is not same');
            res.redirect('/register');
        }
    }


})

// get login data and check is correct or not
app.post('/login', async (req, res) => {
    console.log(req.body.loginpassword);
    // bcrypt password here
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.loginpassword, salt);
    // check email
    const logUserEmail = await UserData.findOne({ email: req.body.loginuserdata });
    if (logUserEmail) {
        // check password
        if (await bcrypt.compare(logUserEmail.password, hashedPassword)) {
            // check user type
            if (logUserEmail.userType == 'Host') {

                res.cookie('userId', logUserEmail.userId)
                res.redirect('/host');
            } else {
                res.cookie('userId', logUserEmail.userId)
                res.redirect('/intro');
            }
        } else {
            res.cookie('logInError', 'Invalid password')
            res.redirect('/login');
        }
    } else {
        res.cookie('logInError', 'Invalid email address')
        res.redirect('/login');
    }


})


// if error in register means send to user register error 
app.get('/registererror',async (req, res) => {
    const error = await req.cookies.RegisterError;
    if (await error == undefined) {
        res.json('')
    }else{
        res.clearCookie('RegisterError')
        res.json(error)
    }
})

// if error in login means send error to user
app.get('/loginerror', async (req, res) => {
    const error = await req.cookies.logInError;
    if (await error == undefined) {
        res.json('')
    }else{
        res.clearCookie('logInError')
        res.json(error)
    }
})

// logout clear all cookies
app.get('/logout', (req, res) => {
    res.clearCookie('userId')
    res.clearCookie('propertyId')
    res.clearCookie('detailOfBooking')
    res.clearCookie('bookingError');
    res.clearCookie('bookingPropId');
    res.clearCookie('bookingId');
    res.clearCookie('logInError');
    res.clearCookie('RegisterError');
    res.redirect('/');
})

// module export here
module.exports = app;