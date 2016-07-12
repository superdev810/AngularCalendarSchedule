var TransientKey = "";
var CategoryIcons = {};
angular.module('starter.controllers', [])

.controller('LoginCtrl',function($scope, $rootScope, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading, $window, $ionicHistory) {

  $scope.data = {};
  $scope.signup = function(){
    window.open('http://bakkersboard.com', '_system');
    $state.go('tab.forum');
  }

  $scope.login = function() {

    $rootScope.username = $scope.data.username;
    $rootScope.password = $scope.data.password;
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
		var params = {'action': 'login', 'data': {'username': $scope.data.username, 'password': $scope.data.password, 'devicetoken': $rootScope.devicetoken}};
    	$http({
			url: serverurl,
			method: "POST",
			data: $httpParamSerializerJQLike(params),
			headers: {"Content-Type": "application/x-www-form-urlencoded"}
		})
		.then(function(response) {
            $ionicLoading.hide();
			if (response.data.res == 200)
			{
				TransientKey = response.data.TransientKey;
        $window.localStorage['DeviceToken'] = $rootScope.devicetoken;
        $window.localStorage['LastUserName'] = $rootScope.username;
        $window.localStorage['LastPassword'] = $rootScope.password;
				$state.go('tab.forum');
			} else {
	            var alertPopup = $ionicPopup.alert({
	                title: 'Login failed!',
	                template: response.data.msg
	            });
	        }
		},
		function(response) { // optional
			// failed
            $ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Connection Error!'
            });
		});
    }
    //alert($window.localStorage['LastUserName']);

    if($window.localStorage['DeviceToken'] && $window.localStorage['DeviceToken'] != "")
    {
      $rootScope.devicetoken = $window.localStorage['DeviceToken'];
      $scope.data.username = $window.localStorage['LastUserName'];
      $scope.data.password = $window.localStorage['LastPassword'];
      $scope.login();
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name != 'login')
        {
        	return;
        }
        $ionicHistory.clearHistory();
    });
})




/*--------------------------------------------Forum Controller-----------------------------------------------------*/





.controller('ForumCtrl', function($scope, $ionicHistory, $rootScope, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading) {
	if(TransientKey == "")
		$state.go("login");
	$scope.data = {};
    $scope.latestThreads = [];
    $scope.rootCategory = [];
	$rootScope.categoryIcons = {};
    $scope.data = {search:""};
    $scope.search = function(){
        if($scope.data.search == "" || $scope.data.search == " ")
            return;
        window.location.href = "#tab/search/" + $scope.data.search;
    }
	/*---------------Getting List of the latest thread---------------*/
 	$scope.getLatestThreads = function() {
 		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
        var params = {'action': 'latestthreads', 'data': {'TransientKey': TransientKey}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200)
            {
                $scope.latestThreads = response.data.content;
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) {
        	// $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: 'Connection Error',
              template: 'Please check your network!'
          });
        });
	}
	/*---------------Getting List of Categories---------------*/
	$scope.getCategoryList = function(){
		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'categorylist', 'data': {'TransientKey': TransientKey}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
        	if (response.data.res == 200)
            {
                $scope.rootCategory = response.data.content;
            } else {
                
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
	/*---------------Getting Icons of Categories---------------*/
	$scope.getCategoryIcons = function(){
		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'getcategoryicons', 'data': {'TransientKey': TransientKey}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200) {
            	var icons = [];
                icons = response.data.content;
        		CategoryIcons = {};
                angular.forEach(icons, function(value, key)
                {
                	CategoryIcons[value.CategoryID] = value.IconURL;
                });
                $rootScope.categoryIcons = CategoryIcons;
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
  $ionicHistory.clearHistory();  
    $scope.getLatestThreads();
    $scope.getCategoryList();
    $scope.getCategoryIcons();
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name != 'tab.forum')
        {
        	return;
        }
        $ionicHistory.clearHistory();
        $scope.getLatestThreads();
        $scope.getCategoryList();
        $scope.getCategoryIcons();
        $scope.data.search = "";
    });
})




/*-------------------------------------------------Category Controller--------------------------------------------*/




