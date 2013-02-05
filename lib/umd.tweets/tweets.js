// daylight savings time
//var SERVER_TIMEZONE_OFFSET = 4 * 60 * 60; 
var SERVER_TIMEZONE_OFFSET = 5 * 60 * 60;
var timezoneOffset = 0;
var showFrom = true;
var fromUsers = [];
var fromHighlights = [];
var fiaEventID = 0;
var fromTime = '';
var toTime = '';
var customTweetStyles = '';
var customTweetTextStyles = '';

function renderTweeters( data ){ 
 // d3.csv('retweets-reply.csv', function( data )
 // { 
 // console.log(data);

 var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.style("background-color","white")
	.style("border-color","black")
	.style("border-style","solid")
	.style("border-width","1px")
	.text("a simple tooltip")
	.style("font-size", "9");	
//  	

 var w = 350,
     h = 200;
 
 var x = d3.scale.linear().domain([0, data.length-1]).range([0, w]);
    
 var  min = Infinity,  max = -Infinity;

var count = [];  
     
 data.forEach(function(val) {     	
      count.push(+val.alltweets);          
    });
  //because date column is sorted // 

 var m = [5, 40, 5, 40];
 w = w - m[1] - m[3];
 h = h - m[0] - m[2];    

 var y = d3.scale.linear().rangeRound([0, h]);
 y.domain([d3.min(count), d3.max(count)]);
  
 var  yAx = d3.scale.linear().domain( [d3.min(count), d3.max(count)] ).range([ h, 0]); 
 var yAxis = d3.svg.axis().scale(yAx).ticks(7).orient("left").tickSubdivide(true);    
    
 var chart = d3.select("#tweets").append("svg")
     .attr("class", "chart")
     .attr("width", w + m[1] + m[3])
     .attr("height", h + m[0]+ m[2])
     .attr("shape-rendering", "crispEdges")
     .append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")")
     .attr("fill", "#2d578b");
     
 var rectWidth = w/(data.length);
 
 chart.selectAll("rect")
     .data(data)
 	 .enter().append("svg:rect")
     .attr("x", function(d, i) { return x(i) - .5; })
     .attr("y", function(d) { return h - y(d.alltweets) - .5; })
     .attr("height", rectWidth)     
     .attr("width", function(d) { return y(d.alltweets);})
     // .attr("shape-rendering", "crispEdges")
	 .on("mouseover", function(d){return tooltip.style("visibility", "visible").text("User:"+d.user_id);})
	 .on("mousemove", function(d,i){return tooltip.style("top", ( h - 0.5- y(d.alltweets)+"px")).style("left",x(i)+"px");})
	 .on("mouseout", function(){return  tooltip.style("visibility", "hidden");});

 chart.selectAll("div")
 	.data(data)
 	.enter().append("div")
	// .style("width", function(d) { return d * 10 + "px"; })
	// .style("background-color","white")
	// .style("border-color","black")
	// .style("border-style","solid")
	// .style("border-width","1px")
	.text("<i>a simple</i> ");
	// .style("font-size", "9");

	 
 chart.selectAll("text")
  	 .data(data)
  	 .enter().append("svg:text")
	 .attr("x", function(d, i) { return x(i) ; })
	 .attr("y", function(d) { return h - y(d.alltweets); })
  	 .attr("dx", 0)
  	 .attr("dy", "1.2em")
     .attr("text-anchor", "center")
     .text(function(d) { return d.alltweets;})
     .attr("fill", "white")
     .attr("font-size", "9");

 chart.append("line")
     .attr("x1", 0)
     .attr("x2", w+rectWidth+1 )
     .attr("y1", h - .5)
     .attr("y2", h - .5)
     .style("stroke", "#000");
     
 //now draw the y-axis//
  chart.append("svg:g")
      .attr("class", "y axis")
      // .attr("transform", "translate(" + w + ",0)")
      .call(yAxis);    
        
     // });
   }
//    
// function tweetPace(){   
// //now show the pace of the tweets, quantized per hour //    
 // d3.csv('tweet-pace-hour.csv', function( data ){
