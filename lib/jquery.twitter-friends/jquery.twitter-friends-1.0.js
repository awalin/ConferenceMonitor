/* 	Twitter Friends v1.0
	Blog : http://www.moretechtips.net
	Project: http://code.google.com/p/twitter-friends-widget/
	Copyright 2009 [Mike @ moretechtips.net] 
	Licensed under the Apache License, Version 2.0 
	(the "License"); you may not use this file except in compliance with the License. 
	You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
*/

(function($){ 
$.fn.twitterFriends = function(allOptions) {  
	// This default options will apply on all matched elements unless element has his own options
	var defaults = {
		debug:0
		,username:''
		,friends:0
		,users:20
		,users_max:100
		,loop:0
		,user_link:0
		,user_image:48
		,user_animate:'opacity'
		,user_change:200
		,user_swap:5000
		,user_append:1
		,header:''
		,tweet:0
		,tweet_avatar:1
		,tweet_author:0
		,tweet_date:1
		,tweet_source:1
		,tweet_image:48
		,tweet_stay:5000
		,tweet_change:200
		,tweet_animate:'opacity'
		,info:'<div class="tf-info"><a title="get Twitter Friends & Followers Widget!" target="_blank" href="http://www.moretechtips.net/">.i</a></div>'
	};
	allOptions = $.extend({}, defaults, allOptions);
		
	return this.each(function() {  
		// output init or not
		var wasOutput = 0;
		// users
		var rs = [];
		// visible page, avatar index, tweet index
		var vp = -1,ai=-1,si=-1;
		// this div, users div , tweet div, header div
		var div = $(this), usrsDiv=null, stsDiv=null, hdDiv=null;

		//override passed options by element embedded options if any
		var op = allOptions;
		if (div.attr('options')) {
			try { 
				op = eval('('+div.attr('options')+')'); 
			} catch(e) { 
				div.html('<b style="color:red">'+e+'</b>');
				return;
			};
			op = $.extend({}, defaults, op);
		};
		//request friends/followers
		var requestUsers = function() {
			var url = op.friends? 'http://api.twitter.com/1/statuses/friends.json' : 'http://api.twitter.com/1/statuses/followers.json';
			var data = {screen_name:op.username,cursor:-1};
			$.ajax({url:url,data:data,success:requestedUsers,dataType:'jsonp',cache:true});
		};
		//friends/followers was requested
		var requestedUsers = function(json){
			// Error!
			if(!json.users){
				if(op.debug) div.html('<b style="color:red">Error:'+(json.error? json.error:'unkown')+'</b>');
				return; //exit
			};
			rs = json.users;
			//no results 
			if(rs.length==0) return;
			//max is less than rs.length
			if(rs.length>op.users_max) rs.length = op.users_max;
			//keep new one last
			rs = rs.reverse();
			//Start output 
			output();

			// reset page index 
			vp=-1;
			addUsers();
		};
		// add users icons but hidden
		var addUsers= function() {
			// users list end, loop ?
			if( (vp+1)*op.users >=rs.length) {
				//reset page index ?
				if(op.loop) vp = -1;
				else return;
			};
			usrsDiv.html('');
			//next visible page
			vp++;
			//Add 
			for(var i=vp*op.users; i<(vp+1)*op.users; i++) {
				if(i>=rs.length) break;
				addUser(rs[i],i);
			};
			
			// reset show avatar index and start show sequence
			ai= op.user_append? -1 : $('a',usrsDiv).length;
			//start showing them
			showUser();
			
			// reset visible tweet index and start hide/show sequence
			si= -1;
			if(op.tweet) hideStatus();
		};
		// add hidden user icon
		var addUser = function(x,i) {
			var u = op.user_link && x.url? x.url :'http://twitter.com/' +x.screen_name;
			var t = x.name + (x.status && op.tweet ?': '+ x.status.text :'');
			t= t.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
			$('<a style="display:none;height:'+op.user_image+'px" href="'+u+'" title="'+ t +'">'
				+'<img src="'+x.profile_image_url+'" border="0" height="'+op.user_image+'" width="'+op.user_image+'"/>'
			+'</a>').appendTo(usrsDiv);
		};
		// recursive fn to show user one by one
		var showUser= function(){
			ai= op.user_append? ai+1 : ai-1;
			//create effect param and set it show
			var x = $('a:eq('+ai+')',usrsDiv);
			if(!x.length) {
				// no more users in current visible page
				// move next page after dummy effect if tweet is off
				if(!op.tweet) usrsDiv.animate({opacity:1},op.user_swap,"linear", addUsers);
				return;
			};
			var effect = new Object; effect[op.user_animate] = 'show';
			x.animate(effect,op.user_change,"linear", showUser);
		};
		
		// add tweet of current user
		var addStatus = function(x,s) {
			//Init style as hidden
			var u = op.user_link && x.url? x.url :'http://twitter.com/' +x.screen_name;
			var t = x.name;
			stsDiv.html('<div style="display:none;">'
				+ (op.tweet_avatar? '<span class="tf-avatar">'
					+'<a href="'+u+'" title="'+t+'">'
						+'<img src="'+ x.profile_image_url +'" height="'+op.tweet_image+'" width="'+op.tweet_image+'" border="0"/>'
					+'</a>'
				+'</span>' :'')
				+'<span class="tf-body">'
					+(op.tweet_author? '<strong>'
						+'<a href="'+u+'" title="'+t+'">'+ x.screen_name +'</a>'
					+'</strong>' :'')
					+'<span class="tf-content">'+ linkify(s.text) +'</span>'
					+'<span class="tf-meta">'
						+ (op.tweet_date? '<a class="tf-date" href="http://twitter.com/'+ x.screen_name +'/status/'+ s.id +'">'
							+ formatDate(s.created_at)
						+'</a>' :'')
						+ (op.tweet_source? '<span class="tf-source"> from '+ decodeHTML(s.source) +'</span>' :'')
					+'</span>'
				+'</span>'
			+'</div>');
		};
		
		// hide the current tweet
		var hideStatus = function(){
			if (si>-1) $('div',stsDiv).fadeOut(op.tweet_change,showStatus);
			else showStatus();
		};
		// show the next tweet
		var showStatus = function(){
			//Increment tweet index , loop cause some users will come without tweet
			var x=null,s=null;
			while(!s) {
				si++;
				//next users set
				if (si >= $('a',usrsDiv).length) {
					addUsers();
					return;
				};
				x = rs[vp*op.users + si];
				s = x.status;
			};
			//add current tweet
			addStatus(x,s);
			
			//create effect param and set it show
			var effect = new Object; effect[op.tweet_animate] = 'show';
			$('div',stsDiv).animate(effect,op.tweet_change,"linear", stayStatus);
		};
		// Dummy fade in effect to keep current link for a while
		var stayStatus = function(){
			$('div',stsDiv).animate({opacity:1},op.tweet_stay,"linear", hideStatus);
		};
		
		//parse links, user id's, hashtags
		var linkify= function(d){
			return d.replace(/\bhttps?\:\/\/\S+/gi, function(b){
				var c='';
				b= b.replace(/(\.*|\?*|\!*)$/,function(m,a){
					c=a;
					return ''
				});
				return '<a class="tf-link" href="'+b+'">'+((b.length>25)?b.substr(0,24)+'...':b)+'</a>'+c;
			})
			.replace(/\B\@([A-Z0-9_]{1,15})/gi,'@<a class="tf-at" href="http://twitter.com/$1">$1</a>')
			.replace(/\B\#([A-Z0-9_]+)/gi,'<a class="tf-hashtag" href="http://search.twitter.com/search?q=%23$1">#$1</a>')
		};
		//decode html at source
		var decodeHTML = function(s) {
			return s.replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"');
		};
		// Format publish date 
		var formatDate = function(s){
			//"Thu Oct 22 00:29:53 +0000 2009" for IE should be "Thu, 22 Oct 2009 02:27:47 +0000"
			if (/^(\w\w\w) (\w\w\w) (\d\d?) (\d\d?:\d\d?:\d\d?) ([\+\-]\d+) (\d\d\d\d)$/i.test(s))
			s = s.replace(/^(\w\w\w) (\w\w\w) (\d\d?) (\d\d?:\d\d?:\d\d?) ([\+\-]\d+) (\d\d\d\d)$/i, '$1, $3 $2 $6 $4 $5');
			
			var dat = new Date(),tody = new Date();
			dat.setTime(Date.parse(s));
			var td = tody.getDate(), tm = tody.getMonth()+1, ty = tody.getFullYear(), th = tody.getHours(), tmn = tody.getMinutes(), ts = tody.getSeconds();
			var d = dat.getDate(), m = dat.getMonth()+1, y = dat.getFullYear(), h = dat.getHours(), mn = dat.getMinutes(), s = dat.getSeconds();
			//today
			if (y==ty && m==tm && d==td) {
				var dh = th-h;
				if (dh>0) return dh+' hour'+(dh>1?'s':'')+' ago';
				var dmn = tmn-mn;
				if (dmn>0) return dmn+' minute'+(dmn>1?'s':'')+' ago';
				var ds = ts-s;
				return ds+' second'+(ds>1?'s':'')+' ago';
			}
			//Old one
			else return m+'/'+d+'/'+y;
		};
		
		//Get my info
		var requestMe = function() {
			$.ajax({url:'http://api.twitter.com/1/users/show.json'
					,data:{screen_name:op.username}
					,success:requestedMe
					,dataType:'jsonp'
					,cache:true});
		};
		//my info is loaded
		var requestedMe = function(j){
			output();
			// Errors!
			if(!j.screen_name){
				if(op.debug) hdDiv.html('<b style="color:red">Error:'+(j.error? j.error:'unkown')+'</b>');
				return; //exit
			};
			// write header
			hdDiv.html(op.header.replace(/_tp_/g, 'http://twitter.com/'+j.screen_name)
								.replace(/_fr_/g, j.friends_count)
								.replace(/_fo_/g, j.followers_count)
								.replace(/_ti_/g, j.profile_image_url)
			)
		};
		// Init
		var init = function() {
			if(op.header) requestMe();
			requestUsers();
		};
		// start output
		var output = function(){
			if(wasOutput) return; else wasOutput=1;
			div.html('');
			if(op.info) div.append(op.info); 
			//Add header div if enabled
			if(op.header) hdDiv = $('<div class="tf-header"></div>').appendTo(div); 
			//Add users div
			usrsDiv = $('<div class="tf-users"></div>').appendTo(div); 
			//Add tweet div if tweet on
			if(op.tweet) stsDiv = $('<div class="tf-tweet"></div>').appendTo(div); 
		};
		//start 
		init();
	});  
}

})(jQuery);  
//auto load div with class set to related-tweets
jQuery(document).ready(function(){
	jQuery('div.twitter-friends').twitterFriends();
});

