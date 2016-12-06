angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.login', {
    url: '/page5',
    views: {
      'tab1': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('tabsController.signup', {
    url: '/page6',
    views: {
      'tab3': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('map', {
      url: '/page7',
      templateUrl: 'templates/map.html',
      controller: 'MapCtrl'
    })
    .state('addContact', {
        url: '/newContact',
        templateUrl: 'templates/addContact.html',
        controller: 'ContactCtrl'
      })

      .state('fab', {
          url: '/fab',
          templateUrl: 'templates/firstAid.html',
          controller: 'fabCtrl'
        })

        .state('fab1', {
            url: '/fab1',
            templateUrl: 'templates/fab1.html',
            controller: 'fabCtrl'
          })
          .state('fab2', {
              url: '/fab2',
              templateUrl: 'templates/fab2.html',
              controller: 'fabCtrl'
            })
            .state('fab3', {
                url: '/fab3',
                templateUrl: 'templates/fab3.html',
                controller: 'fabCtrl'
              })
              .state('fab4', {
                  url: '/fab4',
                  templateUrl: 'templates/fab4.html',
                  controller: 'fabCtrl'
                })
                .state('fab5', {
                    url: '/fab5',
                    templateUrl: 'templates/fab5.html',
                    controller: 'fabCtrl'
                  })
                  .state('fab6', {
                      url: '/fab6',
                      templateUrl: 'templates/fab6.html',
                      controller: 'fabCtrl'
                    })
                    .state('fab7', {
                        url: '/fab7',
                        templateUrl: 'templates/fab7.html',
                        controller: 'fabCtrl'
                      })
                      .state('fab8', {
                          url: '/fab8',
                          templateUrl: 'templates/fab8.html',
                          controller: 'fabCtrl'
                        })
                        .state('fab9', {
                            url: '/fab9',
                            templateUrl: 'templates/fab9.html',
                            controller: 'fabCtrl'
                          })
                          .state('fab10', {
                              url: '/fab10',
                              templateUrl: 'templates/fab10.html',
                              controller: 'fabCtrl'
                            })


  .state('tabsController.forgotPassword', {
    url: '/page15',
    views: {
      'tab1': {
        templateUrl: 'templates/forgotPassword.html',
        controller: 'forgotPasswordCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/page5')



});
