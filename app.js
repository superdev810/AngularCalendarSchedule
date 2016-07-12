// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core','froala','starter.controllers', 'starter.services', 'ionic.service.push', 'ionic-multi-date-picker'])

.run(function($ionicPlatform, $rootScope, $ionicTabsDelegate) {
  $ionicPlatform.ready(function() {
    $rootScope.devicetoken = "Invalid Token";

    $rootScope.msgCount = 0;
    $rootScope.notificationCount = 0;
    $rootScope.push = new Ionic.Push({
      "debug": false,
      "pluginConfig": {
        "android": {

        },
        "ios":{
          "badge": true,
          "sound": true,
          "badgeClear": true
        }
      },
      "onRegister": function(token){
        //console.log("Got Token:", token.token);
        $rootScope.devicetoken = token.token;

      },
      "onNotification": function(notification) {
        //alert('Received push notification!');
        var payload = notification.payload;
        $rootScope.msgCount = payload.msgcount;
        $rootScope.notificationCount = payload.noticount;
        var active = $ionicTabsDelegate.selectedIndex();
        if(active != -1)
        	$ionicTabsDelegate.select(active);
      }
    });
    $rootScope.push.register(function(token) {
        $rootScope.devicetoken = token.token;
    });

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

//.run(function(NotificationService){})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
   $ionicConfigProvider.backButton.previousTitleText(false);
   $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left');

   $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tab.forum', {
      url: '/forum',
      views: {
        'tab-forum' : {
          templateUrl: 'templates/tab-forum.html',
          controller: 'ForumCtrl'
        }
      }
    })

    .state('tab.category', {
        url:'/category/:category_id/:category_name',
        views:{
            'tab-forum':{
                templateUrl: 'templates/tab-category.html',
                controller: 'CategoryCtrl'
            }
        }
    })
    .state('tab.newthread', {
        url:'/newthread/:category_id',
        views:{
            'tab-forum':{
                templateUrl: 'templates/tab-newthread.html',
                controller: 'NewThreadCtrl'
            }
        }
    })
    .state('tab.search', {
        url:'/search/:keyword',
        views:{
            'tab-forum':{
                templateUrl: 'templates/tab-search.html',
                controller: 'SearchCtrl'
            }
        }
    })
    .state('tab.inbox', {
      url: '/inbox',
      views: {
        'tab-inbox' : {
          templateUrl: 'templates/tab-inbox.html',
          controller: 'InboxCtrl'
        }
      }
    })
    .state('tab.conversation',{
        url:"/conversation/:conversation_id",
        views:{
            'tab-inbox':{
                templateUrl: 'templates/tab-conversation.html',
                controller: 'ConversationCtrl'
            }
        }
    })
    .state('tab.newmessage',{
        url:"/newmessage/:receiver",
        views:{
            'tab-inbox':{
                templateUrl: 'templates/tab-newmessage.html',
                controller: 'NewMessageCtrl'
            }
        }
    })
    .state('tab.profile', {
      url: '/profile/:username',
      views: {
        'tab-profile' : {
          templateUrl: 'templates/tab-profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('tab.notifications', {
      url: '/notifications',
      views: {
        'tab-notifications' : {
          templateUrl: 'templates/tab-notifications.html',
          controller: 'NotificationsCtrl'
        }
      }
    })
    .state('tab.preferences', {
      url: '/preferences',
      views: {
        'tab-preferences' : {
          templateUrl: 'templates/tab-preferences.html',
          controller: 'PreferencesCtrl'
        }
      }
    })
	.state('tab.thread', {
        url:'/thread/:thread_id',
        views:{
            'tab-forum':{
                templateUrl: 'templates/tab-thread.html',
                controller: 'ThreadCtrl'
            }
        }
    })
    
   .state('tab.event', {
     url:'/event',
     views:{
       'tab-event':{
         templateUrl: 'templates/tab-event.html',
         controller: 'EventCtrl'
       }
     }
   });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})
.value('froalaConfig', {
  toolbarInline: false,
  placeholderText: "Edit Your Content Here!"
})
