// Require packages 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const { UserData, PropertyData, BookingData, ContactData } = require('./schema/schema');
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
app.use(express.static(`views/style/style.css`))

app.use(cookieParser());
app.use('/profile', express.static(path.join(__dirname, '/profile')));
app.use(session({
    secret: 'itissecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}))

const port = process.env.PORT || 4000;

/*

Guest:

1.Check validation of user email and password if wrong means gives alert to user
2.Once click card go to property page
3.There asking check in and check out date and no of person
4.If no.of.person above host given means its getting alert
5.After that its asking conformation and and payment details
6.Then it book success
7.Go my booking check my bookings 
8.After finish the booking give rating to that proeperty
9.Once give rating for noe booking means  is finish then no rating option tere only Need help is there
10.The rating is upadeted each user give rating
11.Contact us ppage used to contact team using query

Host:

1.Check validation of user email and password if wrong means gives alert to user.
2.Once click card go to property page.
3.Host dont have a access to book property.
4.Host have a access to add a new property.

*/

// add files
// login , register and logout
app.use(require('./controller/login&register.js'));

// landingpage
app.use(require('./controller/landing.js'));

// propertypage
app.use(require('./controller/property.js'));

// bookings page
app.use(require('./controller/booking.js'));

// booking conform
app.use(require('./controller/bookingconform.js'));

// check my booking
app.use(require('./controller/mybookings.js'));

// booking component
app.use(require('./controller/bookingcomp.js'));

// host page
app.use(require('./controller/host.js'));

// host property component
app.use(require('./controller/hostpropcomp.js'));

// host add property
app.use(require('./controller/hostaddprop.js'));

// rating and review
app.use(require('./controller/rating&review.js'));

// intro
app.get('/intro', async (req, res) => {
    console.log(req.session);
    res.sendFile('./views/intro.html', { root: __dirname })
})



// contact
app.get('/contact', async (req, res) => {
    if (await req.session.userId == undefined) {
        res.redirect('/login')
    }
    res.sendFile('./views/contact.html', { root: __dirname })
})

// query data
app.post('/contactquerydata', async (req, res) => {

    // create contact id here
    var contactVal = 0;

    if (await ContactData.count({}) == 0) {
        contactVal = 1;
    } else {
        let contactId = await ContactData.findOne().sort('-_id')
        contactVal = contactId.contactId + 1;
    }

    // connect with schema
    const newQuery = new ContactData({
        contactId: contactVal,
        email: req.body.Email,
        query: req.body.Query,
        name: req.body.Name,
        mobile: req.body.Phone,
    })

    // save query details
    newQuery.save((err, result) => {
        if (err) {
            console.log('error');
        } else {
            console.log('Added');
        }
    })
    // redirect to home
    res.redirect('/')
})

app.listen(port, () => {
    console.log('Server started')
})