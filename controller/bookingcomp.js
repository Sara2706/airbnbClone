// package require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const { UserData, PropertyData, BookingData, RatingData, ContactData } = require('../schema/schema.js');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcrypt');

// middleware
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(`views`))

app.use(cookieParser());


// send booking file
app.get('/mybookings/:id', async (req, res) => {
    req.session.bookingId= req.params.id;
    res.sendFile(path.resolve('./views/bookingproperty.html'));
    
})

// send booking data
app.get('/mybookingsingledata', async (req, res) => {
    const bookId = await BookingData.find({ bookingId: req.session.bookingId })

    const bookPropId = bookId[0].propertyId;

    req.session.bookingPropId= bookPropId;

    res.json(bookId);

})

// send specific property data
app.get('/mybookingsinglepropdata', async (req, res) => {
    const inBookingProp = await PropertyData.find({ propertyId: req.session.bookingPropId });
    res.json(inBookingProp);
})

// check user give alredy girve rating to this proprty or not
app.get('/mybookingratebutton', async (req, res) => {
    const inBookingProp = await RatingData.find({ bookingId: req.session.bookingId });
    if (inBookingProp.length > 0) {
        const ratingBtn = ['Need help?']
        res.json(ratingBtn);
    } else {
        const ratingBtn = ['Need help?', 'Add ratings']
        res.json(ratingBtn);
    }
})

// send rating here
app.get('/propertyratingmybook', async (req, res) => {
    const ratingData = await RatingData.find({ propertyId: req.session.bookingPropId });
    var ratings = 0;

    for (let i = 0; i < ratingData.length; i++) {
        ratings += ratingData[i].rating;
    }
    const propRating = ratings / (ratingData.length);
    res.json(propRating);
})

// send current reviews here
app.get('/propertyreviewingmybook', async (req, res) => {
    const ratingData = await RatingData.find({ propertyId: req.session.bookingPropId });
    var ratings = [];

    for (let i = 0; i < ratingData.length; i++) {
        if (ratingData[i].userId == req.session.userId) {
            ratings.push(ratingData[i])
        }
    }
    res.json(ratings);
})

// export module
module.exports = app;