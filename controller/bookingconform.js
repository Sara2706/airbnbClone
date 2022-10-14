// packsge require
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
app.use(express.static(`./views/style/style.css`))

app.use(cookieParser());

// booking success
app.post('/conformation/success', async (req, res) => {
    // set booking id here
    var bookVal = 0;

    if (await BookingData.count({}) == 0) {
        bookVal = 1;
    } else {
        let bookingId = await BookingData.findOne().sort('-_id')
        bookVal = bookingId.bookingId + 1;
    }

    const date = new Date();

    // connect with schema
    const newBooking = new BookingData({
        bookingId: bookVal,
        bookingDate: date,
        bookingGuestId: req.session.userId,
        propertyId: req.session.propertyId,
        propertyName: req.body.propertyName,
        guestName: req.body.GuestName,
        checkIn: req.body.Checkin,
        checkOut: req.body.Checkout,
        totalPrice: req.body.Totalprice,
        paymentMethod: req.body.Payment,
        noOfNights: req.body.Non,
        noOfPersons: req.body.Nop
    })
    //    save booking here
    newBooking.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added');
        }
    })
    //    send success file
    res.sendFile(path.resolve('./views/bookingsuccess.html'));
})

// export module here
module.exports = app;