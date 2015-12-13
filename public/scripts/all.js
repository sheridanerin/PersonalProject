angular.module('EMRapp', ['ui.router', 'ngMaterial'])
	.config(["$stateProvider", "$urlRouterProvider", function( $stateProvider, $urlRouterProvider ) {

		$stateProvider
			.state('home', {
				url:'/',
				templateUrl: 'templates/homeTmpl.html',
				controller: 'homeCtrl'
			})
			.state('userHome', {
				url:'/userhome',
				templateUrl: 'templates/userHomeTmpl.html',
				controller: 'userHomeCtrl',
				resolve: {
				// 	user: function( authService ) {
				// 		return authService.getAuth();
				// 	},
					appointments: ["appointmentsService", function( appointmentsService ) {
						var today = new Date();
						return appointmentsService.getDayAppointments(today);
					}]
				}
			})
			.state('newPatient', {
				url:'/newpatient',
				templateUrl: 'templates/newPatientTmpl.html',
				controller: 'newPatientCtrl',
				// resolve: {
				// 	user: function( authService ) {
				// 		return authService.getAuth();
				// 	}
				// }
			})
			.state('searchResults', {
				url:'/searchresults',
				templateUrl: 'templates/searchResultsTmpl.html',
				controller: 'searchResultsCtrl',
				// resolve: {
				// 	user: function( authService ) {
				// 		return authService.getAuth();
				// 	}
				// }
			})
			.state('fullSchedule', {
				url:'/fullschedule',
				templateUrl: 'templates/fullScheduleTmpl.html',
				controller: 'fullScheduleCtrl',
				resolve: {
				// 	user: function( authService ) {
				// 		return authService.getAuth();
				// 	},
					// appointments: function( appointmentsService ) {
					// 	return appointmentsService.getAppointments().then(function( res ) {
					// 		return res;
					// 	});
					// }
				}
			})
			.state('patientChart', {
				url:'/patientchart/:patientid',
				templateUrl: 'templates/patientChartTmpl.html',
				controller: 'patientChartCtrl',
				resolve: {
				// 	user: function( authService ) {
				// 		return authService.getAuth();
				// 	},
					patient: ["patientService", "$stateParams", function( patientService, $stateParams ) {
						if ( $stateParams.patientid ) {
							return patientService.getOnePatient( $stateParams.patientid );
						} else {
							return { data: null };
						}
					}]
				}
			})
			.state('admin', {
				url:'/admin',
				templateUrl: 'templates/adminTmpl.html',
				controller: 'adminCtrl',
				resolve: {
					userList: ["userService", function( userService ) {
						return userService.getUsers();
					}],
					user: ["authService", function( authService ) {
						return authService.getAdminAuth();
					}]
				}
			})

			$urlRouterProvider.otherwise('/');
			
}]);

