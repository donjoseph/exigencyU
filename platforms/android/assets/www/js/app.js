// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','app.routes', 'app.services', 'app.directives','firebase','ngCordova','ng-mfb'])
.config(function($ionicConfigProvider) {
    //Added config
    //$ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
})
.run(function($ionicPlatform,$rootScope) {

    $rootScope.extras = false;

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.controller('loginCtrl', function($scope,$rootScope,$ionicHistory,sharedUtils,$state,$ionicSideMenuDelegate) {
    $rootScope.extras = false;  // For hiding the side bar and nav icon

    // When the user logs out and reaches login page,
    // we clear all the history and cache to prevent back link
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
    });

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
        $rootScope.extras = true;
        sharedUtils.hideLoading();
        $state.go('map', {}, {location: "replace"});

      }
    });


    $scope.loginEmail = function(formName,cred) {


      if(formName.$valid) {  // Check if the form data is valid or not

          sharedUtils.showLoading();

          //Email
          firebase.auth().signInWithEmailAndPassword(cred.email,cred.password).then(function(result) {

                // You dont need to save the users session as firebase handles it
                // You only need to :
                // 1. clear the login page history from the history stack so that you cant come back
                // 2. Set rootScope.extra;
                // 3. Turn off the loading
                // 4. Got to menu page

              $ionicHistory.nextViewOptions({
                historyRoot: true
              });
              $rootScope.extras = true;
              sharedUtils.hideLoading();
              $state.go('map', {}, {location: "replace"});

            },
            function(error) {
              sharedUtils.hideLoading();
              sharedUtils.showAlert("Please note","Authentication Error");
            }
        );

      }else{
        sharedUtils.showAlert("Please note","Entered data is not valid");
      }



    };


    $scope.loginFb = function(){
      //Facebook Login
    };

    $scope.loginGmail = function(){
      //Gmail Login
    };


})

.controller('signupCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,
                                   $state,fireBaseData,$ionicHistory) {
    $rootScope.extras = false; // For hiding the side bar and nav icon

    $scope.signupEmail = function (formName, cred) {

      if (formName.$valid) {  // Check if the form data is valid or not

        sharedUtils.showLoading();

        //Main Firebase Authentication part
        firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function (result) {

            //Add name and default dp to the Autherisation table
            result.updateProfile({
              displayName: cred.name,
              photoURL: "default_dp"
            }).then(function() {}, function(error) {});

            //Add phone number to the user table
            fireBaseData.refUser().child(result.uid).set({
              telephone: cred.phone
            });

            //Registered OK
            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
            $rootScope.extras = true;
            sharedUtils.hideLoading();
            $state.go('map', {}, {location: "replace"});

        }, function (error) {
            sharedUtils.hideLoading();
            sharedUtils.showAlert("Please note","Sign up Error");
        });

      }else{
        sharedUtils.showAlert("Please note","Entered data is not valid");
      }

    }

  })

.controller('indexCtrl', function($scope,$rootScope,sharedUtils,$ionicHistory,$state,$ionicSideMenuDelegate) {

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user_info=user; //Saves data to user_info

        //Only when the user is logged in, the cart qty is shown
        //Else it will show unwanted console error till we get the user object

      }else {

        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {location: "replace"});

      }
    });

    $scope.logout=function(){

      sharedUtils.showLoading();

      // Main Firebase logout
      firebase.auth().signOut().then(function() {


        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });


        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {location: "replace"});

      }, function(error) {
         sharedUtils.showAlert("Error","Logout Failed")
      });

    }

  })


