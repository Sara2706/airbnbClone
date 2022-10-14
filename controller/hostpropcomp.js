// packsge require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const { UserData, PropertyData, BookingData, ContactData} = require('../schema/schema.js');
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

// send specific proprety page
app.get('/hostproperty/:id', async (req, res) => {
    // save property id in cookies
    req.session.propertyId= req.params.id;
    res.sendFile(path.resolve('./views/hostproperty.html'));
})

// send specific property data using cookie here
app.get('/propertydata', async (req, res) => {
    PropertyData.findOne({ propertyId: req.session.propertyId }, (err, docs) => {
        if (docs) {
            res.json(docs)

        } else {
            console.log(err);
        }
    })
})

// export modeule here
module.exports =app;