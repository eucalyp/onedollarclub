'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var votes = require('../../app/controllers/votes.server.controller');
    var ballots = require('../../app/controllers/ballots.server.controller');

    // Votes Routes
    app.route('/ballots')
        .get(ballots.list)
        .post(users.requiresLogin, ballots.create);

    app.route('/ballots/:ballotId')
        .get(ballots.read)
        .put(users.requiresLogin, ballots.update)
        .delete(users.requiresLogin, ballots.delete);

    // Finish by binding the Vote middleware
    app.param('ballotId', ballots.ballotByID);
};
