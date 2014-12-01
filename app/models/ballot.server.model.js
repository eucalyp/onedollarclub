'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Vote Schema
 */
var BallotSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId
    },
    vote: {
        type: Schema.ObjectId
    },
    choice: {
        type: String
    }
});

mongoose.model('Ballot', BallotSchema);