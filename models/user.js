const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {type: String, required: true, minLength: 1},
    lastname: {type: String, required: true, minLength: 1},
    email: {type: String, required: true, minLength: 1, unique: true},
    password: {type: String, required: true, minLength: 1},
    membership: {type: Boolean, default: false},
})

UserSchema.virtual('fullName').get(function(){
    return '' + this.firstname + ' ' + this.lastname;
})

UserSchema.virtual('url').get(function(){
    return '/' + this._id;
})
module.exports = mongoose.model('User', UserSchema)