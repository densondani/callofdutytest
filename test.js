require('dotenv').config();
const express = require('express'); // Initizing express
const bodyparser = require('body-parser'); // Initizing bodyparser
const mongoose = require('mongoose'); // // Initizing mongoose
const app = express(); // Declare app by express
const port = process.env.PORT || 3000; //  Delcaring port as public

const SMS = require('./models/sms'); // calling schema from model folder

// Initialing DB connection using mongoose
mongoose.connect(process.env.MONGODB_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('API MongoDB Connected');
});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// app for listen port 3000
app.listen(port, function () {
    console.log('API Listening on port : ' + port);
});

// POST service for create templates for SMS
app.post('/createsmstemplate', function (req, res) {
    const createSMStemplate = new SMS({
        id: req.body.id,
        sms_text: req.body.sms_text,
    });
    createSMStemplate.save(function (err, saved) {
        if (err) {
            res.status(200).send({
                status: false,
                Error: err
            });
        } else {
            res.status(200).send({
                status: true,
                CreatedTemplate: saved
            });
        }
    });
});

// GET service for get template using id
app.get('/gettemplate/:id', function (req, res) {
    SMS.findOne({ id: req.params.id }, function (err, data) {
        if (err) {
            res.status(200).send({
                status: false,
                Error: err
            });
        } else {
            res.status(200).send({
                status: true,
                Template: data
            });
        }
    });
});
// Update service for edit template datas using id
app.put('/edittemplate/:id', function (req, res) {
    SMS.findOne({ id: req.params.id }, function (err, data) {
        if (err) {
            res.status(200).send({
                status: false,
                Error: err
            });
        } else if (!data) {
            res.status(200).send({
                status: false,
                Message: 'No Data found'
            });
        } else if (data) {
            if (req.body.sms_text) {
                data.sms_text = req.body.sms_text;
            }
        }
        data.save(function (err, saved){
            if (err) {
                res.status(200).send({
                    status: false,
                    Error: err
                });
            } else {
                res.status(200).send({
                    status: true,
                    TemplateEditted: saved
                });
            }
        });
    });
});

// DELETE service for delete a template using id
app.delete('/deletetemplate/:id', function (req, res) {
    SMS.findOneAndRemove({ id: req.params.id }, function (err, data) {
        if (err) {
            res.status(200).send({
                status: false,
                Error: err
            });
        } else {
            res.status(200).send({
                status: true,
                message: 'Deleted Successfully'
            });
        }
    });
});

// GET service for send sms using id and parameter name
app.get('/sendsms/:id/:name', function (req, res){
    SMS.findOne({ id: req.params.id }, function (err, data) {
        let firstword = (data.sms_text).slice(0, 5) + ' ' + req.params.name + ',';
        let remaining_sentance = (data.sms_text).substr((data.sms_text).indexOf(" ") + 1);
        if (err) {
            res.status(200).send({
                status: false,
                Error: err
            });
        } else {
            res.status(200).send({
                status: true,
                SMSText: firstword + remaining_sentance
            });
        }
    });
});