//  	
 // format = d3.time.format("%Y-%m-%d %H:%M");   
//  
 // var w = 900,
     // h = 200;
// 
 // var tooltip = d3.select("body")
	// .append("div")
	// .style("position", "absolute")
	// .style("z-index", "10")
	// .style("visibility", "hidden")
	// .style("background-color","white")
	// .style("border-color","black")
	// .style("border-style","solid")
	// .style("border-width","1px")
	// .text("a simple tooltip")
	// .style("font-size", "9");
//    
// var m = [40, 40, 40, 40];
 // w = w - m[1] - m[3];
 // h = h - m[0] - m[2];
//  
// var parse = d3.time.format("%d-%b");
// 
// // Scales and axes. Note the inverted domain for the y-scale: bigger is up!
// var x = d3.time.scale().range([0, w]),
    // y = d3.scale.linear().range([ 0, h]);
// 
//     
 // var  min = Infinity,mindate= new Date(2011,10,1),
      // max = -Infinity, maxdate= new Date(2010,1,15);
// 
// var count = [],
    // dates = [];
//      
   // data.forEach(function(val) {     	
      // count.push(+val.tweet_count);	 
      // dates.push(val.tweet_date);     
    // });
  // //because date column is sorted //
   // x.domain([new Date( format.parse(dates[0])), new Date( format.parse(dates[data.length-1]))] ).ticks(5);
   // y.domain([d3.min(count), d3.max(count)]);
// 
// var  yAx = d3.scale.linear().domain( [d3.min(count), d3.max(count)] ).range([ h, 0]);
// 
// var xAxis = d3.svg.axis().scale(x).tickFormat(parse).tickSize(5),
    // yAxis = d3.svg.axis().scale(yAx).ticks(7).orient("left").tickSubdivide(true);
//   
// var chart = d3.select("#pace").append("svg:svg")
     // .attr("class", "chart")     
     // .attr("width", w + m[1] + m[3])
     // .attr("height", h + m[0] + m[2])
     // .attr("shape-rendering", "crispEdges")
     // .append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
     // // .on("mouseover", function(){return tooltip.style("visibility", "visible").text("tooltip");})
  	 // // text("Date:"+format.parse(d.tweet_date)+", Tweets "+d.tweet_count);})
     // // .on("mousemove", function(){ console.log(d3.svg.mouse(this)[0]);  console.log(x.invert( d3.svg.mouse(this)[0]));
     		// // return tooltip.style("top", d3.event.pageY-0.5+"px" ).style("left", d3.event.pageX-0.5+"px" );})
	 // // .on("mouseout", function(){return  tooltip.style("visibility", "hidden");}); 	 
//  
//  
 // chart.selectAll("rect")
     // .data(data)
 	 // .enter().append("rect")
 	 // // .attr("class", "hist")
     // .attr("x", function(d) { return x(format.parse(d.tweet_date)) - .5; })
     // .attr("y", function(d) { return h -y(d.tweet_count) - .5; })
     // .attr("width", 1)
     // .attr("height", function(d) { return y(d.tweet_count); })
     // .attr("fill", "#2d578b");
  	 // // .on("mouseover", function(d){return tooltip.style("visibility", "visible").text("Date:");})
  	 // // text("Date:"+format.parse(d.tweet_date)+", Tweets "+d.tweet_count);})
     // // .on("mousemove", function(d,i){return tooltip.style(
     		// // "top", ( h - y(d.tweet_count)-0.5+"px")).style("left", x(i)+"px");})
	 // // .on("mouseout", function(){return  tooltip.style("visibility", "hidden");});
//       
// 
 // chart.append("line")
     // .attr("x1", 0)
     // .attr("x2", w)
     // .attr("y1", h - .5)
     // .attr("y2", h - .5)
     // .style("stroke", "#000");   
//      
      // // Add the x-axis.
  // chart.append("svg:g")
      // .attr("class", "x axis")
      // .attr("transform", "translate(0," + h + ")")
      // .call(xAxis);
// 
  // // Add the y-axis.
  // chart.append("svg:g")
      // .attr("class", "y axis")
      // // .attr("transform", "translate(" + w + ",0)")
      // .call(yAxis);