.controller('CategoryCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading){
    $scope.CategoryID = $stateParams.category_id;
    $scope.CategoryName = $stateParams.category_name;
    $scope.threads = [];
    $scope.getThreads = function(CatID){
		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'threads', 'data': {'TransientKey': TransientKey, 'CategoryID': CatID}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200)
            {
                $scope.threads = response.data.content;
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name != 'tab.category')
        {
        	return;
        }
        $scope.getThreads($stateParams.category_id);
    });
})
.controller('SearchCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading){

    $scope.threads = [];
    $scope.data = {search: ""};
    $scope.getSearch = function(keyword){
		$ionicLoading.show({
		    content: 'Loading',
		    animation: 'fade-in',
		    showBackdrop: true,
		    maxWidth: 200,
		    showDelay: 0
		});
		var params = {'action': 'search', 'data': {'TransientKey': TransientKey, 'SearchSTR': keyword}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();
            if (response.data.res == 200)
            {
                $scope.threads = response.data.content;

            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    $scope.search = function(){
        if($scope.data.search == "" || $scope.data.search == " ")
            return;
        $stateParams.keyword = $scope.data.search;
        $scope.getSearch($scope.data.search);
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name != 'tab.search')
        {
        	return;
        }
        $scope.data.search = $stateParams.keyword;
        $scope.getSearch($stateParams.keyword);
    });
})
/*----------------------------------------------New Thread Controller----------------------------- */
.controller('NewThreadCtrl', function($scope, $rootScope,$window , $stateParams, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading){
    $scope.discussionID = 0;
    $scope.thread ={title:"",body:""};

    $scope.postThread = function(){
        if($scope.thread.title == "")
        {
            var alertPopup = $ionicPopup.alert({
                title: 'Title is empty. Please enter the title of your post.',
                template: 'Please enter the title of your post.'
            });
            return;
        }
        if($scope.thread.body == "")
        {
            var alertPopup = $ionicPopup.alert({
                title: 'Body is empty. Please enter the body of your post.',
                template: 'Please enter the body of your post.'
            });
            return;
        }
		$ionicLoading.show({
		    content: 'Loading',
		    animation: 'fade-in',
		    showBackdrop: true,
		    maxWidth: 200,
		    showDelay: 0
		});
		var params = {'action': 'addthread', 'data': {'TransientKey': TransientKey, 'CategoryID': $stateParams.category_id, 'Title': $scope.thread.title, 'Body': $scope.thread.body}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();
            if (response.data.res == 200)
            {
                $scope.discussionID = response.data.content;
                $window.location.href = '#/tab/thread/' + $scope.discussionID.DiscussionID;
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    $scope.froalaOptions = {
      toolbarButtonsXS : [  "bold", "italic", "underline", "strikeThrough", "|",  "insertImage", "align"],
      imageUploadURL: baseurl + "uploads/editor/images/uploadimage.php",
      fileUploadURL: baseurl + "uploads/editor/files/uploadfile.php"
    };
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'tab.newthread')
        {
        	$scope.thread.title = "";
            $scope.thread.body = "";
        }

    });
})


/*--------------------------------------------------Profile Controller--------------------------------------------*/




.controller('ProfileCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading) {
    $scope.profile = {};
	$scope.viewmmember = {'visibility':'hidden'};
    $scope.viewvmember = {'visibility':'hidden'};
    $scope.viewfmember = {'visibility':'hidden'};
    $scope.findrole = function(name, arr)
	{
		for (var i = 0; i < arr.length; i++)
			if (arr[i] == name)
				return true;
		return false;
	}
    $scope.getProfile = function(UserName){
		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'profile', 'data': {'TransientKey': TransientKey, 'Name': UserName}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200)
            {
                $scope.profile = response.data.content;
                var roles = response.data.content.UserInfo.RoleNameAll;
                if ($scope.findrole("Administrator", roles) || $scope.findrole("Moderator", roles))
                	$scope.viewmmember = {'visibility':'visible'};
                else
                	$scope.viewmmember = {'visibility':'hidden'};
                if ($scope.findrole("Verified Expert", roles))
                	$scope.viewvmember = {'visibility':'visible'};
                else
                	$scope.viewvmember = {'visibility':'hidden'};
                if ($scope.findrole("Founding Member", roles))
            		$scope.viewfmember = {'visibility':'visible'};
                else
                	$scope.viewfmember = {'visibility':'hidden'};
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}

    if($stateParams.username)
        $scope.getProfile($stateParams.username);
    else
        $scope.getProfile($rootScope.username);
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'tab.profile')
        {
            if($stateParams.username)
                $scope.getProfile($stateParams.username);
            else
                $scope.getProfile($rootScope.username);

        }
    });
})


