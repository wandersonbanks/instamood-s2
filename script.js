var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);
var caption = "";
var captionArrays = [];
app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
	$scope.hasToken = true;
	var token = window.location.hash;
	var tokenArray = token.split("=");
	var accessToken = tokenArray[1];
	$scope.captionScores = [];
	$scope.grandTotal = 0;
	console.log(accessToken);
  if (!token) 
  {
    $scope.hasToken = false;
  }
  	  token = token.split("=")[1];
  	  $scope.egoCount = 0;
  	  console.log("I am executing");
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;
	  $http({
	    method: "JSONP",
	    url: mediaUrl,
	    params: {
	    	callback: "JSON_CALLBACK",
	    	access_token: accessToken
	    }
	  }).then(function(response) 
	  {
      	$scope.picArray = response.data.data;
      	$scope.numLikes = 0;
      	var date = new Date();
      	var days = [];
      	$scope.caption = 0;
      	$scope.hashtags = 0;
      	for(var i = 0; i < $scope.picArray.length;i++)
	  	{
	    	if($scope.picArray[i].user_has_liked)
	     	{
	     		$scope.egoCount = $scope.egoCount  + 1;
	     	}
	     	captionArrays.push($scope.picArray[i].caption.text);
	     	$scope.caption = $scope.caption + $scope.picArray[i].caption.text.length;
	     	$scope.hashtags = $scope.hashtags + $scope.picArray[i].tags.length;
	     	$scope.numLikes = $scope.numLikes + ($scope.picArray[i].likes.count); 
	     	date = new Date($scope.picArray[i].created_time * 1000);
	     	days.push(date.getDay());
	  	}
	  	$scope.hashtags = $scope.hashtags/$scope.picArray.length;
	  	$scope.caption = $scope.caption/$scope.picArray.length;
	  	$scope.egoCount = ($scope.egoCount/$scope.picArray.length)*100;
	  	$scope.averageLikes = $scope.numLikes/$scope.picArray.length;
	  	var counts = {}, max = 0, commonDay=0;
		for (var i in days) 
		{
  			counts[days[i]] = (counts[days[i]] || 0) + 1;
  			if (counts[days[i]] > max) 
  			{ 
   	 			max = counts[days[i]];
    			commonDay = days[i];
  			}
		}
		var differntDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		$scope.day = differntDays[commonDay];
		caption = "I am analysing feeling good";
		analyzeSentiments();
	 })

	var analyzeSentiments = function() {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
    	for(var i=0;i<captionArrays.length;i++)
    	{
    		$http({
				url:"https://twinword-sentiment-analysis.p.mashape.com/analyze/",
				method: "GET",
				headers: {
					"X-Mashape-Key": "Fmjs327SMdmshHTjtTjZ8WXuN8ANp1NAEJwjsniGMiICvKhpSG",
				},
				params:{
					text: captionArrays[i]
				}
			}).then(function(response) {
				$scope.grandTotal += response.data.score;
				$scope.captionScores.push((response.data.score).toFixed(2));
			})
		}
		$http({
				url:"https://api.clarify.io:443/v1/bundles",
				method: "GET",
				headers: {
					"Authorization": "Bearer {WJvnnK8AFLQ2ch8WARAKtV3h2nS7AY}",
				},
			}).then(function(response) {
				console.log(response);
			})
	}
});
