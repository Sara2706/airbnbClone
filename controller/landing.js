// packeage require
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

// send index page its landing page
app.get('/', (req, res) => {
    res.clearCookie('propertyId')
    res.sendFile(path.resolve('./views/index.html'))
})

// check user is login or not
app.get('/log', async (req, res) => {

    if (await req.cookies.userId == undefined) {
        const logdata = ['Register', 'Login']
        res.json(logdata)
    } else if (req.cookies.userId) {
        const logdata = ['Logout']
        res.json(logdata)
    }
})

// fetch datas and send to frontend
app.get('/fetch', (req, res) => {

    PropertyData.find({}, (err, docs) => {
        if (docs) {
            res.json(docs);

        } else {
            console.log(err);
        }
    })
})

// export module here
module.exports = app;