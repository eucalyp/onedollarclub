'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var votes = require('../../app/controllers/votes.server.controller');

	// Votes Routes
	app.route('/votes')
		.get(votes.list)
		.post(users.requiresLogin, votes.create);

	app.route('/votes/:voteId')
		.get(votes.read)
		.put(users.requiresLogin, votes.hasAuthorization, votes.update)
		.delete(users.requiresLogin, votes.hasAuthorization, votes.delete);

	// Finish by binding the Vote middleware
	app.param('voteId', votes.voteByID);
};
