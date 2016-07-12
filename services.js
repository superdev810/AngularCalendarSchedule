angular.module('starter.services', [])
.service('NotificationService', function($http, $timeout, $httpParamSerializerJQLike, $document) {
	var poller = function() {
		var params = {'action': 'newinfo', 'data': {'TransientKey': TransientKey}};
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
				//var notificationtab = document.getElementsByClassName('ion-ios-bell');
        try{
			    if (document.styleSheets[0] != undefined) document.styleSheets[0].deleteRule(0);
        }
				catch (e) {}
				if (response.data.content.CountNotifications > 0)
				{
					document.styleSheets[0].insertRule(".ion-ios-bell:after { content: '" + response.data.content.CountNotifications + "'; position: absolute; font-size: 14px; color: #fff; background-color: red; width: 16px; height: 16px; border-radius: 8px; padding-top:1px; margin-left:-10px}", 0);
					//document.styleSheets[1].insertRule(".ion-email:after { content: '" + response.data.content.CountNotifications + "'; position: absolute; font-size: 14px; color: #fff; background-color: red; width: 16px; height: 16px; border-radius: 8px; padding-top:1px; margin-left:-10px}", 0);
				}
			}
			$timeout(poller, 10000);
		},
		function(response) {
		});
	};
	poller();

	return;
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png',
    time: '11-12-2014 01:14PM',
    read: 0
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png',
    time: '11-12-2014 01:14PM',
    read: 1
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat long oafas fasdf',
    face: 'img/adam.jpg',
    time: '11-12-2014 01:14PM',
    read: 1
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png',
    time: '11-12-2014 01:14PM',
    read: 0
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png',
    time: '11-12-2014 01:14PM',
    read: 0
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
