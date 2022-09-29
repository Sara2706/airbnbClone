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
app.use('/views/assets', express.static(path.join(__dirname, '/views/assets')));

// image storing path
const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './views/assets');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.parse(file.originalname).name + path.extname(file.originalname));
    }
});

// multer docs
const gallery = multer({ storage: galleryStorage }).array('Gallery');

// send file add property page here
app.get('/host/addproperty', (req, res) => {
    res.sendFile(path.resolve('./views/hostaddproperty.html'));

})

// save property using api
app.post('/host/addpropertydata', gallery, async (req, res) => {
    console.log(req.body);

    // set property id here
    var propVal = 0;

    if (await PropertyData.count({}) == 0) {
        propVal = 1;
    } else {
        let propertyId = await PropertyData.findOne().sort('-_id')
        propVal = propertyId.propertyId + 1;
    }

    // push images one by one into array
    let imageData = [];
    for (let i = 0; i < req.files.length; i++) {
        imageData.push(req.files[i].filename);
    }
    console.log(imageData);
    // propert connect with schema
    const newProperty = new PropertyData({
        propertyId: propVal,
        userId: req.cookies.userId,
        propertyName: req.body.Propertyname,
        ownerofProperty: req.body.Ownername,
        country: req.body.Country,
        city: req.body.City,
        state: req.body.State,
        pricing: req.body.Pricing,
        size: req.body.Squarefeet,
        rating: req.body.Rating,
        gallery: [imageData],
        noOfBedroom: req.body.Noofbedroom,
        noOfBathroom: req.body.Noofbathroom,
        noOfBed: req.body.Noofbed,
        noOfPeople: req.body.Noofpeople,
        description: req.body.Description,
        propertyTag: req.body.Tagname,
        aminities: {
            parking: req.body.Parking,
            wifi: req.body.Wifi,
            breakFast: req.body.Breakfast,
            ac: req.body.Ac,
            tv: req.body.Tv,
            londry: req.body.Loundry,
            freez: req.body.Freez,
            kitchen: req.body.Kitchen,
            smokeAlarm: req.body.Smokealarm,
            petsAllowed: req.body.Petsallowed,
        },
    })
    // save new property
    newProperty.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added');
        }
    })
    // redirect to host page
    res.redirect('/host');
})

// export module here
module.exports = app;