/*---------------------------------Notification Controller-------------------------------------*/


.controller('NotificationsCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading) {

    $scope.notificationArray = [];
        $scope.msgArray = [];

    $scope.onItemClick = function(msg){
        msg.is_new = 0;
    }
    $scope.getNotifications = function(){
		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'notifications', 'data': {'TransientKey': TransientKey}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200) {
            	$scope.notificationArray = response.data.content;
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'tab.notifications')
        {
            $rootScope.notificationCount = 0;
        	$scope.getNotifications();
        }
    });
})
.controller('PreferencesCtrl', function($scope, $rootScope, $window, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading) {
    $scope.setting = {};
    $scope.eventSetting={'sync': false, 'subscribe': false} ;
    $scope.logout = function(){
      // $ionicLoading.show({
		  //   content: 'Loading',
		  //   animation: 'fade-in',
		  //   showBackdrop: true,
		  //   maxWidth: 200,
		  //   showDelay: 0
		  // });

		var params = {'action': 'logout', 'data': {'TransientKey': TransientKey }};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200)
            {
                $rootScope.username = "";
                $rootScope.password = "";
                $window.localStorage['DeviceToken'] = "";
                $window.localStorage['LastUserName'] = $rootScope.username;
                $window.localStorage['LastPassword'] = $rootScope.password;
                $state.go("login");
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
    }
    $scope.setPreferences = function(){
       
		var params = {'action': 'preferenceset', 'data': {'TransientKey': TransientKey , 'EmailConversationMessage': $scope.setting.EmailConversationMessage, 'EmailBookmarkComment': $scope.setting.EmailBookmarkComment, 'EmailParticipateComment': $scope.setting.EmailParticipateComment, 'EmailWallComment': $scope.setting.EmailWallComment, 'EmailActivityComment': $scope.setting.EmailActivityComment, 'EmailDiscussionComment': $scope.setting.EmailDiscussionComment, 'EmailMention': $scope.setting.EmailMention, 'PopupConversationMessage': $scope.setting.PopupConversationMessage, 'PopupBookmarkComment': $scope.setting.PopupBookmarkComment, 'PopupParticipateComment': $scope.setting.PopupParticipateComment, 'PopupWallComment': $scope.setting.PopupWallComment, 'PopupActivityComment': $scope.setting.PopupActivityComment, 'PopupDiscussionComment': $scope.setting.PopupDiscussionComment, 'PopupMention': $scope.setting.PopupMention}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	
            if (response.data.res == 200)
            {

            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    $scope.getPreferences = function(){
		
		var params = {'action': 'preferences', 'data': {'TransientKey': TransientKey}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	
            if (response.data.res == 200)
            {
                $scope.setting = response.data.content;
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    $scope.syncCalendar = function(){
        if($scope.eventSetting.sync)
            $scope.setEventSetting('Sync');
        else
            $scope.setEventSetting('UnSync');
    }
    $scope.subscribeCalendar = function(){
        if($scope.eventSetting.subscribe)
            $scope.setEventSetting('Subscribe');
        else
            $scope.setEventSetting('UnSubscribe');
    }
    $scope.setEventSetting = function(action){
        
		var params = {'action': 'eventsetting', 'data': {'TransientKey': TransientKey , 'useraction':action}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	
            if (response.data.res == 200)
            {
                
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    $scope.getEventSetting = function(action){
        var params = {'action': 'geteventsetting', 'data': {'TransientKey': TransientKey}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	
            if (response.data.res == 200)
            {
                $scope.eventSetting = response.data.content;
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
    }
    
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        if(toState.name == 'tab.preferences')
        {
            $scope.getPreferences();
            $scope.getEventSetting();
        }
    });
})


/*-----------------------------------Inbox Controller-----------------------------------*/


.controller('InboxCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading) {
    $scope.msgArray = [];
    $scope.onItemClick = function(msg){
        msg.is_new = 0;
    }
    $scope.getMessages = function(){
		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'inbox', 'data': {'TransientKey': TransientKey}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200) {
            	$scope.msgArray = response.data.content;
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    $scope.getMessages();
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'tab.inbox')
        {
            $rootScope.msgCount = 0;
            $scope.getMessages();
        }
    });
})
/*----------------------------------------NewMessage Controller-----------------*/
.controller('NewMessageCtrl', function($scope, $rootScope,$window , $stateParams, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading){
	$scope.msg ={receivers:"",body:""};
	$scope.receivers = new Array();
	if ($stateParams.receiver != "")
		$scope.receivers.push($stateParams.receiver);
    $scope.userlistvisible = false;
    $scope.userqueryvisible = true;
	$scope.query = {username:""};
    $scope.showlist = function() {
		$scope.userlistvisible = true;
	}
	$scope.hidelist = function() {
		$scope.userlistvisible = false;
	}
	$scope.popreceiver = function(username) {
		var tmp = new Array();
		for (var i = 0; i < $scope.receivers.length; i++)
		{
			if ($scope.receivers[i] != username)
				tmp.push($scope.receivers[i]);
		}
		$scope.receivers = tmp;
	}
	$scope.popuser = function(username) {
		var tmp = new Array();
		for (var i = 0; i < $scope.userlist.length; i++)
		{
			if ($scope.userlist[i] != username)
				tmp.push($scope.userlist[i]);
		}
		$scope.userlist = tmp;
	}
    $scope.updatesender = function(username) {
		$scope.receivers.push(username);
		$scope.popuser(username);
		$scope.userlistvisible = false;
		$scope.query = {username:""};
		if ($scope.receivers.length == 2)
			$scope.userqueryvisible = false;
	}
	$scope.removesender = function(username) {
		$scope.popreceiver(username);
		$scope.userlist.push(username);
    	$scope.userqueryvisible = true;
	}
    $scope.getUserlist = function(){
		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'userlist', 'data': {'TransientKey': TransientKey}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();

            if (response.data.res == 200) {
            	$scope.userlist = response.data.content;
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    $scope.getUserlist();
    $scope.sendMessage = function(){
    	$scope.msg.receivers = $scope.receivers.join(",");
        if($scope.msg.receivers == "")
        {
            var alertPopup = $ionicPopup.alert({
                title: 'Please enter usernames to send over a message.',
                template: 'Please enter the title of your post.'
            });
            return;
        }
        if($scope.msg.body == "")
        {
            var alertPopup = $ionicPopup.alert({
                title: 'Body is empty. Please enter the body of your post.',
                template: 'Please enter the body of your post.'
            });
            return;
        }
		// $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'addmessage', 'data': {'TransientKey': TransientKey, 'Receiver': $scope.msg.receivers, 'Body': $scope.msg.body}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            datatype: "json",
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200)
            {
                $scope.conversationid = response.data.content;
                $window.location.href = '#/tab/conversation/' + $scope.conversationid.ConversationID;
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'tab.newmessage')
        {
        	$scope.msg.receivers = "";
            $scope.msg.body = "";
        }
    });
})
/*----------------------------------------Conversation--------------------------------*/

.controller('ConversationCtrl', function($scope, $stateParams, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading) {
    $scope.conversation = [];
    $scope.msg = {};
    $scope.onItemClick = function(msg){
        msg.is_new = 0;
    }
    $scope.sendMessage = function(){
        if($scope.msg.body == "")
            return;
    //     $ionicLoading.show({
		//     content: 'Loading',
		//     animation: 'fade-in',
		//     showBackdrop: true,
		//     maxWidth: 200,
		//     showDelay: 0
		// });
		var params = {'action': 'insertmessage', 'data': {'TransientKey': TransientKey, 'ConversationID': $stateParams.conversation_id, 'Body': $scope.msg.body}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	// $ionicLoading.hide();
            if (response.data.res == 200) {
            	$scope.lastmessage = response.data.content;
                $state.go($state.current, {}, {reload: true});
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
    }

    $scope.getConversation = function(Conversation_ID){
		$ionicLoading.show({
		    content: 'Loading',
		    animation: 'fade-in',
		    showBackdrop: true,
		    maxWidth: 200,
		    showDelay: 0
		});
		var params = {'action': 'getconversation', 'data': {'TransientKey': TransientKey, 'ConversationID': Conversation_ID}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();
            if (response.data.res == 200) {
            	$scope.conversation = response.data.content;
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'tab.conversation')
        {
        	$scope.getConversation($stateParams.conversation_id);
            $scope.msg.body = "";
        }
    });
})


/*------------------------------------------Thread Controller ---------------------------------------*/


.controller('ThreadCtrl', function($ionicPosition,$window, $ionicScrollDelegate, $scope, $rootScope, $stateParams, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading) {
    $scope.thread = {};
    $scope.froalaOptions = {
        toolbarButtonsXS : ["bold", "italic", "underline", "strikeThrough", "|",  "insertImage", "align"]
    };
    $scope.reply = {};
    $scope.selectedDiscussion = 0;
    $scope.selectedComment = 0;
    $scope.getThread = function(ThreadID){
		$ionicLoading.show({
		    content: 'Loading',
		    animation: 'fade-in',
		    showBackdrop: true,
		    maxWidth: 200,
		    showDelay: 0
		});
		var params = {'action': 'thread', 'data': {'TransientKey': TransientKey, 'DiscussionID': ThreadID}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();
            if (response.data.res == 200)
            {
                //var profile = response.data.content;
                $scope.thread = response.data.content;
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}

    /*----------------------------Functions------------------------------- */

    $scope.replyComment = function(comment){
        $scope.reply.body = "";
        $scope.selectedComment = comment.CommentID;
        $ionicScrollDelegate.scrollBottom(true);
    }

    $scope.quoteReplyComment = function(comment){
        $scope.reply.body = "";
        $ionicScrollDelegate.scrollBottom(true);
        $scope.reply.body = "<blockquote class='Quote'>" + comment.Body + "</blockquote><br>";
        $scope.selectedComment = comment.CommentID;
    }

    $scope.thanksComment = function(comment){

        comment.ThankStatus = true;
		var params = {'action': 'thank', 'data': {'TransientKey': TransientKey, 'CommentID': comment.CommentID}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();
            if (response.data.res == 200)
            {
                //$state.go($state.current, {}, {reload: true});
            } else {

                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
    }

    $scope.unthanksComment = function(comment){

        comment.ThankStatus = false;
		var params = {'action': 'unthank', 'data': {'TransientKey': TransientKey, 'CommentID': comment.CommentID}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();
            if (response.data.res == 200)
            {
                //$state.go($state.current, {}, {reload: true});
            } else {

                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
    }

    $scope.replyDiscussion = function(discussion){

        $scope.reply.body = "";
        $ionicScrollDelegate.scrollBottom(true);
        $scope.selectedDiscussion = $stateParams.thread_id;

    }

    $scope.quoteReplyDiscussion = function(discussion){
        $scope.reply.body = "";
        $ionicScrollDelegate.scrollBottom(true);
        $scope.reply.body = "<blockquote class='Quote'>" + discussion.Body + "</blockquote><br>";
        $scope.selectedDiscussion =  $stateParams.thread_id;

    }

    $scope.thanksDiscussion = function(discussion){


		discussion.ThankStatus = true;
		var params = {'action': 'thank', 'data': {'TransientKey': TransientKey, 'DiscussionID': discussion.DiscussionID}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();

            if (response.data.res == 200)
            {
                //$state.go($state.current, {}, {reload: true});
            } else {

                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
    }

    $scope.unthanksDiscussion = function(discussion){


		discussion.ThankStatus = false;
		var params = {'action': 'unthank', 'data': {'TransientKey': TransientKey, 'DiscussionID': discussion.DiscussionID}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();

            if (response.data.res == 200)
            {
                //$state.go($state.current, {}, {reload: true});
            } else {

                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
    }

    $scope.postReply = function(){
        if($scope.reply.body == "")
        {
            $ionicScrollDelegate.scrollBottom(true);
            return;
        }


 		var params = {'action': 'insertcomment', 'data': {'TransientKey': TransientKey, 'DiscussionID': $scope.selectedDiscussion, 'CommentID': $scope.selectedComment, 'Body': $scope.reply.body}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	//$ionicLoading.hide();
            if (response.data.res == 200)
            {
                $scope.CommentID = response.data.content;
                $scope.reply = "";
                $state.go($state.current, {thread_id: $scope.selectedDiscussion}, {reload: true});
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
           // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    
    /*----------------------------------------------------------------- */

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'tab.thread')
        {
            if($stateParams.thread_id)
            {
                $scope.thread = {};
                $scope.getThread($stateParams.thread_id);
                $scope.selectedDiscussion = $stateParams.thread_id;
                $scope.selectedComment = 0;
                $scope.reply = {};
            }
        }
    });
})

/*------------------------------------Calendar Controller---------------------------------*/

.controller('EventCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, $httpParamSerializerJQLike, $ionicLoading) {
    $scope.eventsArray = [];
    
    $scope.curDate = {};
    if($scope.curDate)
    {
        $scope.curDate = new Date();
    }
    $scope.viewYear = $scope.curDate.getFullYear();
    $scope.viewMonth = $scope.curDate.getMonth();
    
    //--------------------------view mode----------------------------------
    //----------------- 1==CalendarView && 2==CardView -------------------- 
    $scope.viewMode = 1;
    $scope.onChangeView = function()
    {
        $scope.viewMode = $scope.viewMode == 1 ? 2 : 1; 
    }
    
    //calendar directive
    $scope.calendarObj = {
        eventsArray: [],
        viewYear: $scope.viewYear,
        viewMonth: $scope.viewMonth,
    };
        
    $scope.getEvents = function(){
		$ionicLoading.show({
		    content: 'Loading',
		    animation: 'fade-in',
		    showBackdrop: true,
		    maxWidth: 200,
		    showDelay: 0
		});
		var params = {'action': 'getevents', 'data': {'TransientKey': TransientKey,'Date': $scope.viewYear + "-" + ($scope.viewMonth + 1)  + "-" + $scope.curDate.getDate()}};
        $http({
            url: serverurl,
            method: "POST",
            data: $httpParamSerializerJQLike(params),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(function(response)
        {
        	$ionicLoading.hide();
            if (response.data.res == 200) {
            	$scope.eventsArray = response.data.content;
                $scope.calendarObj.eventsArray = $scope.eventsArray;
                $scope.calendarObj.refreshDateList();
                
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: response.data.msg
                });
            }
        },
        function(response) { // optional
            // failed
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Connection Error',
                template: 'Please check your network!'
            });
        });
	}
    //$scope.getEvents();
    
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'tab.event')
        {
            $scope.getEvents();
        }
    });
})

.directive('calendar', function($ionicPopup){
    function link(scope, element, attrs){
        var myPopup;
        function initCalendarDates() {
            // dayList:
            scope.dayList = [];
            
            // dayList methods:
            scope.dayList.zero = function () {
                this.length = 0;
            };
            scope.dayList.findDay = function (year, month, date) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].year === year && this[i].month === month && this[i].date === date) {
                        return i;
                    }
                }
            };
            
            scope.dayList.findDate = function (year, month, date) {
                if (this.length > 0) {
                    for (var i = 0; i < this.length; i++) {
                        var d = this[i];
                        if (d.year === year && d.month === month && d.date === date) {
                            return {isPresent: true, i: i};
                        }
                    }
                }
                return {isPresent: false};
            };
            
            // selectedDates
            scope.selectedDates = [];
            
            // selectedDates methods: 
            scope.selectedDates.findDate = function (year, month, date) {
                if (this.length > 0) {
                    for (var i = 0; i < this.length; i++) {
                        var d = this[i];
                        if (d.year === year && d.month === month && d.date === date) {
                            return {isPresent: true, i: i};
                        }
                    }
                }
                return {isPresent: false};
            };
            
        }
        
        function monthShift(year, month, direction) {
            switch (direction) {
                case '+':
                    if (month === 11) {
                        year++;
                        month = 0;
                    } else {
                        month++;
                    }
                break;

                case '-':
                    if (month === 0) {
                        year--;
                        month = 11;
                    } else {
                        month--;
                    }
                break;
            }

            return {year: year, month: month};
        }
        
        function initViews() {
            scope.weekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            scope.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Decemeber"];
            scope.url2thread = baseurl + "discussion/";
        }
        
        scope.prevMonth = function () {
            var date = monthShift(scope.inputObj.viewYear, scope.inputObj.viewMonth, '-');
            scope.inputObj.viewYear = date.year;
            scope.inputObj.viewMonth = date.month;
            scope.inputObj.refreshDateList();
        };
        
        scope.nextMonth = function () {
            var date = monthShift(scope.inputObj.viewYear, scope.inputObj.viewMonth, '+');
            scope.inputObj.viewYear = date.year;
            scope.inputObj.viewMonth = date.month;
            scope.inputObj.refreshDateList();
        };
        scope.onTap = function(selectedDay){
            scope.selectedDates.length = 0;
            scope.selectedDates.push(selectedDay);
            scope.inputObj.refreshDateList();
            var title = "Events on " +  scope.monthsList[selectedDay.month] + " " + selectedDay.date + " " + selectedDay.year;
        }
        scope.viewEventInfo = function(index)
        {
            scope.viewEvent = scope.selectedDates[0].style.events[index];
            var title = scope.monthsList[scope.selectedDates[0].month] + " " + scope.selectedDates[0].date + " " + scope.selectedDates[0].year;
            eventPopup(title);
        }
        scope.onQAclick = function(){if(myPopup) myPopup.close();}
        function eventPopup(title){
            
            // Custom popup
            myPopup = $ionicPopup.show({
                templateUrl: 'templates/calendar_popup.html',
                title: title,
                scope: scope,
                cssClass: 'event-popup',
                buttons: [
                    { text: 'Cancel' } 
                ]
            });

        }
        function findEvents(year, month, date)
        {
            var events = [];
            if(scope.inputObj.eventsArray.length > 0){
                var iDate = new Date(year, month, date);
                
                for(var i = 0; i < scope.inputObj.eventsArray.length; i++)
                {
                    iDate = new Date(scope.inputObj.eventsArray[i].LaunchDate);
                    if(year == iDate.getFullYear() && month == iDate.getMonth() && date == iDate.getDate())
                    {
                        events.push(scope.inputObj.eventsArray[i]);
                    }
                }
            }
            return events;
        }
        scope.inputObj.refreshDateList = function () {
            var today = new Date();
            var viewYear = scope.inputObj.viewYear;
            var viewMonth = scope.inputObj.viewMonth;
            var nowDay = today.getDate();
            var isCurMonthNow = (viewYear === today.getFullYear() && viewMonth === today.getMonth());

            var lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();
            scope.dayList.zero();

            //current month
            for (var i = 1; i <= lastDay; i++) {
                var isViewMonth = true;
                var isToday = isCurMonthNow && nowDay === i;
                
                var isSelected = scope.selectedDates.findDate(viewYear, viewMonth, i).isPresent;
                var iDate = new Date(viewYear, viewMonth, i);
                
                scope.dayList.push({
                year: viewYear,
                month: viewMonth,
                date: i,
                day: iDate.getDay(),
                style: {
                    isSelected: isSelected,
                    isToday: isToday,
                    isViewMonth: isViewMonth,
                    events: findEvents(viewYear, viewMonth, i), 
                }
                });
            }
        
            // add days of previous month
            var insertDays = scope.dayList[0].day;
            lastDay = new Date(viewYear, viewMonth, 0).getDate();

            var date = monthShift(viewYear, viewMonth, '-');
            isViewMonth = false;
            isToday = false;


            for (var j = 0; j < insertDays; j++) {

                isSelected = false;

                iDate = new Date(date.year, date.month, lastDay - j);

                scope.dayList.unshift({
                year: date.year,
                month: date.month,
                date: lastDay - j,
                day: iDate.getDay(),
                style: {
                    isSelected: isSelected,
                    isToday: isToday,
                    isViewMonth: isViewMonth,
                    events: findEvents(date.year, date.month, lastDay-j),
                }
                });
            }

            scope.rows = [0, 7, 14, 21, 28];
            if (scope.dayList.length / 7 > 5) {
                scope.rows.push(35); // = [0, 7, 14, 21, 28, 35];
            }

            var daysLeft = 7 - scope.dayList.length % 7;

            // start of next month
            
            date = monthShift(viewYear, viewMonth, '+');
            
            
            for (i = 1; i <= daysLeft; i++) {
                isSelected = false;
                iDate = new Date(date.year, date.month, i);

                scope.dayList.push({
                    year: date.year,
                    month: date.month,
                    date: i,
                    day: iDate.getDay(),
                    style: {
                        isSelected: isSelected,
                        isToday: isToday,
                        isViewMonth: isViewMonth,
                        events: findEvents(date.year, date.month, i)
                    }
                });
            }

            scope.cols = [0, 1, 2, 3, 4, 5, 6];
            
        };
        
        function start()
        {
            
            initViews();
            initCalendarDates();
            scope.inputObj.refreshDateList();
            var today = new Date();
            var result = scope.dayList.findDate(today.getFullYear(), today.getMonth(), today.getDate());
            if(result.isPresent)
                scope.selectedDates.push(scope.dayList[result.i]);
        }
        start();
    }
    return {
        restrict: 'E',
        scope: {
            inputObj: '=inputobj'
        },
        link: link,
        
        templateUrl: "templates/calendar.html",
    };
});