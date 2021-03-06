/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    $scope.status = '';
    $scope.data = '';
    $scope.user_id = '';
    $scope.data = '';
    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    
    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////
    $scope.signout = function(){
        window.location.replace("https://uwctransport-bdube83.c9.io/ProjectResTrans/sign_out.php");//cannot go back.
    }
    
    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };




    $scope.epochParserG = function(val, opType) {
        if (val === null) {
          return "00:00";
        } else {
          var meridian = ['AM', 'PM'];

          if (opType === 'time') {
            var hours = parseInt(val / 3600);
            var minutes = (val / 60) % 60;
            var hoursRes = hours > 12 ? (hours - 12) : hours;

            var currentMeridian = meridian[parseInt(hours / 12)];

            return ($scope.prependZero(hoursRes) + ":" + $scope.prependZero(minutes) + " " + currentMeridian);
          }
        }
    };

    $scope.prependZero = function(param) {
        if (String(param).length < 2) {
          return "0" + String(param);
        }
        return param;
    };

    $scope.getDateParse = function(date){
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!

        var yyyy = date.getFullYear();
        if(dd<10) {
            dd = '0'+dd;
        } 
        if(mm<10) {
            mm =    '0'+mm;
        } 
        var date = mm+'/'+dd+'/'+yyyy;
        return date;
    };


    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})


.controller('LoginCtrl', function($scope, $timeout, $http, $state, $stateParams, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.login = {email : '',
                    password : ''};

    $scope.fetch = function() {
        $scope.code = null;
        $scope.response = null;

        var querystring = "email="+$scope.login.email+
                            "&pass="+$scope.login.password;

        $timeout(function() {
            $http({ 
                    method: 'POST', 
                    url: 'https://uwctransport-bdube83.c9.io/ProjectResTrans/login.php', 
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data : querystring
                }).
              success(function(data, status) {
                $scope.$parent.status = status;
                $scope.$parent.data = data;
                if(data.report == 'true'){
                    $scope.$parent.user_id = data.user_id;
                    console.log(data);
                    $state.go('app.booking');
                } else {
                    $scope.$parent.data = 'Oops! wrong password.. Please try agian.';
                    $state.go('app.login');

                }
              }).
              error(function(data, status) {
                $scope.$parent.data = data || "Request failed";
                $scope.$parent.status = status;
            });
        }, 1000).then(function(report) {
                  console.log('Success: ' + report);
                }, function(report) {
                  alert('Oops! Something went wrong, please check your network settings and try again: ');
                  console.log('Fail: ' + report);
                });;
    };
})

.controller('BookingCtrl', function($scope, sharedProperties, $ionicPlatform, ionicMaterialMotion, $cordovaDatePicker, $timeout, $state, $http, $stateParams, $ionicLoading, ionicMaterialInk) {
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }
    $scope.$parent.user_id = getCookie('user_id');
    if(!$scope.$parent.user_id) {
            window.location.replace("https://uwctransport-bdube83.c9.io/ProjectResTrans/index.html");//cannot go back.
    }
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();

    var date = new Date();
    $scope.day = {start: date, title1: "Booking start time:", end: date, title2: "Booking end time"};

    $scope.slots = {epochTime1: 46800, epochTime2: 50400, format: 24, step: 15};

    $scope.nativeTime = function() {
        var options = {
            date: new Date(),
            mode: 'time', // or 'time'
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };

        $ionicPlatform.ready(function() {
            try{
                $cordovaDatePicker
                .show(options)
                .then(function(date){
                    alert(date);
                }, function(error) {
                    alert(error);
                });
            }
            catch(e){
                console.log("Not native device for time.");
            }
        });
    }   

    $scope.nativeDate = function() {
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };

        $ionicPlatform.ready(function() {
            try{
                $cordovaDatePicker
                .show(options)
                .then(function(date){
                    alert(date);
                }, function(error) {
                    alert(error);
                });
            }
            catch(e){
                console.log("Not native device date.");
            }
        });
    }       


    $scope.datePickerCallback = function (val) {
        $scope.day.end = val;
        $scope.day.start = val;
        if(typeof(val) === 'undefined'){      
            console.log('Date not selected');
        } else {
            console.log('Selected date is : ', val);
        }
    };

    $scope.timePickerCallback = function (val) {
            $scope.slots.epochTime1 = val;
            $scope.slots.epochTime2 = val+3600;

            
        if (typeof (val) === 'undefined') {
            console.log('Time not selected');
        } else {
                console.log('Selected epoch time is : ', $scope.$parent.epochParserG(val, 'time'));    // `val` will contain the selected time in epoch
                console.log('Selected time is : ', $scope.$parent.epochParserG($scope.slots.epochTime1 , 'time')); 
                console.log('Selected time2 is : ', $scope.$parent.epochParserG($scope.slots.epochTime2 , 'time')); 
            }
    };
    
      $scope.timePickerCallback2 = function (val) {
            $scope.slots.epochTime1 = val-3600;
            $scope.slots.epochTime2 = val;

            
        if (typeof (val) === 'undefined') {
            console.log('Time not selected');
        } else {
                console.log('Selected epoch time is : ', $scope.$parent.epochParserG(val, 'time'));    // `val` will contain the selected time in epoch
                console.log('Selected time is : ', $scope.$parent.epochParserG($scope.slots.epochTime1 , 'time')); 
                console.log('Selected time2 is : ', $scope.$parent.epochParserG($scope.slots.epochTime2 , 'time')); 
            }
    };
    


    $scope.fetch = function() {
        if(!$scope.$parent.user_id) {
            window.location.replace("https://uwctransport-bdube83.c9.io/ProjectResTrans/index.html");//cannot go back.
        }

        $scope.code = null;
        $scope.response = null;
        var startDay =  $scope.$parent.getDateParse($scope.day.start);
        var endDay = $scope.$parent.getDateParse($scope.day.end);

        var startTime = $scope.$parent.epochParserG($scope.slots.epochTime1 , 'time');
        var endTime = $scope.$parent.epochParserG($scope.slots.epochTime2 , 'time');
        var date = {'startDay' : startDay,
                    'startTime': startTime,
                    'endDay': endDay,
                    'endTime': endTime}
        sharedProperties.setProperty(date);
                    
        $state.go('app.booking2');
    };
})


