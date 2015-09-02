
/* Display a message that tells the user when no results are found for a particular type of search result. 
   There are only two types of search results: videos and channels.  */
function displayNoResults(searchResultType) {
	/* searchResultType is assumed to be a string representing the type of search result and can only take on 
		one of two possible values: 'videoResults' or 'channelResults'. */
	
	var idSelector = $('#' + searchResultType); 
	if (idSelector.children().length <= 1) { 
		idSelector.append('<p>' + 'No results were found.' + '</p>');
	} 
}

// Show a search result to the user 
function displayResult(searchResultType, resultTitle, afterSlash, typeId, thumbnailURL) {
	/* 
		All arguments given are strings.
		Arguments: 
		-	searchResultType: the type of the search result 
		-   resultTitle: title of search result
		-	afterSlash: something that comes immediately after ".com/" and before typeId in the url of the search result
		- 	typeId: the videoId or channelId of the search result
		-   thumbnailURL: the url of the image of a search result
	*/

	var idSelector = $('#' + searchResultType); 
	
	idSelector.append('<h3>' + resultTitle + '</h3>')
			  .append('<a href=https://www.youtube.com/' + afterSlash + typeId + '> <img src=' + thumbnailURL + '> </a>');
			 
	// setting some properties and attributes for the thumbnail image
	idSelector.find("img").attr({
		height: '200px', 
		width: '200px'
	})
	.css({
		display: 'inline-block',
		'margin': '0em auto 3em auto',
	});
			
	// setting the bottom margin for the title of the search result 
	idSelector.find('h3').css('margin-bottom', '0.5em');
			
}

// get the search results from YouTube based on the user search term and display the results
function getData(searchTerm) {
	// searchTerm is a string that represents the user's query
	
	var endpoint = "https://www.googleapis.com/youtube/v3/search",
		queryStringObj = {
			part: "snippet",
			key: "AIzaSyBw3dWwr4oBjQWZKIEthlHv0v_I04SYWn0",
			q: searchTerm
		},
		resultType, thumbnailURL, channelId, videoId, title;

	// place a JSON get request to the YouTube API
	$.getJSON(endpoint, queryStringObj, function(data) {
		var items = data.items;
		$.each(items, function(index, searchResultObj){
			/* Tasks:
				- Get the search result type (Note: The type can only be a YouTube video or a YouTube channel), the url of the 
				thumbnail image, and the title of the search result.
				- Choose how to display the search result that take into account the type of the search result. 
			*/
			
			resultType = searchResultObj.id.kind; 
			thumbnailURL = searchResultObj.snippet.thumbnails.medium.url; 
			title =  searchResultObj.snippet.title;
			
			if (resultType == "youtube#channel"){
				channelId =  searchResultObj.id.channelId; 
				displayResult('channelResults', title, "channel/", channelId, thumbnailURL);
			}
			else if (resultType == "youtube#video") {
				videoId =  searchResultObj.id.videoId; 
				displayResult('videoResults', title, "watch?v=", videoId, thumbnailURL);
			}
		});	
		
		// If a particular search result type has no results, then the user should no this. 
		displayNoResults("channelResults");
		displayNoResults("videoResults");
	});		
}



$(document).ready(function() {
	/* Tasks
		- Wait for the user to give a query by clicking the submit button
		- Get the query from the user 
		- Get rid of previous search results
		- Validate that the user entered something rather than clicking submit without any queries
		- For a valid query, display the results and then remove remove the query from the textbox
	*/
	
	$('form').submit(function(event) {
		event.preventDefault();
		var searchTerm = $('#query').val(); 
		$('a, h3, p').remove(); 
		if (searchTerm !== '') {
			getData(searchTerm); 
			$('#query').val(''); 
		}
	});
});
