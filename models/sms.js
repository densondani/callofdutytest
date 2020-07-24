const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sms = new Schema({
    id: {
        type : String,
    },
    sms_text: {
        type: String,
    }
});

module.exports = mongoose.model('SMS', Sms);