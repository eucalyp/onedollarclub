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
		type: Array,
		required: 'Please define Vote options'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Vote', VoteSchema);