angular.module('EMRapp')
.controller('adminCtrl', ["$scope", "userService", "userList", function( $scope, userService, userList ) {
	
	$scope.permissions = {
		  insuranceInfo: false
		, visitNotes: false
		, patientGoals: false
	}

	$scope.addNewUser = function() {
		$scope.user.pemissions = $scope.permissions;
		userService.addNewUser($scope.user);
	}

	$scope.getUsers = function() {
		userService.getUsers();
	}

	$scope.users = userList.data;
	
}]);
angular.module('EMRapp')
.controller('fullScheduleCtrl', ["$scope", "$state", "patientService", "$timeout", "$q", "$log", "appointmentsService", function( $scope, $state, patientService, $timeout, $q, $log, appointmentsService ) {
	
	var self = this;
    self.simulateQuery = false;
    self.isDisabled    = false;
    // self.repos         = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    loadAll().then(function( patients ) {

    	  self.repos = patients;
    });

    function querySearch (query) {
      	var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
        	deferred;

        return results;
    }
    
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    // Build `components` list of key/value pairs
    function loadAll() {
    	  var deferred = $q.defer();
	   	  var patients;

	   	  patientService.getPatients().then(function( result ) {
	   		
	   		var repos = result.data;
	   		patients = repos.map( function (repo) {
	        	repo.value = repo.firstName.toLowerCase();
	        	return repo;
	      })
	      deferred.resolve(patients);

	   	}).catch(function( err ) {
	   		return console.error(err);
	   	})

	   	return deferred.promise;
    }

    // Create filter function for a query string
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
        };
    }

    $scope.times = [
    	{
    		  display: '8:00 AM'
    		, value: 8
    	},
    	{
    		  display: '8:30 AM'
    		, value: 8.5
    	},
    	{
    		  display: '9:00 AM'
    		, value: 9
    	},
    	{
    		  display: '9:30 AM'
    		, value: 9.5
    	},
    	{
    		  display: '10:00 AM'
    		, value: 10
    	},
    	{
    		  display: '10:30 AM'
    		, value: 10.5
    	},
    	{
    		  display: '11:00 AM'
    		, value: 11
    	},
    	{
    		  display: '11:30 AM'
    		, value: 11.5
    	},
    	{
    		  display: '12:00 PM'
    		, value: 12
    	},
    	{
    		  display: '12:30 PM'
    		, value: 12.5
    	},
    	{
    		  display: '1:00 PM'
    		, value: 13
    	},
    	{
    		  display: '1:30 PM'
    		, value: 13.5
    	},
    	{
    		  display: '2:00 PM'
    		, value: 14
    	},
    	{
    		  display: '2:30 PM'
    		, value: 14.5
    	},
    	{
    		  display: '3:00 PM'
    		, value: 15
    	},
    	{
    		  display: '3:30 PM'
    		, value: 15.5
    	},
    	{
    		  display: '4:00 PM'
    		, value: 16
    	},
    	{
    		  display: '4:30 PM'
    		, value: 16.5
    	},
    	{
    		  display: '5:00 PM'
    		, value: 17
    	},
    	{
    		  display: '5:30 PM'
    		, value: 17.5
    	},
    	{
    		  display: '6:00 PM'
    		, value: 18
    	},
    	{
    		  display: '6:30 PM'
    		, value: 18.5
    	},
    	{
    		  display: '7:00 PM'
    		, value: 19
    	},
    	{
    		  display: '7:30 PM'
    		, value: 19.5
    	},
    	{
    		  display: '8:00 PM'
    		, value: 20
    	},
    ];

    

    $scope.addNewAppointment = function() {
    	$scope.appointment.patient = self.selectedItem._id;
		appointmentsService.addNewAppointment($scope.appointment);
	}


}]);





angular.module('EMRapp')
	.controller('homeCtrl', ["$scope", "authService", function( $scope, authService ) {
	
	$scope.login = function() {
		authService.login($scope.user);
	}

}]);
angular.module('EMRapp')
.controller('navBarCtrl', ["$scope", "$state", "patientService", "$timeout", "$q", "$log", "$mdDialog", "authService", function( $scope, $state, patientService, $timeout, $q, $log, $mdDialog, authService ) {
	
    var self = this;
    self.simulateQuery = false;
    self.isDisabled    = false;
    // self.repos         = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    loadAll().then(function( patients ) {
    	  self.repos = patients;
    });

    function querySearch (query) {
      	var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
        	deferred;

        return results;
    }
    
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    // Build `components` list of key/value pairs
    function loadAll() {
    	  var deferred = $q.defer();
	   	  var patients;

	   	  patientService.getPatients().then(function( result ) {
	   		
	   		var repos = result.data;
	   		patients = repos.map( function (repo) {
	        	repo.value = repo.firstName.toLowerCase();
	        	return repo;
	      })
	      deferred.resolve(patients);

	   	}).catch(function( err ) {
	   		return console.error(err);
	   	})

	   	return deferred.promise;
    }

    // Create filter function for a query string
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
        };
    }
  
    // Menu Stuff
    var originatorEv;
    self.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    $scope.redirect = function( state ) {
        $state.go( state );
    }

    $scope.currentUser = authService.currentUser();

    self.patientChartRedirect = function() {
        $state.go( 'patientChart', { patientid: self.selectedItem._id } )
    }



}]);




























