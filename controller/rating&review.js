// package require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const { UserData, PropertyData, BookingData, RatingData, ContactData } = require('../schema/schema.js');
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

app.use(cookieParser());

// send rating page here
app.get('/rating', async (req, res) => {
    if (await req.session.userId == undefined) {
        req.session.logInError= 'Need login';
        res.redirect('/login')
    } else {
        res.sendFile(path.resolve('./views/ratings.html'));
    }

})

// get rating data from user
app.post('/reviewdata', async (req, res) => {

    // create rating id
    var ratingVal = 0;

    if (await RatingData.count({}) == 0) {
        ratingVal = 1;
    } else {
        let ratingId = await RatingData.findOne().sort('-_id')
        ratingVal = ratingId.ratingId + 1;
    }
    const date = new Date();

    // create new rating
    const newRating = new RatingData({
        ratingId: ratingVal,
        userId: req.session.userId,
        propertyId: req.session.bookingPropId,
        bookingId: req.session.bookingId,
        reviewDate: date,
        reviewHeading: req.body.reviewheading,
        reviewDescription: req.body.review,
        rating: req.body.rating,
    })

    // save rating here
    newRating.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added');
            console.log(result);
        }
    });
})

// module exprot here
module.exports = app;