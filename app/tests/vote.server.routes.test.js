'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Vote = mongoose.model('Vote'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, vote;

/**
 * Vote routes tests
 */
describe('Vote CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Vote
		user.save(function() {
			vote = {
				name: 'Vote Name'
			};

			done();
		});
	});

	it('should be able to save Vote instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vote
				agent.post('/votes')
					.send(vote)
					.expect(200)
					.end(function(voteSaveErr, voteSaveRes) {
						// Handle Vote save error
						if (voteSaveErr) done(voteSaveErr);

						// Get a list of Votes
						agent.get('/votes')
							.end(function(votesGetErr, votesGetRes) {
								// Handle Vote save error
								if (votesGetErr) done(votesGetErr);

								// Get Votes list
								var votes = votesGetRes.body;

								// Set assertions
								(votes[0].user._id).should.equal(userId);
								(votes[0].name).should.match('Vote Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vote instance if not logged in', function(done) {
		agent.post('/votes')
			.send(vote)
			.expect(401)
			.end(function(voteSaveErr, voteSaveRes) {
				// Call the assertion callback
				done(voteSaveErr);
			});
	});

	it('should not be able to save Vote instance if no name is provided', function(done) {
		// Invalidate name field
		vote.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vote
				agent.post('/votes')
					.send(vote)
					.expect(400)
					.end(function(voteSaveErr, voteSaveRes) {
						// Set message assertion
						(voteSaveRes.body.message).should.match('Please fill Vote name');
						
						// Handle Vote save error
						done(voteSaveErr);
					});
			});
	});

	it('should be able to update Vote instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vote
				agent.post('/votes')
					.send(vote)
					.expect(200)
					.end(function(voteSaveErr, voteSaveRes) {
						// Handle Vote save error
						if (voteSaveErr) done(voteSaveErr);

						// Update Vote name
						vote.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vote
						agent.put('/votes/' + voteSaveRes.body._id)
							.send(vote)
							.expect(200)
							.end(function(voteUpdateErr, voteUpdateRes) {
								// Handle Vote update error
								if (voteUpdateErr) done(voteUpdateErr);

								// Set assertions
								(voteUpdateRes.body._id).should.equal(voteSaveRes.body._id);
								(voteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Votes if not signed in', function(done) {
		// Create new Vote model instance
		var voteObj = new Vote(vote);

		// Save the Vote
		voteObj.save(function() {
			// Request Votes
			request(app).get('/votes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vote if not signed in', function(done) {
		// Create new Vote model instance
		var voteObj = new Vote(vote);

		// Save the Vote
		voteObj.save(function() {
			request(app).get('/votes/' + voteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vote.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vote instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vote
				agent.post('/votes')
					.send(vote)
					.expect(200)
					.end(function(voteSaveErr, voteSaveRes) {
						// Handle Vote save error
						if (voteSaveErr) done(voteSaveErr);

						// Delete existing Vote
						agent.delete('/votes/' + voteSaveRes.body._id)
							.send(vote)
							.expect(200)
							.end(function(voteDeleteErr, voteDeleteRes) {
								// Handle Vote error error
								if (voteDeleteErr) done(voteDeleteErr);

								// Set assertions
								(voteDeleteRes.body._id).should.equal(voteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vote instance if not signed in', function(done) {
		// Set Vote user 
		vote.user = user;

		// Create new Vote model instance
		var voteObj = new Vote(vote);

		// Save the Vote
		voteObj.save(function() {
			// Try deleting Vote
			request(app).delete('/votes/' + voteObj._id)
			.expect(401)
			.end(function(voteDeleteErr, voteDeleteRes) {
				// Set message assertion
				(voteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Vote error error
				done(voteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Vote.remove().exec();
		done();
	});
});