angular.module('EMRapp')
.controller('newPatientCtrl', ["$scope", "patientService", function( $scope, patientService ) {
	
	$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
					'October', 'November', 'December'];
	$scope.years = [1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 
					1984, 1985, 1986, 1987, 1988, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 
					1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 
					2013, 2014, 2015].reverse();
	$scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 
					'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 
					'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 
					'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
	$scope.genders = ['Female', 'Male'];
	$scope.conditions = {
		  seasonalAllergies: false	
		, anemia: false				
		, tensionHeadaches: false	
		, osteoarthritis: false		
		, asthma: false		
		, positiveTBTest: false		
		, GIBleed: false			
		, anxiety: false 		
		, emphsemaCOPD: false		
		, atrialFibrillation: false
		, migraines: false
		, stomachUlcer: false
		, rheumatoidArthritis: false
		, ADDADHD: false
		, GERD: false
		, acne: false
		, depression: false
		, glaucoma: false
		, cataracts: false
		, gout: false
		, diabetes: false
		, eczema: false
		, psoriasis: false
		, hearingLoss: false
		, seizureDisorder: false
		, hypothyroidism: false
		, hyperthyroidism: false	
		, visionLoss: false
		, other: {
			  checked: false
			, condition: ''
		}
	};

	$scope.addNewPatient = function() {
		$scope.patient.conditions = $scope.conditions;
		$scope.patient.insuranceInfo =[$scope.insuranceInfo];
		patientService.addNewPatient($scope.patient);
	}

}]);
angular.module('EMRapp')
.controller('patientChartCtrl', ["$scope", "patient", function( $scope, patient ) {
	
	$scope.patient = patient.data;

}]);