//     
//     
     // });
    // }

function getUserTweetCounts( div1, div2 ){
	  $.ajax({
                type: 'GET',
                url: '/ttw12/server/getUserTweetCounts.php', // or url:'server/gettweets.php' 
		  		// data: dataString,
                cache: false,
                success: function(data){                
            		countTweets(div1, data['total']);
            		countUsers(div2, data['users']);	
            		renderTweeters(data['tweets']);				
                },
		error: function() {
			// alert('Error loading tweets');
		}
        });	
}

function countTweets(div, data){	
	$(div).append(data);	
	
}
function countUsers(div, data){
	$(div).append(data);	
}

function getUserMentionedCounts(){

	
}

function initDBTwitterFeed(div, tag, rpp) {
	if (!tag) tag='TtW12';
	$(div).data("start", 1);
	$(div).data("max_id", 0);
	$(div).data("tag", tag);
	$(div).data("search", '');
	$(div).data("rpp", rpp);
	var today = new Date();
	var timezone = today.getTimezoneOffset() * 60;
	timezoneOffset = SERVER_TIMEZONE_OFFSET - timezone;
	if (fromTime=='' && fiaEventID==0) setInterval('loadNewTweets("'+div+'")', 60000);
	loadTweets(div, rpp, true);
}

function initDBTwitterFeedFromUser(div, users, tag, rpp) {
	showFrom = false;
	fromUsers = users;
	initDBTwitterFeed(div, tag, rpp);
}

function initDBTwitterFeedForEvent(div, eventID, rpp) {
	fiaEventID = eventID;
	initDBTwitterFeed(div, '', rpp);
}

function initDBTwitterFeedForTime(div, from, to, rpp) {
	fromTime = from;
	toTime = to;
	initDBTwitterFeed(div, '', rpp);
}

function initDBTwitterFeedAdvanced(div, users, highlightUsers, tag, rpp, tweetStyles, textStyles) {
	if (users && users.length>0) {
		showFrom = false;
		fromUsers = users;
	}
	if (highlightUsers && highlightUsers.length>0) fromHighlights = highlightUsers;
	if (tweetStyles) customTweetStyles = 'style="'+tweetStyles+'"';
	if (textStyles) customTweetTextStyles = 'style="'+textStyles+'"';
	initDBTwitterFeed(div, tag, rpp);
}

function loadTweets(div, clear) {
	var tag = $(div).data("tag");
	var search = $(div).data("search");
	var start = $(div).data("start");
	var rpp = $(div).data("rpp");
	var dataString = 'tag='+tag+'&start='+start+'&rpp='+rpp;
	if (search) dataString += '&search='+search;
	if (fromUsers) dataString += '&users='+fromUsers.toString();
	if (fiaEventID!=0) dataString += '&event='+fiaEventID;
	if (fromTime!='') dataString += '&from='+fromTime;
	if (toTime!='') dataString += '&to='+toTime;
    $.ajax({
                type: 'POST',
                url: '/ttw12/server/gettweets.php', // or url:'server/gettweets.php' 
		  		data: dataString,
                cache: false,
                success: function(data) {
                	
			if (typeof(updateTwitterFeedBeforeShow) == "function") {
				updateTwitterFeedBeforeShow(div, data['total']);
			}
			var more = data['total'] > (start+rpp-1);
                     appendTweets(div, data['tweets'], clear, more);
			updateTwitterFeedState(div, data);
                },
		error: function() {
			// alert('Error loading tweets');
		}
        });
};

function loadNewTweets(div) {
	var tag = $(div).data("tag");
	var maxID = $(div).data("max_id");
	var dataString = 'tag='+tag+'&newer='+maxID;
	if (search) dataString += '&search='+search;
	if (fromUsers) dataString += '&users='+fromUsers.toString();
        $.ajax({
                type: 'POST',
                url: '/ttw12/server/gettweets.php',
		data: dataString,
                cache: false,
                success: function(data) {
                        prependTweets(div, data['tweets']);
			updateTwitterFeedState(div, data);
                },
		error: function() {
			//alert('Error loading tweets');
		}
        });
}