.controller('forgotPasswordCtrl', function($scope,$rootScope) {
    $rootScope.extras=false;
  })

  .controller('ContactCtrl', function($scope,$http,$rootScope,$state,sharedUtils,fireBaseData,$ionicPopup,$firebaseArray) {

    var  curuser = firebase.auth().currentUser.displayName;
    var allusers=[];
    var allnumbers=[];


    firebase.database().ref('Contacts/details/'+curuser).once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          // key will be "ada" the first time and "alan" the second tim
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          allusers.push("name: "+childData.Contactname+"  number: "+childData.ContactNumber);
      });
    });

    $scope.contacts=allusers;
    console.log(allusers);

      $scope.goHome= function () {
        //console.log("came in contact here")
        $state.go("map");
      }
      //----------------

    $scope.addtoDB= function (formName,user) {

   if (formName.$valid) {

     var phone=user.phone;
     var name=user.name;

     var  useremail = firebase.auth().currentUser.email;
     var  user = firebase.auth().currentUser.displayName;
     var a;
     firebase.database().ref('Contacts/details/'+user).once("value", function(snapshot) {
     a = snapshot.numChildren();
     if(a<5){
       firebase.database().ref('Contacts/details/'+user+'/'+phone).set({
         ContactNumber: phone,
         Contactname: name,
         userEmail : useremail
       });

       var alertPopup = $ionicPopup.alert({
         title: 'Added Succesfully',
         template: 'New contact added successfully'
       });

       alertPopup.then(function(res) {
       });
     }
     else {
       {
         var alertPopup = $ionicPopup.alert({
           title: 'Maximum five contacts only allowed',
           template: 'Please delete existing contacts and try again'
         });

         alertPopup.then(function(res) {
         });
       }
     }

   });





   } else {
     var alertPopup = $ionicPopup.alert({
       title: 'Required fields are missing',
       template: 'Please fill the required fields'
     });

     alertPopup.then(function(res) {
     });
   }
  }

  //----newdis
      //--------------------
      })


  .controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading, $cordovaSms,$ionicPopup) {
    var options = {timeout: 10000, enableHighAccuracy: true};
    $scope.name = 'World';
    $scope.menuState = 'closed';
  //sujeet
    var marker = [];
    var infowindow = new google.maps.InfoWindow({size: new google.maps.Size(150,50)});
    var services;
    var request;
    var map,latLng;
    var pos1 = {lat:0,lng:0};
    var markers = [];
    var autocomplete;
    var hospital_details =[];
    var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
    var hostnameRegexp = new RegExp('^https?://.+?/');

    //comment when using ionic serve
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring your location!'
        });

    $cordovaGeolocation.getCurrentPosition(options).then(function(position)
    {

       latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //var latLng = new google.maps.LatLng(12.8379176,77.6390923);
      var mapOptions = {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){

          marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });

       infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });


      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);

      });
      $ionicLoading.hide();
      search();
    });


  //===========search places start==============
  services = new google.maps.places.PlacesService($scope.map);
  function search() {

    var search = {
      bounds: $scope.map.getBounds(),
      types: ['hospital']
    };

    services.nearbySearch(search, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
       clearResults();
       clearMarkers();
        // Create a marker for each hotel found, and
        // assign a letter of the alphabetic to each marker icon.


        for (var i = 0; i < results.length; i++) {
          var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
          var markerIcon = MARKER_PATH + markerLetter + '.png';

          // Use marker animation to drop the icons incrementally on the map.
          markers[i] = new google.maps.Marker({
            position: results[i].geometry.location,
            animation: google.maps.Animation.DROP,
            icon: markerIcon
          });
          // If the user clicks a hotel marker, show the details of that hotel
          // in an info window.
          markers[i].placeResult = results[i];
  //console.log(results[i]);
          services.getDetails({placeId: markers[i].placeResult.place_id},
              function(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  hospital_details.hospital_name = place.name;
                  hospital_details.hospital_phone = place.formatted_phone_number;
                  //console.log(hospital_details);

                }

          });

          google.maps.event.addListener(markers[i], 'click', showInfoWindow);
          setTimeout(dropMarker(i), i * 100);
        }
      }
    });
  }


  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }
    markers = [];
  }

  function dropMarker(i) {
    return function() {
      markers[i].setMap($scope.map);
    };
  }


  function clearResults() {
    var results = document.getElementById('results');
    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }
  }

  $scope.gotoContacts= function () {
    console.log("came here")
    $state.go("addContact");
  }

  $scope.gotofab= function () {
    console.log("came here")
    $state.go("fab");
  }
  // Get the place details for a hotel. Show the information in an info window,
  // anchored on the marker for the hotel that the user selected.
  function showInfoWindow() {
    var marker = this;
    services.getDetails({placeId: marker.placeResult.place_id},
        function(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            var contentStr = '<h5>'+place.name+'</h5><p>'+place.vicinity;
            if (!!place.formatted_phone_number) contentStr += '<br>'+place.formatted_phone_number;
            infowindow.setContent(contentStr);
            infowindow.open($scope.map,marker);
          }
          else {
          var contentStr = "<h5>No Result, status="+status+"</h5>";
          infowindow.setContent(contentStr);
          infowindow.open($scope.map,marker);
        }
    });
  }

  //==========serch places end=================

    }, function(error){
      console.log("Could not get location");
    });

  //console.log("before clicked send sms");
  //send sms function
    $scope.sendsms = function() {
      var flag=0;
      var allcontacts;
      var  curuser = firebase.auth().currentUser.displayName;
      firebase.database().ref('Contacts/details/'+curuser).once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            // key will be "ada" the first time and "alan" the second tim
            // childData will be the actual contents of the child
            var childData = childSnapshot.val();
            allcontacts=childData.ContactNumber;
            console.log(childData.ContactNumber);

            var msg = "Please help me. Need emergency assistance. My Current location is https://www.google.co.in/maps/@" + latLng;
            console.log(msg);
            console.log("contact:"+allcontacts);

            var options = {
              replaceLineBreaks: false, // true to replace \n by a new line, false by default
              android: {
                intent: '' // send SMS with the native android SMS messaging
                  //intent: '' // send SMS without open any other app
                  //intent: 'INTENT' // send SMS inside a default SMS app
              }
            };


        $cordovaSms
          .send(allcontacts, msg , options)
          .then(function() {
            //alert('Success');
            // Success! SMS was sent
            //console.log("in sms :" +allcontacts);
          //  $scope.contactListSend=$scope.contactListSend+","+allcontacts;
          }, function(error) {
            //alert('Error');
            // An error occurred
            flag=1;
            //  console.log("in sms :" +allcontacts);
            //$scope.contactListnotSend=$scope.contactListnotSend+","+allcontacts;
          });
        });
      });

      if(flag==0){
        var alertPopup = $ionicPopup.alert({
          title: 'SOS Sent',
          template: 'SOS sent to all your emergency contacts'
        });

        alertPopup.then(function(res) {
        });
      }
      else {

        var alertPopup = $ionicPopup.alert({
          title: 'SOS has been initialized to below numbers',
          template: 'SOS initialized to your emergency contact. It may not send to all contacts because of your lower prepaid balance or server issues'
        });

        alertPopup.then(function(res) {
        });
      }

    }

  })
  .controller('fabCtrl', function($scope,$rootScope,$state) {

      $scope.goHome2= function () {
        //console.log("came in contact here")
        $state.go("map");
      }
      $scope.gofab= function () {
        //console.log("came in contact here")
        $state.go("fab");
      }
      $scope.gofab1= function () {
        //console.log("came in contact here")
        $state.go("fab1");
      }
      $scope.gofab2= function () {
        //console.log("came in contact here")
        $state.go("fab2");
      }
      $scope.gofab3= function () {
        //console.log("came in contact here")
        $state.go("fab3");
      }
      $scope.gofab4= function () {
        //console.log("came in contact here")
        $state.go("fab4");
      }
      $scope.gofab5= function () {
        //console.log("came in contact here")
        $state.go("fab5");
      }
      $scope.gofab6= function () {
        //console.log("came in contact here")
        $state.go("fab6");
      }
      $scope.gofab7= function () {
        //console.log("came in contact here")
        $state.go("fab7");
      }
      $scope.gofab8= function () {
        //console.log("came in contact here")
        $state.go("fab8");
      }
      $scope.gofab9= function () {
        //console.log("came in contact here")
        $state.go("fab9");
      }
      $scope.gofab10= function () {
        //console.log("came in contact here")
        $state.go("fab10");
      }
    })
