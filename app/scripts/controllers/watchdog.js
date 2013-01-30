'use strict';

/* Controllers */
function WatchdogCtrl($scope, socket) {
    // Socket listeners
    // ================
    var services = new Hashtable()
    $scope.services = []
    var socket = io.connect(window.location.origin + '/watch')
    socket.emit('sub', { exchange: 'bus', key: 'mis.service-state' })
    socket.on('data', function(message) {
	// replace millis with human readable time
	message.payload.time_since_last_report = millisecondsToTime(message.payload.millis_since_last_report);
	services.put(message.payload.service_id, message.payload)
	var values =  services.values().sort(function(s1, s2) {
	    var nS1 = s1.state.toLowerCase();
	    var nS2 = s2.state.toLowerCase();
	    if(nS1 < nS2)
		return -1;
	    else if(nS1 > nS2)
		return 1;
	    return 0;
	});
	
	
	$scope.services = values
	$scope.$apply()
    });
}
WatchdogCtrl.$inject = ["$scope", "socket"];
function millisecondsToTime(milliseconds){
    // TIP: to find current time in milliseconds, use:
    // var milliseconds_now = new Date().getTime();

     var seconds = milliseconds / 1000;
    var time = ""

    var num_seconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    if(num_seconds){
        time = num_seconds + ' second' + ((num_seconds > 1) ? 's' : '');
    } else {
	return 'less then a second'; //'just now' //or other string you like;
    }

    var num_minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    if(num_minutes){
        time = num_minutes + ' minute' + ((num_minutes > 1) ? 's' : '') + " " + time;
    } else {
	return time;
    }

    var num_hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    if(num_hours){
        time = num_hours + ' hour' + ((num_hours > 1) ? 's' : '') + " " + time;
    } else {
	return time;
    }

    var num_days = Math.floor((seconds % 31536000) / 86400);
    if(num_days){
        time = num_days + ' day' + ((num_days > 1) ? 's' : '') + " " + time;
    } else {
	return time;
    }

    var num_years = Math.floor(seconds / 31536000);
    if(num_years){
       return num_years + ' year' + ((num_years > 1) ? 's' : '') + " " + time
    } else {
	return time;
    }
}