function appendTweets(div, tweets, clear, more) {
	if (clear) $(div).empty();
	else $(div+' .loadmore').remove();
	for (i=0; i<tweets.length; i++) {
		var html = getTweetHtml(tweets[i], $(div).data("search"));
		$(div).append(html);
	}

	if (more) {
		$(div).append("<div class=\"loadmore\"><a href=\"javascript:loadTweets('"+div+"', false)\"; return false;\">Load More Tweets</a></div>");
	}
}

function prependTweets(div, tweets) {
	for (i=0; i<tweets.length; i++) {
		var html = getTweetHtml(tweets[i], $(div).data("search"));
		$(div).prepend(html);
	}
}

function getTweetHtml(tweet, highlightStr) {
	var createdAtAdjusted = adjustTime(tweet.created_at, timezoneOffset);
	var customTweetClasses = '';
	var highlightTweet = $.inArray(tweet.screen_name, fromHighlights) > -1;
	//if (highlightTweet) customTweetClasses += " yellow-bg";

	var highlightWords = highlightStr.split(" ");
	tweet.tweet_text = highlightText(tweet.tweet_text, highlightWords);

	if (showFrom) {
		var html = '<div class="tweet'+customTweetClasses+'" '+customTweetStyles+'>\n';
		html += '<div class="tweet-pic">\n';
		html += '<a href="http://twitter.com/user?screen_name='+tweet.screen_name+'" target="_blank">';
		html += '<img src="'+tweet.profile_image_url+'" /> ';
		html += '</a>';
		html += '</div>\n';
		html += '<div class="tweet-text" '+customTweetTextStyles+'>\n';
		if (highlightTweet) html += '<img src="/images/star.png" style="width:15px; height:15px"> ';
		html += '<a href="http://twitter.com/intent/user?screen_name='+tweet.screen_name+'" target="_blank">'+highlightText(tweet.screen_name,highlightWords)+'</a> ';
		html += convertLinks(tweet.tweet_text);
		html += '<div class="tweet-actions">\n';
		html += '<a href="http://twitter.com/'+tweet.screen_name+'/status/'+tweet.tweet_id+'" target="_blank"><abbr class="timeago" title="'+createdAtAdjusted+'">'+createdAtAdjusted+'</abbr></a> &middot; \n';
		html += '<a href="http://twitter.com/intent/tweet?in_reply_to='+tweet.tweet_id+'" target="_blank">reply</a> &middot; ';
		html += '<a href="http://twitter.com/intent/retweet?tweet_id='+tweet.tweet_id+'" target="_blank">retweet</a> &middot; ';
		html += '<a href="http://twitter.com/intent/favorite?tweet_id='+tweet.tweet_id+'" target="_blank">favorite</a>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
	}
	else {
		var html = '<div class="tweet'+customTweetClasses+'" '+customTweetStyles+'>\n';
		html += '<div class="tweet-text-no-margin" '+customTweetTextStyles+'>\n';
		if (highlightTweet) html += '<img src="/images/star.png" style="width:15px; height:15px"> ';
		html += convertLinks(tweet.tweet_text);
		html += '<div class="tweet-actions">\n';
		html += '<a href="http://twitter.com/'+tweet.screen_name+'/status/'+tweet.tweet_id+'" target="_blank"><abbr class="timeago" title="'+createdAtAdjusted+'">'+createdAtAdjusted+'</abbr></a> &middot; \n';
		html += '<a href="http://twitter.com/intent/tweet?in_reply_to='+tweet.tweet_id+'" target="_blank">reply</a> &middot; ';
		html += '<a href="http://twitter.com/intent/retweet?tweet_id='+tweet.tweet_id+'" target="_blank">retweet</a> &middot; ';
		html += '<a href="http://twitter.com/intent/favorite?tweet_id='+tweet.tweet_id+'" target="_blank">favorite</a>';
		html += '</div>';
		html += '</div>';
	}
	return html;
}