.controller('BookingCtrl2', function($scope, $ionicPlatform, sharedProperties, ionicMaterialMotion, $cordovaDatePicker, $timeout, $state, $http, $stateParams, $ionicLoading, ionicMaterialInk) {
    var dateIn = sharedProperties.getProperty();
    console.log(dateIn);   
    if(!dateIn || dateIn == null){
        $state.go('app.booking');
        return;
    }
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.travelDetails = {depart: '', travel: '', message: ''}

    $scope.fetch = function() {
        if(!$scope.$parent.user_id) {
            window.location.replace("https://uwctransport-bdube83.c9.io/ProjectResTrans/index.html");//cannot go back.
        }
        if(!$scope.travelDetails.depart){
            $state.go('app.booking2');
            alert("Please enter departure");
            return;
        }
        if(!$scope.travelDetails.travel){
            $state.go('app.booking2');
            alert("Please enter destination");
            return;
        }        
        if(!$scope.travelDetails.message){
            $state.go('app.booking2');
            alert("Please enter message description");
            return;
        }
        
        $scope.code = null;
        $scope.response = null;
        var message = $scope.travelDetails.message.replace(/"/g, '');
        message = $scope.travelDetails.message.replace(/'/g, '');
        
        var depart = $scope.travelDetails.depart.replace(/"/g, '');
        depart = $scope.travelDetails.depart.replace(/'/g, '');

        var travel = $scope.travelDetails.travel.replace(/"/g, '');
        travel = $scope.travelDetails.travel.replace(/'/g, '');
        
        var querystring =   "start_time="+dateIn.startDay+" "+dateIn.startTime+
                            "&end_time="+dateIn.endDay+" "+dateIn.endTime+
                            "&depart="+depart+
                            "&travel="+travel+
                            "&user_id="+$scope.$parent.user_id+
                            "&message="+message;

        console.log(querystring);   
        
        $http({ 
                method: 'POST', 
                url: 'https://uwctransport-bdube83.c9.io/ProjectResTrans/booking_google.php', 
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                data : querystring,
                timeout : 40000 
            }).
          success(function(data, status) {
            if(data.testing == 'success') {
                sharedProperties.setProperty(data);
                $state.go('app.bookingSuccess');
            }else if(data.report){
                alert(data.report);
            }else if(data.check_available){
                alert(data.check_available);
                $state.go('app.booking');
                return;
            }else {
                alert('Oops! Something went wrong please contact booking@uwctransport.freeiz.com for help.')
            }
            console.log(status);
            console.log(data);
            //$state.go('app.booking');
          }).
          error(function(data, status) {
            alert(data || "Please re-book");
            console.log(status);
            $state.go('app.booking');
        });
    };
})


.controller('BookingSuccessCtrl', function($scope, $state, sharedProperties, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    var event = sharedProperties.getProperty();
    if(!event){
        $state.go('app.booking');
    }
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();
    $scope.travelDetails = {driver : '',
                    location : '',
                    date: ''};
    // Set Ink
    ionicMaterialInk.displayEffect();
    if(event) {
        /*$scope.travelDetails.driver = event.eventID.attendees[0].email;
        $scope.travelDetails.location = event.eventID.location;
        $scope.travelDetails.date = event.eventID.start.dateTime;*/
        
        /*$scope.travelDetails.driver= $stateParams.response_booking.eventID.attendees[0].email;
        $scope.travelDetails.location = $stateParams.response_booking.eventID.location;
        $scope.travelDetails.date = $stateParams.response_booking.eventID.location;*/
    }

})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.service('sharedProperties', function () {
    var property = "";

    return {
        getProperty: function () {
            return property;
        },
        setProperty: function(value) {
            property = value;
        }
    };
});