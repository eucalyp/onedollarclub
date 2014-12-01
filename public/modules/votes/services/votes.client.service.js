'use strict';

//Votes service used to communicate Votes REST endpoints
angular.module('votes').factory('Votes', ['$resource',
	function($resource) {
		return $resource('votes/:voteId', { voteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('votes').factory('Ballots', ['$resource',
    function($resource) {
        return $resource('ballots/:ballotId', { ballotId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);