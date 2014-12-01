'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vote Schema
 */
var VoteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Vote name',
		trim: true
	},
	voteoptions: {
		type: Array
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ballot: {
		type: Schema.ObjectId,
		ref: 'Ballot'
	}
});

mongoose.model('Vote', VoteSchema);