function highlightText(str, highlightWords) {
	if (highlightWords!='') {
		for (var i=0; i<highlightWords.length; i++) {
			var wordToHighlight = highlightWords[i];
			var re = RegExp(wordToHighlight, "gi");
			str = str.replace(re, "<strong>"+wordToHighlight+"</strong>");
		}
	}
	return str;
}

function convertLinks(tweet) {
	tweet = convertHashes(tweet);
	tweet = convertMentions(tweet);
	tweet = convertURLs(tweet);
	return tweet;
}

function convertHashes(tweet) {
	return tweet.replace(/(^|\s+)#(\w+|<strong>.*<\/strong>)/gi, 
		function(m, before, hash) {
			var hashParam = hash;
			hashParam = hashParam.replace(/<\/{0,}strong>/gi, '');
			var re = RegExp("TtW12", "gi");
			if (re.test(hashParam)) {
				return before + '<a href="/ttw12/welcome.html">#' + hash + '</a>';
			}
			else {
				return before + '<a href="/ttw12/welcome.html?tag='+hashParam+'">#' + hash + '</a>';
			}
		});
}

function convertMentions(tweet) {
	return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}|<strong>.*<\/strong>)/g, 
		function(m, username) {
			var usernameParam = username;
			usernameParam = usernameParam.replace(/<\/{0,}strong>/gi, '');
			return '@<a target="_blank" href="http://twitter.com/intent/user?screen_name=' + usernameParam + '">' + username + '</a>';
		});
}

function convertURLs(tweet) {
	return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.…\*\)]+)?(\s|$))/g, 
		function(link, m1, m2, m3, m4) {
			var http = m2.match(/w/) ? 'http://' : '';
			return '<a href="' + http + m1 + '">' + m1 + '</a>' + m4;
		});
}

function updateTwitterFeedState(div, data) {
	$('abbr.timeago').timeago();	

	var max = data['max_id'];
	if (max > $(div).data("max_id")) $(div).data("max_id", max);

	var start = $(div).data("start");
	var tweetCount = data['tweets'].length;
	$(div).data("start", start+tweetCount);
}

function adjustTime(timestamp, offset) {
	timestamp = timestamp.replace(/-/,"/").replace(/-/,"/");
	var timeInMs = Date.parse(timestamp);
	timeInMs += (offset*1000);
	var d = new Date(timeInMs);
	var month = padZeros(d.getMonth()+1,2);
	var day = padZeros(d.getDate(),2);
	var hour = padZeros(d.getHours(),2);
	var min = padZeros(d.getMinutes(),2);
	var sec = padZeros(d.getSeconds(),2);
	var newTimestamp = d.getFullYear()+"-"+month+"-"+day+" "+hour+":"+min+":"+sec;
	return newTimestamp;
}

function padZeros(number, length) {
	var str = '' + number;
	while(str.length < length) {
		str = '0'+str;
	}
	return str;
}

(function() {
  if (window.__twitterIntentHandler) return;
  var intentRegex = /twitter\.com(\:\d{2,4})?\/intent\/(\w+)/,
      windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
      width = 550,
      height = 420,
      winHeight = screen.height,
      winWidth = screen.width;
 
  function handleIntent(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        m, left, top;
 
    while (target && target.nodeName.toLowerCase() !== 'a') {
      target = target.parentNode;
    }
 
    if (target && target.nodeName.toLowerCase() === 'a' && target.href) {
      m = target.href.match(intentRegex);
      if (m) {
        left = Math.round((winWidth / 2) - (width / 2));
        top = 0;
 
        if (winHeight > height) {
          top = Math.round((winHeight / 2) - (height / 2));
        }
 
        window.open(target.href, 'intent', windowOptions + ',width=' + width +
                                           ',height=' + height + ',left=' + left + ',top=' + top);
        e.returnValue = false;
        e.preventDefault && e.preventDefault();
      }
    }
  }
 
  if (document.addEventListener) {
    document.addEventListener('click', handleIntent, false);
  } else if (document.attachEvent) {
    document.attachEvent('onclick', handleIntent);
  }
  window.__twitterIntentHandler = true;
}());