angular.module('EMRapp')
.controller('userHomeCtrl', ["$scope", "appointments", "appointmentsService", function( $scope, appointments, appointmentsService ) {

    $scope.times = ['7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00'];

	$scope.appointments = appointments.data;

	$scope.getDayAppointments = function( date ) {
		appointmentsService.getDayAppointments(date).then(function( appointments ) {
			$scope.appointments = appointments.data;
		});
	} 
}]);
angular.module('EMRapp').directive('calendarDir', function() {
	return {
		  restrict: 'E'
		, templateUrl: 'templates/calendarTmpl.html'
		, scope: {
			  appointment: '='
			, index: '='
		}
		, controller: ["$scope", function( $scope ) {
			// $scope.getHeight: function() {
			// 	return (( $scope.appointment.endTime - $scope.appointment.startTime ) * 80 ) + 'px';
			// }

			// $scope.getTop: function() {
			// 	return (( $scope.appointment.startTime * 15) + $scope.getHeight() ) + 'px';
			// }
			$scope.height = (( $scope.appointment.endTime - $scope.appointment.startTime ) * 80 );

			$scope.top = 0;
				for (var i = 7; i <= $scope.appointment.startTime; i += 0.5) {
				$scope.top += 40
			}
			// $scope.top = (( $scope.appointment.startTime * 40) + $scope.height - 80);

		// 	switch( $scope.appointment.startTime ) {
		// 		case 7:
		// 			$scope.top = 0; 
		// 			break;
		// 		case 7.5:
		// 			$scope.top = 40; 
		// 			break;
		// 		case 8:
		// 			$scope.top = 80; 
		// 			break;
		// 		case 8.5:
		// 			$scope.top = 120; 
		// 			break;
		// 		case 9:
		// 			$scope.top = 160; 
		// 			break;
		// 		case 9.5:
		// 			$scope.top = 200; 
		// 			break;
		// 		case 10:
		// 			$scope.top = 240; 
		// 			break;
		// 		case 10.5:
		// 			$scope.top = 280; 
		// 			break;
		// 		case 11:
		// 			$scope.top = 320; 
		// 			break;
		// 		case 11.5:
		// 			$scope.top = 360; 
		// 			break;
		// 		case 12:
		// 			$scope.top = 400; 
		// 			break;
		// 		case 12.5:
		// 			$scope.top = 440; 
		// 			break;
		// 		case 13:
		// 			$scope.top = 480; 
		// 			break;
		// 		case 13.5:
		// 			$scope.top = 520; 
		// 			break;
		// 		case 14:
		// 			$scope.top = 560; 
		// 			break;
		// 		case 14.5:
		// 			$scope.top = 600; 
		// 			break;
		// 		case 15:
		// 			$scope.top = 640; 
		// 			break;
		// 		case 15.5:
		// 			$scope.top = 680; 
		// 			break;
		// 		case 16:
		// 			$scope.top = 720; 
		// 			break;
		// 		case 16.5:
		// 			$scope.top = 760; 
		// 			break;
		// 		case 17:
		// 			$scope.top = 800; 
		// 			break;
		// 		case 17.5:
		// 			$scope.top = 840; 
		// 			break;
		// 		case 18:
		// 			$scope.top = 880; 
		// 			break;
		// 		case 18.5:
		// 			$scope.top = 920; 
		// 			break;
		// 		case 19:
		// 			$scope.top = 960; 
		// 			break;
		// 		case 19.5:
		// 			$scope.top = 1000; 
		// 			break;
		// 		case 20:
		// 			$scope.top = 1040; 
		// 			break;
		// 	}
		// }
		// , link: function(scope, element, attrs) {
		// 	var duration = scope.appointment.endTime - scope.appointment.startTime;
		// 	var thisDiv = element.find('div');
		// 	$(thisDiv).css('height', function() {
		// 		return duration * 80;
		// 	});
			// element.css('height', (duration * 80) + 'px');
			// $('#appointment' + scope.index).css('top', (scope.appointment.startTime * 31).toString() + 'px');
			// $('#appointment' + scope.index).css('background-color', 'blue');
		}]
	}
});
angular.module('EMRapp').directive('navbarDir', function() {
		return {
			  restrict: 'E'
			, templateUrl: 'templates/navBarTmpl.html'
			, controller: 'navBarCtrl'
		}
});
angular.module('EMRapp')
.service('appointmentsService', ["$http", "$state", function( $http, $state ) {

	this.addNewAppointment = function( appointment ) {
		
		$http.post('/api/appointment', appointment).then(function( data, err ) {
			if (err) {
				return alert('Server Error, Appointment not Saved');
			}
			
			if (data) {
				$state.go('fullSchedule', {}, {reload: true});
			}
		});

	};

	this.getAppointments = function() {
		return $http.get('/api/appointments').success(function( response ) {
			return response.data;
		}).catch(function( err ) {
			return console.error( err );
		});
	}

	this.getDayAppointments = function( date ) {
		date.setHours(0, 0, 0, 0);

		return $http.get('api/dayappointments?day=' + date);

	}

}]);
angular.module('EMRapp')
.service('authService', ["$http", "$state", function( $http, $state ) {

	var currentUser;

	this.getAuth = function() {
		return $http.get('/api/auth').success(function(user) {
			currentUser = user;
			return user;
		}).error(function(err) {
			$state.go('home')
		});
	};

	this.getAdminAuth = function() {
		return $http.get('/api/adminauth').success(function(user) {
			currentUser = user;
			return user;
		}).error(function(err) {
			$state.go('home');
		});
	};

	this.login = function( user ) {
		return $http.post('/api/login', user).success(function(user) {
			currentUser = user;
			if (user.admin) {
				$state.go('admin');
			} else {
			$state.go('userHome');
			}
		});
	}

	this.currentUser = function() {
		return currentUser;
	}
	
}]);
angular.module('EMRapp')
.service('patientService', ["$state", "$http", function( $state, $http ) {

	this.addNewPatient = function( patient ) {
		
		$http.post('/api/patient', patient).then(function( data, err ) {
			if (err) {
				return alert('Server Error, Patient not Saved');
			}
			
			if (data) {
				$state.go('userHome');
			}
		});

	};

	this.getOnePatient = function( patientid ) {

		return $http.get('api/patient?id=' + patientid);
		
	};

	this.getPatients = function() {

		return $http.get('/api/patients');
	
	};

}]);
angular.module('EMRapp')
.service('userService', ["$http", "$state", function( $http, $state ) {

	this.addNewUser = function( user ) {
		
		$http.post('/api/signup', user).then(function( data, err ) {
			if (err) {
				return alert('Server Error, User not Saved');
			}
			
			if (data) {
				$state.go('admin', {}, {reload: true});
			}
		});

	};
	
	this.getUsers = function() {

		return $http.get('/api/users');

	};

}]);