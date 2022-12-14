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

// send property file and save property id in cookies
app.get('/property/:id', async (req, res) => {
    req.session.propertyId= req.params.id;
    res.sendFile(path.resolve('./views/product.html'))
})

// send property data here
app.get('/propertydata', async (req, res) => {
    PropertyData.findOne({ propertyId: req.session.propertyId }, (err, docs) => {
        if (docs) {
            res.json(docs)

        } else {
            console.log(err);
        }
    })
})

// send property review data
app.get('/propertyreview', async (req, res) => {
    RatingData.find({ propertyId: req.session.propertyId }, (err, docs) => {
        if (docs) {
            console.log(docs);
            res.json(docs)

        } else {
            console.log(err);
        }
    })
})

// send property rating
app.get('/propertyrating', async (req, res) => {
    const ratingData = await RatingData.find({ propertyId: req.session.propertyId });
    var ratings = 0;

    for (let i = 0; i < ratingData.length; i++) {
        ratings += ratingData[i].rating;
    }
    const propRating = ratings / (ratingData.length);
    res.json(propRating);
})

// if booking error means send error to user 
app.get('/bookingerror', (req, res) => {
    if (req.cookies.bookingError) {
        const error = req.cookies.bookingError;
        res.clearCookie('bookingError');
        res.json(error)
    }else{
        res.json('');
    }
})

// get booking details fro user
app.post('/property/booking', async (req, res) => {
    const property = await PropertyData.findOne({ propertyId: req.session.propertyId });
    const userd = await UserData.findOne({ userId: req.session.userId });

    // no login means redirect to  login page
    if (await req.session.userId == undefined) {
        req.session.logInError= 'Need login before book a property';
        res.redirect('/login')
        // } else {check user type

    } else {
        if (req.body.Nop <= property.noOfPeople) {
            const checkIn = req.body.CheckIn;
            const checkOut = req.body.CheckOut;
            const checkInDate = (new Date(req.body.CheckIn).getTime()) / (1000 * 60 * 60 * 24);
            const checkOutDate = (new Date(req.body.CheckOut).getTime()) / (1000 * 60 * 60 * 24);
            const numberOfPerson = req.body.Nop;
            const totalDays = (checkOutDate - checkInDate);
            const price = property.pricing;
            const guestName = userd.name;
            const totalPrice = property.pricing * totalDays;
            const propertySelectedId = req.session.propertyId;
            const propertyName = property.propertyName;
            // save all detail in cookies
            const bookingDetails = [checkIn, checkOut, numberOfPerson, totalDays, price, totalPrice, propertySelectedId, propertyName]
            req.session.detailOfBooking= bookingDetails;
            res.redirect('/booking/conformation');
        } else {
            // send error to user
            res.cookie('bookingError', `Person no more then ${property.noOfPeople}`);
            res.redirect(`/property/${req.session.propertyId}`);
        }
    }

})

// module export here
module.exports = app;