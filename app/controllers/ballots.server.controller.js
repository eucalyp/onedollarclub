'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Ballot = mongoose.model('Ballot'),
    _ = require('lodash');

/**
 * Create a Ballot
 */
exports.create = function(req, res) {
    console.log(req.body);
    var ballot = new Ballot(req.body);
    ballot.user = req.user;

    ballot.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ballot);
        }
    });
};

/**
 * Show the current Ballot
 */
exports.read = function(req, res) {
    res.jsonp(req.ballot);
};

/**
 * Update a Ballot
 */
exports.update = function(req, res) {
    var ballot = req.ballot ;

    ballot = _.extend(ballot, req.body);

    ballot.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ballot);
        }
    });
};

/**
 * Delete a Ballot
 */
exports.delete = function(req, res) {
    var ballot = req.ballot ;

    ballot.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ballot);
        }
    });
};

/**
 * List of Ballots
 */
exports.list = function(req, res) { 
    Ballot.find().sort('-created').populate('user', 'displayName').exec(function(err, ballots) {
        if (err)  {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ballots);
        }
    });
};

/**
 * Ballot middleware
 */
exports.ballotByID = function(req, res, next, id) { 
    Ballot.findById(id).populate('user', 'displayName').exec(function(err, vote) {
        if (err) return next(err);
        if (! vote) return next(new Error('Failed to load Vote ' + id));
        req.vote = vote ;
        next();
    });
};