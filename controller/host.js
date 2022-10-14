// packsge require
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

// chech host and send file
app.get('/host', async (req, res) => {
    const logUser = await UserData.findOne({ userId: req.session.userId });
    if (logUser.userType == 'Host') {
        res.sendFile(path.resolve('./views/host.html'));
    } else {
        req.session.RegisterError= 'Register for host first';
        res.redirect('/register');
    }

})



// send specific property for host 

app.get('/hostproperty', (req, res) => {
    PropertyData.find({ userId: req.session.userId }, (err, docs) => {
        if (docs) {
            res.json(docs)
        } else {
            console.log(err);
        }
    })

})

// module export here
module.exports = app;