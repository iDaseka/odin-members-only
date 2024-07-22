const mongoose = require('mongoose');
const {DateTime} = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    timestamp: {type: Date, required: true}
});

MessageSchema.virtual('url').get(function(){
    return '/messages/' + this._id;
})

MessageSchema.virtual('formattedDate').get(function(){
    const date = DateTime.fromJSDate(this.timestamp);
    const formatted = date.toFormat('HH:mm (dd/MM/yyyy)');
    return formatted;
})

module.exports = mongoose.model('Message', MessageSchema)