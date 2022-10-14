// package require
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

app.use(cookieParser());


// send my booking using api
app.get('/mybookings', (req, res) => {
    res.sendFile(path.resolve('./views/mybookings.html'));
})

// fetch my booking datas
app.get('/fetchmyboookings', async (req, res) => {

    const sendBook = await BookingData.find({ bookingGuestId: req.session.userId });
    console.log(sendBook);
    res.json(sendBook)
})

// send specific property data
app.get('/mybookingpropertydata', async (req, res) => {
    const myBooking = await BookingData.find({ bookingGuestId: req.session.userId });
    console.log(myBooking);
    var propId = [];
    for (let i = 0; i < myBooking.length; i++) {
        propId.push(myBooking[i].propertyId)
    }
    console.log(propId);
    // console.log(propId);

    // get property id here
    let doc = []
    for (let i = 0; i < propId.length; i++) {
        const bookkedProp = await PropertyData.find({ propertyId: propId[i] })
        doc.push(bookkedProp);
    }


    console.log(doc);
    res.json(doc)
})

// exprot module here
module.exports = app;