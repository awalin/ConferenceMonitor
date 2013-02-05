var SERVER_TIMEZONE_OFFSET = 5 * 60 * 60;
var notweets= false;
var timezoneOffset = 0;
var showFrom = true;
var fromUsers = [];
var fromHighlights = [];
var fiaEventID = 0;
var fromTime = '';
var toTime = '';
var customTweetStyles = '';
var customTweetTextStyles = '';
var allTweets=[];
var allActions=[];
var usertweets = [];
var userFilter = '';
var duration = 'all';
var clearallfilter = true;
var widthchart ;
var brushiing;
var isBrush='false';
var intervention='';
var tweets_per_bin = [];


var attendeeslist = [];
// new Array( "kthompsp" ,  "paolaricaurte" ,  "davidsancar" ,  "jvitak" ,  "katieshilton" ,
 // "alicetiara" ,  "da_banks" ,  "thomas_wendt" ,  "katypearce" ,  "stineeckert" ,
 // "yanyiluo" ,  "call_me_ismail" ,  "murilomachado" ,  "rlynn82" ,  "bibliotecariaT" ,
 // "mayadotlivio" ,  "bridgettediann" ,  "jsantley" ,  "supernova7" ,  "pgde" ,
 // "MacherM" ,  "sashenka87" ,  "kwhite1184" ,  "earlvarona" ,  "anthropunk" ,  "aporya" ,
 // "Flipchik85" ,  "digiwonk" ,  "kzickuhr" ,  "Cre8tiveLib" ,  "aimeebe" ,
 // "jarahmoesch" ,  "jessyrob" ,  "mkoliska" ,  "Jup83" ,  "Greene_DM" ,  "academicdave" ,
 // "jhfrith" ,  "chenhuang" ,  "jarommcdonald" ,  "LibrariansFTW" ,
 // "grimacetjackson" ,  "dynamicsymmetry" ,  "sladner" ,  "alogicalfallacy" ,
 // "savasavasava" ,  "phenatypical" ,  "lportwoodstacer" ,  "kathleenkr" ,
 // "afamiglietti" ,  "tgibson1989" ,  "livlab" ,  "whimsylohan" ,  "marginalutility" ,
 // "eridowd" ,  "pjrey" ,  "nullhandle" ,  "heathermbro" ,  "anneohirsch" ,
 // "nicolchasedream" ,  "wildebees" ,  "jenoldyoung" , "farman" ,  "maizeandblue" ,
 // "gmugar" ,  "purplekimchi" ,  "YussefJagatic" ,  "severinearsene" ,  "kathlvaughn" ,
 // "andrewhazlett" ,  "ddchamberlain" ,  "supernova7" ,  "sladner" ,  "LibrariansFTW" ,
 // "GIS_Libraries" ,  "sonofodin0913" ,  "kdclibsci" ,  "james3neal" ,
 // "danicambauva" ,  "mokogobo" ,  "BenjaminTarsa" ,  "mschandorf" ,  "AMRigby12" ,
 // "jdefontes" ,  "jranck" ,  "OhShnit" ,  "call_me_ismail" ,  "SarahAWebster" ,
 // "donaldtaylorii");
//  
var showAttendees = 'all'; // none, only, all   
// 
// var tagclear = false; 
// var userclicked = false; 

var timecolor = d3.scale.category10();

var userdata =[];
var curuserdata =[];
var timelines = [] ;
var timelineHeadings = [];
var timeUsers = [];
var timeTags =[];

var sortDesc = true;
var session;

var sessionStart='';
var sessionEnd='';

var fromTime;
var toTime = 'now';

var sessionData = [] 
var hashtag = 'TtW12'
var yAx = d3.scale.linear();
var yAxis, xAxis;
var parse2 = d3.time.format("%d-%b");
var format = d3.time.format("%Y-%m-%d %H:%M:%S"); 
// Scales and axes. Note the inverted domain for the y-scale: bigger is up!
var x = d3.time.scale();    
var y = d3.scale.linear();
var currentTags = [] ;


function tagcloud(div, cl) {	 
	// tagclicked = false; 
	
   if (!cl || !cl.length) {
   	var tagcloud = d3.select("#tagcloud");
   	tagcloud.selectAll("ul").remove();
   	return ; 
   	// tagcloud(div, currentTags);
   }
   
   // console.log(cl);
   var maxFontSizeEm = 2.0;
   var dates = [] 
   var counts = [];
   // calculating the max and min count values
   cl.forEach(function(val){
   	 counts.push(+val.count);
   	 dates.push(+format.parse(val.oldest_use) );
   	 // val.oldest_use = +val.oldest_use;
   	    	
   });
   var max = d3.max(counts);
   var min = d3.min(counts);
    
   var mintweet = d3.min( dates );    
   var maxtweet = d3.max( dates );
   // console.log(mintweet);
   // console.log(maxtweet);  

   // var color    = d3.scale.linear().domain([mintweet, maxtweet]).range(["#cc9933","#339900"]);
   var color = d3.scale.log().domain([mintweet,maxtweet]).range(['#B8860B',"yellowgreen"]);   
   // var fontsize = d3.scale.log().domain([min,max]).range(1,maxFontSizeEm);  
   //Normalization helper
   var diff = ( max == min ? 1    // if all values are equal, do not divide by zero
                           : (max - min) / (maxFontSizeEm - 1) ); //optimization: Originally we want to divide by diff
                           // and multiple by maxFontSizeEm - 1 in getNormalizedSize.
   var tagcloud = d3.select("#tagcloud");
   
   tagcloud.selectAll("ul").remove();
   					 
   // tagcloud.append("<br/>");
      					 
   tagcloud
   .style("background-color","white")   
   .append("ul")   					  					  					
                    .selectAll("span")
   					.data(cl)
   					.enter().append("span")
            		.attr("class","tagcloudlink")
   					.style("line-height","0.85em")
   					.style("display","block")	
   					.style("float","left")
   					.style("background-color", function(d){ 
   						// console.log(color(+format.parse(d.oldest_use)));
   						return ""+color(+format.parse(d.oldest_use));})   					
   					.text( function(d){
   					 	// return '<a href="javascript:void(0);">#'+d.tag+'&nbsp;</a>';
   					 	return '#'+d.tag; }
  						)
  					// .style("line-height","0.8em")						
   					.style("font-size", function(d){
   					 if(min==max) return maxFontSizeEm+"em";
   					 else return	 (1 + (d.count - min) / diff) +"em";
   					})
   					// .sort(function (a, b) { 
   						  // a = a.tag.toLowerCase();
    					  // b = b.tag.toLowerCase();
            	       	 // return a > b ? 1 : a == b ? 0 : -1;
            	       		// })        
  					.on("click", function(d){			 			
						// console.log("tag= "+hashtag);
						// console.log("tag= "+d.tag);
			 			if( hashtag != d.tag ){ // don't clear tag//do something									 							 						 				
			 				    // tagclicked = !tagclicked;
			 				    hashtag = ""+d.tag;
			 					clearallfilter = false; 
					 	 		// console.log("hashtag= "+hashtag);
					 	 		d3.selectAll(".tagcloudlink")
					 	 		// .select(function(d0 ,i) {
					 	 			// console.log(" filter in tag selection "+d0.tag);return (d0.tag!=hashtag)?this: null; })
					 	 		.transition().duration(500)
					 	 		.style("background-color","#F8F8F8")
					 	 		.style("color","#c8c8c8")
					 	 		// .style("border-color","#e0e0e0")
					 	 		;			 	 		
					 	 		d3.select(this)
					 	 		.transition().duration(520)
					 	 		.style("background-color", function(d){ 
					 	 			// return color(d.count);
					 	 			// console.log(color( +format.parse(d.oldest_use) ) );
					 	 			return ""+color( +format.parse(d.oldest_use) );
					 	 			}			) 
					 	 		.style("color","#003333")
					 	 		// .style("border-color","#99cc99")
					 	 		;							 	 				 	 	
					 	 		
					 	 		//also load the user table
					 	 		if(userFilter=='') {// no user is highlighted on the table  
					 	 			renderUserTable("#users"); 
					 	 		}
					 	 		
					 	 		loadTweets('#twitter-feed');		
			 			}
			 			
			 			else{  
			 					// console.log("clear tag");
								hashtag = 'TtW12';				
								getTagCloud("#tagcloud");	
													
								if(userFilter == ''){
									renderUserTable("#users");																			
								}			    											
															
								loadTweets("#twitter-feed");			 				
			 				
			 			}				 	 		
			 	 	}
			 	 ); 			 	  
}

function getSessionData(){
		
	$.ajax({
                type: 'GET',
                url: 'server/getSessionTable.php', // or url:'server/gettweets.php' 
		  		// data: dataString,
                cache: false,
                success: function(data0){
   					sessionData = data0['sessions'];     
                     },
		error: function() {
			alert('Error loading session');
		}
        });	
	
	
}

function getAttendees(){
	
	$.ajax({
                type: 'GET',
                url: 'server/getAttendees.php', // or url:'server/gettweets.php' 
		  		// data: dataString,
                cache: false,
                success: function(data0){
   					var allattendees = data0['attendees'];  
   					// console.log(attendeeslist);   
   					allattendees.forEach(function(val) {     	
      					attendeeslist.push( val.screen_name.toLowerCase() ); 
      		     	});
                     },
		error: function() {
			alert('Error loading attendees');
		}
        });	
	
	
}


function drawTable(attrName) {
	
	userFilter='';
	
	sortDesc = !sortDesc;
    var mydiv = document.getElementById("users");               	
//                 	
    var w = parseInt(mydiv.offsetWidth);
    var cellWidth = w/8;
    	
	var  min = Infinity,  max = -Infinity;

// var count = [];  
	// var format = d3.time.format("%Y-%m-%d %H:%M:%S");  

	var tweets = [];
	var mentions= [];
	var followers= [];
	var friends =[];
	var latest =[]; 
	var mentioners = [];
	
	
	var usertable= d3.select("#users").select("table");  
	// console.log("user table "+ usertable);
		     
	curuserdata.forEach(function(val) {     	
      tweets.push( +val.total_tweets );
      friends.push( +val.friends );
      mentions.push( +val.mentioned_in );
      mentioners.push(+val.mentioned_by);
      followers.push( +val.followers);  
      // latest.push( format.parse(val.last_update) ) ;
      // console.log("val="+ val.last_update);        
    });
     
 var xScale = [];
 xScale[0] = d3.scale.linear().rangeRound([0, cellWidth]).domain(d3.extent(tweets));   
 xScale[1] = d3.scale.linear().rangeRound([0, cellWidth]).domain(d3.extent(followers));   
 xScale[2] = d3.scale.linear().rangeRound([0, cellWidth]).domain(d3.extent(friends));   
 xScale[3] = d3.scale.linear().rangeRound([0, cellWidth]).domain(d3.extent(mentions));
 xScale[4] = d3.scale.linear().rangeRound([0, cellWidth]).domain(d3.extent(mentioners)); 
 // xScale[4] = d3.time.scale().range([0, cellWidth]).domain([d3.min(latest), d3.max(latest)]);    
 
 // console.log( attrName);    


 var th =  usertable.select("thead").selectAll("th")
 .attr("class", function(d){
 	if( d[0] == attrName) {
 		if(sortDesc){
 			return "table-desc";
 		}
 		else if (!sortDesc){
 			return "table-asc";
 		}         			 		// console.log(d[0]);
          			
         }
         else { 
         	return "table-none"; } 		
 	
 })
          ;

// Rows
  var tr = usertable.selectAll("tr")
            .sort(function (a, b) { 
            	// console.log("a= "+a);
            	// console.log("b="+b);
            	if(attrName != '')
            		return allCompare (a,b, attrName)})        	
            ;
// Cells
    var td = tr.selectAll("td");
    var tddiv = td.select("div")
    		// .style("float", function(d){
    			// if(d[0]=="screen_name"){
    				// return "left"; }
    			// else return "right";	
//     			
    		// })
 		
            .style("width", function (d){            
 				if(d[0]=="total_tweets"){ 
 					// console.log(d[0],d[1]);          	
            		var v = +d[1];
            		// console.log(v); 
                
                	return xScale[0](+d[1])+"px";
                	}
                else if(d[0]=="followers"){ 
 					// console.log(d[0],d[1]);          	
            		var v = +d[1];
            		// console.log(v); 
                	// console.log(xScale[0](v));
                	return xScale[1](+d[1])+"px";
                	}
              else if(d[0]=="friends"){ 
 					// console.log(d[0],d[1]);          	
            		var v = +d[1];
            		// console.log(v); 
                	// console.log(xScale[0](v));
                	return xScale[2](+d[1])+"px";
                	}
             else if(d[0]=="mentioned_in"){ 
 					// console.log(d[0],d[1]);          	
            		var v = +d[1];
            		// console.log(v); 
                	// console.log(xScale[0](v));
                	return xScale[3](+d[1])+"px";
                	}
             else if(d[0]=="mentioned_by"){ 
 					// console.log(d[0],d[1]);          	
            		var v = +d[1];
            		// console.log(v); 
                	// console.log(xScale[0](v));
                	return xScale[4](+d[1])+"px";
                	}
              else return "0px" ; 	  	
                	  	
            })
            ;      	
}

function allCompare(a,b,attrName){	

	
	// console.log("cmp: " + attrName);
	if(attrName=='last_update'){
            		//create date comparator
            	return dateCompare(a[attrName], b[attrName]); 
            	}
    else if(attrName=='screen_name'){
            		return stringCompare(a[attrName], b[attrName]); }
    else {
            		return intCompare(a[attrName], b[attrName]);
            		}       		
            	
}
function dateCompare( a,b ){


	// var format = d3.time.format("%Y-%m-%d %H:%M:%S");
	var format = d3.time.format("%Y-%m-%d");  	
	var daya = format.parse(a);
	var dayainsec = +daya;
			// console.log("b4 parse "+ val.tweet_time);
	var dayb = format.parse(b);
	var daybinsec = +dayb;
			// console.log( dayainsec);
			// console.log( daybinsec);//" : Today is within  1 week");
 
	if(sortDesc){
		return dayainsec < daybinsec ? 1 : dayainsec == daybinsec ? 0 : -1;}
	else 
	    return 	dayainsec > daybinsec ? 1 : dayainsec == daybinsec ? 0 : -1;
	
}

function stringCompare(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if(sortDesc)
    	return a < b ? 1 : a == b ? 0 : -1;
    else  return a > b ? 1 : a == b ? 0 : -1;
}

function intCompare(a, b) {
	a=+a;
	b=+b;
	if(sortDesc)
    	return a < b ? 1 : a == b ? 0 : -1;
    else 
        return a > b ? 1 : a == b ? 0 : -1;
}

function jsonKeyValueToArray(k, v) {return [k, v];}

function jsonToArray(json) {
    var ret = new Array();
    var key;
    for (key in json) {
        if (json.hasOwnProperty(key)) {
            ret.push(jsonKeyValueToArray(key, json[key]));
        }
    }
    return ret;
};

function createTable(){
	
   // userclicked = false;	
   var div = "users"; 
   var mydiv = document.getElementById(div);                	
                	
   var w = parseInt(mydiv.offsetWidth);
   var cellWidth = w/4;
   var h = parseInt(mydiv.offsetHeight);
   h = h/12;
   
    curuserdata = userdata.filter(function(val){
   	if(showAttendees=='all'){ 
   		return true;
   		}
   	else if(showAttendees=='none'){
   		return ($.inArray(val.screen_name.toLowerCase(),attendeeslist)==-1);
   	}
   	else if(showAttendees=='only'){
   		console.log("only");
   		return ($.inArray(val.screen_name.toLowerCase(),attendeeslist)>=0);
   	}
   	 
   }); 
   
   d3.select("#users-count").text(curuserdata.length);  
                	//    
   d3.select("#users").selectAll("table").remove();
      
   var usertable= d3.select("#users")
   	.append("table")
   	.attr("class","table table-condensed");   
   usertable.append("tbody");   
// Header
   usertable.append("thead");              	
   var attrName = '';
        
   var th =  usertable.select("thead").selectAll("th")
            .data(jsonToArray(curuserdata[0]))
          .enter().append("th")
          // .attr("width",cellWidth)
          .attr("align","left")      	
             .text(function(d) { return d[0]; }) 
     .attr("onclick", function (d, i) {            	
            	// console.log(d[0]+"::"); 
            	return "drawTable('" + d[0] + "');";}) 
    .attr("class", function(d){
 	if( d[0] == attrName) {
 		if(sortDesc){
 			return "table-desc";
 		}
 		else if (!sortDesc){
 			return "table-asc";
 		}         			 		// console.log(d[0]);
          			
       }
      else { 
         	return "table-none"; } 		
 	
 })
          ;
          
   var tr = usertable.selectAll("tr")
     .data(curuserdata)
               .enter().append("tr")
          .style("background-color","white")
          // .on("mouseover", function(){d3.select(this).style("background-color", "#E0F2BE");})
          // .on("mouseout", function(){d3.select(this).style("background-color", "white");})	
     	 	.on("click", function(d){
     	 		
     	 	if(userFilter!=d.screen_name){
	 	 		userFilter = d.screen_name ;
	 	 		clearallfilter = false;
	 	 		d3.selectAll("tr").style("background-color","#ffffff").style("color","#a0a0a0"); 
	 	 		d3.select(this)
	 	 			.transition()
			       .duration(500)
	 	 		.style("background-color","#E0F2BE").style("color","#000000");
	 	 		// now reload tag cloud and tweet feed //
	 	 		if(hashtag=='' || hashtag=='TtW12') {
	 	 			getTagCloud("#tagcloud");
	 	 			}
	 	 		loadTweets('#twitter-feed'); 
	 	 		// userclicked = !userclicked;
	 	 	
	 	 		}
	 	  else {
	 	  	// if(userFilter!=d.screen_name){
	 	  		// return;
	 	  	// }
	 	  	// else
	 	  	{
	 	  		//clear table //
	 	  				// userdata = data0['users'];   						   						
   						userFilter='';
   						// userclicked = !userclicked;
   						console.log("user filter "+userFilter);   
   						usertweets = allTweets['tweets'];   						
   						
   						createTable();  						                       	
   						// drawTable('');
   						
   						//now reload tag cloud, show tags from all users //
   						if(hashtag=='' || hashtag=='TtW12') 
 	 						getTagCloud("#tagcloud"); 	 					
 	 						loadTweets("#twitter-feed");
	 	  	}
	 	  }		 	 		
 	 	}
 	 	)
      ; 
            
   var td = tr.selectAll("td")    		
            .data(function(d) { return jsonToArray(d); })
            .enter().append("td")
            .style("height", h+"px")
            .style("white-space", "nowrap") // so that hyphens don't cause line break //
            .attr("class",function(d){ return d[0]} )
         .append("div")
            .data( function (d) {
            	return jsonToArray(d);            	
            } ) 
           // .style("text-align",function(d){
           	 // if(d[0]!="screen_name"){
           	 	// return "right";         	 	
           	 // }
           	 // else return "left";
           // })
            .style("background-color","#cac7d8");       
      
    td.text( function(d){ 
  		// if(d[0]=='screen_name'){
  	    	return d[1];
  	    	// }
  		// else return ''+d[1]+'';
  		})
  		
 	 ;  
	 drawTable('');   					
}

function renderUserTable(div, showall){
	// if(showall){		
		// showAttendees=showall;
	// }
	
	var dataString = '';	 
	dataString +='tag='+hashtag;
	   
	if(duration!='all')   	
		dataString += '&duration='+duration;
	
	if(sessionEnd !=''){		
		dataString += '&sessionStart='+sessionStart;
		dataString += '&sessionEnd='+sessionEnd; 
		// console.log(sessionEnd);
	}	
	console.log("data at user table call  "+dataString );
			   
	$.ajax({
                type: 'POST',
                url: 'server/getUserTable.php', // or url:'server/gettweets.php' 
		  		data: dataString,
                cache: false,
                success: function(data0){
                	// userdata= [] ;
   					userdata = data0['users'];
   					// console.log("user qry 1 "+data0['qry1']);
   					// console.log("user qry 2 "+data0['qry2']);   						
   					createTable();	 	                       	
   					// drawTable('');   					
   					
   					d3.select("#clearuser")
   					 .on("click", function(){
   					 	
   						userdata = data0['users'];
   						   						
   						userFilter='';
   						console.log("user filter "+userFilter);   
   						usertweets = allTweets['tweets'];   						
   						
   						createTable();  						                       	
   						// drawTable('');
   						
   						//now reload tag cloud, show tags from all users //
   						if(hashtag=='' || hashtag=='TtW12') 
 	 						getTagCloud("#tagcloud");
 	 					
 	 					loadTweets("#twitter-feed");
 	 						
   					});     
                     },
		error: function() {
			// alert('Error loading users');
			// createTable('');
			drawTable('');
		}
        });	
}

function getUrls(div){
	  $.ajax({
                type: 'GET',
                url: 'server/getUrl.php', // or url:'server/gettweets.php' 
		  		// data: dataString,
                cache: false,
                success: function(data){                
            		// countTweets(div1, data['total']);
            		// countUsers(div2, data['users']);	
            		// renderTweetPace(data['tweet-pace'], duration);				
                },
		error: function() {
			// alert('Error loading tweets');
		}
        });		
}

function renderMentionNetwork(div, netdata){
	
var width = 800;
var height = 400;
  
  // var color = d3.scale.category20();
  
 force = d3.layout.force()
      .charge(-120)
      .linkDistance(40)
      .size([width, height]);
 
 var svg = d3.select("#network").append("svg")
 			.attr("height", height)
     		.attr("width", width);
     
 
 
 // before this, best way would be to set the source and 
 // target for each link by the index of the node, using ForEach, and node.index //
 var data;
 
 d3.json("query-result", function(json){

 // console.log(netdata);
 
 data = json;  
 
 var nodes = data.nodes;
 var links = data.edges;
 
 var nodeIndex=[]
 
 nodes.forEach(function(val) {     	
      nodeIndex.push(val.user_id);          
    });
 // console.log(nodeIndex);
 
 links.forEach(function(val){
 	val.source = jQuery.inArray(val.source_user_id , nodeIndex );
 	val.target = jQuery.inArray(val.target_user_id , nodeIndex ); 	
 });
 
 force.nodes(nodes).links(links).start();
  
   var link = svg.selectAll("line.link")
      	.data(links)
     	.enter().append("line")
        .attr("class", "link");
        // .style("stroke-width", function(d,i) { var o = force.nodes[i]; console.log(o) ;return Math.sqrt(1); });
 
   var node = svg.selectAll("circle.node")
       .data(nodes)
       .enter().append("circle")
       .attr("class", "node")
       .attr("r", function(d,i) { return Math.sqrt(force.nodes()[i].weight); })
       .style("fill","white" )
       .style("stroke","green")
       .style("stroke-width",2)
       .call(force.drag);
 
   node.append("title").text(function(d) { return d.screen_name; });  
   
   
   force.on("tick", function() {
     link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
 
     node.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
   });
 }	
);
}

function getMentionNetwork(div){
	
	renderMentionNetwork(div );//test, read from file // no call to db //
	
	// $.ajax({
                // type: 'GET',
                // url: 'server/getNetwork.php', // or url:'server/gettweets.php' 
		  		// // data: dataString,
                // cache: true,
                // success: function(data){  
            		// renderMentionNetwork(div, data );				
                // },
		// error: function() {
			// // alert('Error loading network');
		// }
        // });		
	
}

function renderMentionedTweeters( data ){ 
 // d3.csv('retweets-reply.csv', function( data )
 // { 
 // console.log(data);
var w = 110,
    h = 180;
 
var  min = Infinity,  max = -Infinity;

var count = [];  
     
 data.forEach(function(val) {     	
      count.push(+val.mention);          
    });
  //because date column is sorted // 

 var m = [0, 4, 20, 80];
 w = w - m[1] ;//- m[3];
 h = h - m[0] - m[2]*2;    
 
 var y = d3.scale.linear().domain([0, data.length]).range([0, h]); 
 
 var rectHeight = h/(data.length) ;

 var x = d3.scale.linear().rangeRound([0, w]).domain([0, d3.max(count)+0.5]);
  
 var xAxis = d3.svg.axis().scale(x).ticks(4).orient("bottom").tickSubdivide(true).tickSize(2);   

  var names = d3.select("#mentions")
 	 .append("div")
     .attr("class", "names")
     .style("text-align" ,"right")
     .style("float","left")
     .style("width",  m[3]+"px")
     .attr("rendering","crisp-edge")
     // .style("height", h +"px")
     .style("font-size","9px")
     .attr("fill", "white");
      
      
 // var twitterUrl= '<a href="http://twitter.com/intent/user?screen_name=';//+tweet.screen_name+'" target="_blank">';
 var twitterUrl= '<a href=?name=';  
      
 names.selectAll("div")
     .data(data)
 	 .enter().append("div")
 	 // .attr("height", rectHeight)
 	 .style("line-height",rectHeight+"px")
     .html( function(d){ return '<a href="javascript:void(0);">'+d.screen_name+'</a>';})
 	 .on("click", function(d){
 	 	// alert(d.screen_name);
 	 	userFilter = d.screen_name ;
 	 	clearallfilter = false; 
 	 	loadTweets('#twitter-feed');}) 
	 ; 
  
 var chart = d3.select("#mentions")
 	 .append("svg")
     .attr("class", "chart")
     .attr("width", w + m[1] )//+ m[3])
     .attr("height", h + m[0]+ m[2])
     .attr("rendering","crisp-edge")
     .append("svg:g").attr("transform", "translate(" + m[1] + "," + m[0] + ")")
     .attr("fill", "#2d578b")
     ;
 
 chart.selectAll("rect")
     .data(data)
 	 .enter().append("svg:rect")
     .attr("y", function(d, i) { return y(i)+ 0.5; })
     .attr("x",0 )
     .attr("height", rectHeight*0.75)     
     .attr("width", function(d) { return x(d.mention);})
   	 ;
 
 chart.selectAll("text")
  	 .data(data)
  	 .enter().append("svg:text")
  	 .attr("y", function(d, i) { return y(i)+rectHeight/2 ; })
	 .attr("x", function(d) { return  x(d.mention)-5; })
  	 .attr("dx", -3)
  	 .attr("dy", "0.3em")
     .attr("text-anchor", "end")
     .text(function(d) { return d.mention;})
     .attr("fill", "white")
     .attr("font-size", "9");

 chart.append("line")
     .attr("x1", 0)
     .attr("x2", 0 )
     .attr("y1", 0)
     .attr("y2", h )
     .style("stroke", "#000");
     
  chart.append("line")
     .attr("x1", 0)
     .attr("x2", w)
     .attr("y1", h -0.5 )
     .attr("y2", h -0.5 )
     .style("stroke", "#000");   
     
      // Add the x-axis.
  chart.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h  + ")")
      .call(xAxis);  
          // });
   }
//
function renderTweeters( data ){ 

var w = 110,
    h = 180;
 
var  min = Infinity,  max = -Infinity;

var count = [];  
     
 data.forEach(function(val) {     	
      count.push(+val.alltweets);          
    });
  //because date column is sorted // 

 var m = [0, 4, 20, 80];
 w = w - m[1] ;//- m[3];
 h = h - m[0] - m[2];    
 
 var y = d3.scale.linear().domain([0, data.length]).range([0, h]); 
 
 var rectHeight = h/(data.length) ;

 var x = d3.scale.linear().rangeRound([0, w]).domain([0, d3.max(count)+0.5]);
  
 var xAxis = d3.svg.axis().scale(x).ticks(4).orient("bottom").tickSubdivide(true).tickSize(2);   

  var names = d3.select("#tweets")
 	 .append("div")
     .attr("class", "names")
     .style("text-align" ,"right")
     .style("float","left")
     .style("width",  m[3]+"px")
     // .style("height", h +"px")
     .style("font-size","9px")
     .attr("fill", "white");
      
      
 // var twitterUrl= '<a href=?name=';        
 names.selectAll("div")
     .data(data)
 	 .enter().append("div")
 	 .style("line-height",rectHeight+"px")
 	 .html( function(d){ return '<a href="javascript:void(0);">'+d.screen_name+'</a>';})
 	 .on("click", function(d){
 	 	userFilter = d.screen_name ;
 	 	clearallfilter = false; 
 	 	// alert(d.screen_name); 
 	 	loadTweets('#twitter-feed');})
     // .html( function(d){ return twitterUrl+d.screen_name+'>'+d.screen_name+'</>';})
	 ; 
  
  
 var chart = d3.select("#tweets")
 	 .append("svg")
     .attr("class", "chart")
     .attr("width", w + m[1] )// + m[3])
     .attr("height", h + m[0]+ m[2])
     .attr("rendering","crisp-edge")
     .append("svg:g").attr("transform", "translate(" + m[1] + "," + m[0] + ")")
     .attr("fill", "#2d578b")
     ;
 
 chart.selectAll("rect")
     .data(data)
 	 .enter().append("svg:rect")
     .attr("y", function(d, i) { return y(i) + .5; })
     .attr("x",0 )
     .attr("height", rectHeight*0.75)     
     .attr("width", function(d) { return x(d.alltweets);})
   	 ;
 
 chart.selectAll("text")
  	 .data(data)
  	 .enter().append("svg:text")
  	 .attr("y", function(d, i) { return y(i)+rectHeight/2 ; })
	 .attr("x", function(d) { return  x(d.alltweets)-5; })
  	 .attr("dx", -3)
  	 .attr("dy", "0.3em")
     .attr("text-anchor", "end")
     .text(function(d) { return d.alltweets;})
     .attr("fill", "white")
     .attr("font-size", "9");

 chart.append("line")
     .attr("x1", 0)
     .attr("x2", 0 )
     .attr("y1", 0)
     .attr("y2", h )
     .style("stroke", "#000");
     
  chart.append("line")
     .attr("x1", 0)
     .attr("x2", w)
     .attr("y1", h - .5)
     .attr("y2", h - .5)
     .style("stroke", "#000");   
     
      // Add the x-axis.
  chart.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h  + ")")
      .call(xAxis);  
        
   }
// 

function filterByDuration(duration, data){

var day = duration; //clear session duration //
sessionEnd='';
sessionStart ='';
 
// console.log(day);
//data related operations //  
var values = [];	

if(day=='all'){
			// take all data, no need to filter 
			values=data;
			} 
else {
		day=+day;		
		clearallfilter = false ; 
		
		// loadTweets("#twitter-feed"); // now change the tweet-feed 
		  
		  
		// console.log(" inside change "+day);		
		
    	values= data.filter(function(val) {     	
			var today = new Date();
			var todayinsec = +today;
			// console.log("b4 parse "+ val.tweet_time);
			var datadate= new Date(val.tweet_time);
			var datadatesec= +datadate;
			// console.log( todayinsec);
			// console.log( datadatesec);//" : Today is within  1 week");
			return ( todayinsec - datadatesec < day*24*60*60*1000); // diff in milli seconds
		});
	}

return values;
	
}   

function filterActionByDuration(duration, actions){

var day = duration;
 
// console.log(day);

var actionvalues=[];
// console.log("inside "+ actions);

if(day=='all'){
			// take all data, no need to filter 
			actionvalues=actions;
			} 
else {
		day=+day;
		clearallfilter = false ; 		
		// console.log(" inside change "+day);		
    	actionvalues = actions.filter(function(val) {     	
			var today = new Date();
			var todayinsec = +today;
			// console.log("b4 parse "+ val.tweet_time);
			var datadate= new Date(val.action_date);
			var datadatesec= +datadate;
			// console.log( todayinsec);
			// console.log( datadatesec);//" : Today is within  1 week");
			return ( todayinsec - datadatesec < day*24*60*60*1000); // diff in milli seconds
		});
	}

	
return actionvalues;
	
}

function filterBySession(duration, data ){
	
	clearallfilter = false ; 
	// loadTweets("#twitter-feed");
	var format = d3.time.format("%Y-%m-%d %H:%M:%S");  
	
	var values = [] ;
        		var start = format.parse(sessionStart);
			 	var startdate= new Date(start);
			 	var startdatesec= +startdate;
			 	
		// sessionEnd = sessionData[session-1].session_end;
			 	var end = format.parse(sessionEnd);
			 	var enddate = new Date(end);
			 	var enddatesec = +enddate;
			 	
	   values = data.filter(function(val) {     	

			 // var created_at = format.parse(val.tweet_time);
			 var datadate= new Date(val.tweet_time);
			 var datadatesec= +datadate;
			 // console.log(datadatesec);
			 // console.log(todayinsec);
			 return (  datadatesec <= enddatesec && datadatesec >= startdatesec); 
			 });
	return values;
	
}


function filterActionBySession(duration, data ){
	var format = d3.time.format("%Y-%m-%d %H:%M:%S");  	
	var values = [] ;
	
        		var start = format.parse(sessionStart);
			 	var startdate= new Date(start);
			 	var startdatesec= +startdate;
			 	
		// sessionEnd = sessionData[session-1].session_end;
			 	var end = format.parse(sessionEnd);
			 	var enddate = new Date(end);
			 	var enddatesec = +enddate;
			 	
	   values = data.filter(function(val) {     	

			 // var created_at = format.parse(val.action_date);
			 var datadate= new Date(val.action_date);
			 var datadatesec= +datadate;
			 // console.log(datadatesec);
			 // console.log(todayinsec);
			 return (  datadatesec <= enddatesec && datadatesec >= startdatesec); 
			 });
	return values;
	
}

function subsetTweetPace(name, chart){

// var mydiv = document.getElementById("pace");
 w = widthchart ; 
 h = 360;   
 m = [10, 20, 40, 40];
 w = w - m[1] - m[3];
 h = h - m[0] - m[2]*2;
     
x.range([0, w]);
y.rangeRound([ 0, h]);     

chart.selectAll(".sub-area").remove();
chart.selectAll(".sub-x.axis").remove();
chart.selectAll(".xline").remove();
// d3.selectAll(".desc").remove();

data0 = timelines[name];

// 	
var html = '';// '<h3><a href="#" >'+timelineHeadings[name]+'</a></h3>';
     
// console.log("data 0 "+ data0);
data0 = data0['tweet-pace'];
	// only convert the date format of the latest one, others are already done//
data0.forEach(function(d) {
			// console.log("loop:: "+d.tweet_time);
     		d.tweet_time = format.parse(d.tweet_time);
     		// console.log("again "+d.tweet_time);
     		d.total = +d.total;
		});
var i=0;    
var keys = new Array();

for (var k in timelines ) {
    keys.unshift(k);
}

for (var c = keys.length, n = 0; n < c; n++) {

	key = keys[n];
	// i +=1;
	console.log("inside sub, key= "+key);
	data0 = timelines[key];
    // console.log(data0);
	data0=data0['tweet-pace'];       			
	var values;

	if( duration.indexOf("session")!=-1){
	
		 var session = duration.substring("session".length);
         // console.log("session name="+session);        		
         session = +session;        		
         // console.log(sessionData[session-1].session_start);	
	   	 values = filterBySession(duration, data0);	
	}
	else if( duration.indexOf("custom")!=-1){

         console.log("session name="+sessionStart);        		
         	
	   	 values = filterBySession(duration, data0);	
	}
	else 
	{
		values = filterByDuration(duration, data0);				
	} 

  // // Add the clip path.


var area = d3.svg.line()
    .interpolate("monotone")
    // .tension(0.1)
    .x(function(d) { return x(d.tweet_time); })
    // .y0(h)
    .y(function(d) { return h - y(d.total); });
    
  // Add the area path.
  chart
  .append("svg:path")
      .data(values)
      .attr("class", "sub-area")
       .attr("id",function(){ return "sub-area"+key; })
       .attr("clip-path", "url(#clip)")
       .attr("sharp-rendering","auto")
       .attr("stroke-width", 2)
      .attr("stroke", function(){
      	// console.log("color "+timecolor(d));
      	return timecolor(key);
      })
       .attr("d", area(values),  function(d) { return d.tweet_time ; })
      ;
    
  }
			
}

function animateSubtimelines(chart ){   
	 
var t = chart.transition().duration(1050);
	// console.log("changed ");
for( var key in timelines){
	console.log("key in animate = "+key);
	data0 = timelines[key];
	// console.log(data0);
	data0=data0['tweet-pace'];       
	var values;
	 
	if( duration.indexOf("session")!=-1){	
			var session = duration.substring("session".length);
		    // console.log("session name="+session);        		
		    session = +session;        		
		    // console.log(sessionData[session-1].session_start);		
			values = filterBySession(duration, data0);	
		}
	else if( duration.indexOf("custom")!=-1 ){ // result of brushing 
		values = filterBySession(duration, data0);
	}	
		else 
		{
			values = filterByDuration(duration, data0);
		}
	//redefining area //, may make it global variable 	
	var area = d3.svg.line()
     .interpolate("monotone")
    // .tension(0.2)
    .x(function(d) { return x(d.tweet_time); })
    // .y0(h)
    .y(function(d) { return h - y(d.total); });
  	
	 console.log("data in animate "+ values.length);	      	  
	    //redraw//
	 // now make the changes in the data and the axis // 
   		// t.select("#x-"+key).call(xAxis);
     t.select("#sub-area"+key).attr("d", area(values,  function(d) { return d.tweet_time; } ));
            
    // }  // if end 
 
   }//loop end
  	
}

function brushstart(chart){	
     chart.select(".x.brush").selectAll("rect").attr("fill","green");
}

function brush() {
	
  console.log("inside brush ");
  var e = brushing.extent();
  
  x.domain(brushing.empty() ? x.domain() : e );
  
  console.log("extent "+brushing.extent()[0]);
  console.log(format(e[0]));
  console.log("extent "+brushing.extent()[1]);
  console.log(format(e[1]));
  
  sessionEnd  = format( e[1]) ;
  sessionStart= format( e[0]) ;
  
  // x brush  
  // d3.select(".x.brush").remove();
  duration="custom"; 
  
  
  // brushing.empty();  
}
	
function createTimeline(data, timeduration){

var mydiv = document.getElementById("pace");
widthchart = parseInt(mydiv.offsetWidth);
var w = widthchart; 
var allheight = parseInt(mydiv.offsetHeight);
// alert(w);
duration = timeduration ;

var h = 360;
var height = h;
   
var m = [10, 20, 40, 40];
 w = w - m[1] - m[3];
 h = h - m[0] - m[2]*2;
    
x.range([0, w]);
y.rangeRound([ 0, h]);   

var area = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.tweet_time); })
    // .y0(h)
    .y(function(d) { return h - y(d.total); });  

var actions = data['action'];
var retweets = data['retweets'];
var data0 = data['tweet-pace'];        

data0.forEach(function(d) {
			// console.log("loop:: "+d.tweet_time);
     		d.tweet_time = format.parse(d.tweet_time);
     		// console.log("again "+d.tweet_time);
     		d.total = +d.total;
		});

retweets.forEach(function(d) {
			// console.log("loop:: "+d.tweet_time);
     		d.tweet_time = format.parse(d.tweet_time);
     		// console.log("again "+d.tweet_time);
     		d.total = +d.total;
		});
		
		
actions.forEach(function(d) {
			// console.log("loop:: "+d.tweet_time);
     		d.action_date = format.parse(d.action_date);
     		// console.log("action "+d.action_date);
		});
		

chart = d3.select("#pace").append("svg:svg")
	// .attr("class","mainset")   
     .attr("background-color","white")
     .attr("width", w + m[1] + m[3])
     .attr("height", height)
     // .attr("shape-rendering", "crispEdges")
     .append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")")
     .attr("class","main")
     ;
    
    // console.log(chart.attr("class"));
   
  // Add the clip path.
  chart.append("svg:clipPath")
      .attr("id", "clip")
    .append("svg:rect")
      .attr("width", w)
      .attr("height",h );
      
var actionvalues, values, rets;

if( duration.indexOf("session")!=-1){
	
	var session = duration.substring("session".length);
         console.log("session name="+session);        		
         session = +session;        		
         console.log(sessionData[session-1].session_start);
	
	    sessionStart = sessionData[session-1].session_start;
	    sessionEnd = sessionData[session-1].session_end;
	//filter by session 
	actionvalues = filterActionBySession(duration, actions);
	values = filterBySession(duration, data0);
	rets = filterBySession(duration, retweets);
	
}
else 
{
	actionvalues = filterActionByDuration(duration, actions);
	values = filterByDuration(duration, data0);
	rets = filterByDuration(duration, retweets);
	sessionEnd='';
	sessionStart='';
}
// console.log(" after "+actionvalues);
  var mintweet =   d3.min( values, function(d) { return d.tweet_time; });  
  var minact =   d3.min( actionvalues, function(d) { return d.action_date; });  
  var maxtweet = d3.max( values, function(d) { return d.tweet_time; });  
  var maxact = d3.max( actionvalues, function(d) { return d.action_date; });
  
  
x.domain([ d3.min( [minact,mintweet]), d3.max( [maxact, maxtweet] )]);

xAxis = d3.svg.axis().scale(x).tickFormat(parse2).tickSize(4).ticks(d3.time.days, 1);//.tickSubdivide(true);

y.domain([0, d3.max(values, function(d) { return d.total; })]); 
yAx.domain( [0, d3.max(values, function(d) { return d.total; })] ).rangeRound([ h, 0]);		
// if(duration=='1'){
		// var parse3 = d3.time.format("%M-%I");
		// xAxis= d3.svg.axis().scale(x).tickFormat(parse3).ticks(d3.time.minutes,30);		
	// }
yAxis = d3.svg.axis().scale(yAx).ticks(5).orient("left").tickSize(2);
d3.select("#tweet-count").text(d3.sum(values, function(d ){ return d.total; }));  		
  
  // Add the area path.
chart
  .append("svg:path")
      .attr("class", "area")
       .attr("clip-path", "url(#clip)")
       .attr("sharp-rendering","auto")
      .attr("d", area(values),  function(d) { return d.tweet_time ; });

  // chart.append("svg:path")
      // .attr("class", "ret-area")
       // .attr("clip-path", "url(#clip)")
       // .attr("sharp-rendering","auto")
      // .attr("d", area(rets), function(d) { return d.tweet_time ; });

   
/////////////

chart.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h+ ")")
      .call(xAxis);
      
chart.select(".x.axis").selectAll("text")
.attr("shape-rendering","crispEdges")
.attr("transform","translate( -10,"+ 1 +"), rotate(-45)");
      
                          
//now triangles in anotation //
var notes = chart.selectAll("path")
     .data(actionvalues)
 	 .enter().append("svg:path")
 	 .attr("class","triangle")
 	 .attr("id" , function(d){
 	 	return "triangle-"+d.tweet_id;
 	 })
 	 .attr("d", function(d){
     	return "M"+ x(d.action_date)+","+(height-45)
     	+" L"+(x(d.action_date)-8)+","+( height-20)
     	+" L"+(x(d.action_date)+8)+","+( height-20)
     	+" Z";
     })
     .attr("shape-rendering", "auto")
     .attr("stroke","gray")
     .attr("fill", "#f7e967")
     ;

var dots = chart.selectAll("circle")
     .data(values)
 	 .enter().append("svg:circle") 	 
 	 .attr("cx", function(d){ return x(d.tweet_time); })
	 .attr("cy", function(d){ return h - y(d.total);})
	 .attr("r", 1);


 	 
dots.append("title").text( function(d){
			return "at: "+d.tweet_time + ", total tweets: " + d.total;	 	
	 })   ;

var actionmarks = chart.selectAll("line")
     .data(actionvalues)
 	 .enter().append("svg:line")
 	    .attr("id", function(d){
 	    	return "line-"+d.tweet_id; 	    	
 	    })
     	.attr("x1", function(d ){ return x(d.action_date);})
     	.attr("x2", function(d) { return x(d.action_date);} )
     	.attr("class","anotateline")
     	.attr("y1", 0)
     	.attr("y2", height ) 
     	.attr("stroke","black")
     	.attr("visibility","hidden")   	
     	; 
//toggle visibility of marker lines on click on the triangles       	     	
notes
  .on("click", function(d){       	
   	// console.log("click "+d.tweet_id);
   	var e = document.getElementById("line-"+d.tweet_id);
   	
   	// console.log("name "+ e);
   	if(e.getAttribute("visibility")=="hidden"){
   		e.setAttribute("visibility","visible");
   		var tweetdiv = document.getElementById(d.tweet_id);
    	var feeddiv =  document.getElementById("twitter-feed");
    	if(tweetdiv!=null){
	       		tweetdiv.style.backgroundColor = '#f7e967';     
     			scrollIntoView(tweetdiv,feeddiv); 
     			}   		
   		}
   	   else if(e.getAttribute("visibility")=="visible"){
   	   	e.setAttribute("visibility","hidden");
   	   		var tweetdiv = document.getElementById(d.tweet_id);
    		var feeddiv =  document.getElementById("twitter-feed");
    		if(tweetdiv!=null){
   	   			tweetdiv.style.backgroundColor = 'white';
     	   		$(fedddiv).scrollTop(); 
     	   		}     	   		
   	}
   		// alert("clicked");	
   	 });   	     	

notes.append("title").text(function(d) { return d.action_note+","+d.action_date; });
  
chart.append("line")
     .attr("x1", 0)
     .attr("x2", w)
     .attr("y1", h - .5)
     .attr("y2", h - .5)
     .style("stroke", "#000");  
  // Add the y-axis.


chart.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + -10 + ",0)")
      .call(yAxis);          
  

brushing = d3.svg.brush()
				 	   .x(x)
				       .on("brushstart", function(){ return brushstart(chart); })
				       .on("brushend", function(){
				       	//making the custom value as the current selected option //
				       	           $("#duration option[value='custom']").attr('selected', 'selected');
				       	 
				       				brush();
				       				duration = "custom";
				       		
			            			userFilter='';
			            			hashtag='TtW12';		
			              			// if(notweets==false)
			            			{		            			     			
				            			//clear other filters: user and tag, before loading the new feed.				            					            			
				            			renderTweetPace(data,duration, chart);	
				            			animateSubtimelines(chart);
				            			getTagCloud("#tagcloud");
				            			renderUserTable("#users");
			            			}	
			            			loadTweets("#twitter-feed");
				       		  }				     
				       	)
				       ;
				       
				  chart.append("g")
				      .attr("class", "x brush")
				      .call(brushing)
				    .selectAll("rect")
				      .attr("y",0)
				      .attr("height",h-5 ); 
  //////          
            
            
  return chart;   	
}
   // for redraw after filtering //
function renderTweetPace( data, timeduration, chart  ){
// $("select").change(function () {
	
   duration = timeduration;
   console.log("duration "+duration);
	
	var actionvalues, values, rets;
	// var mydiv = document.getElementById("pace");
	var w = widthchart ;  
	// var allheight = parseInt(mydiv.offsetHeight);
	// alert(w);
	var h = 360;
	var height = h ;
	   
	var m = [10, 20, 40, 40];
	 w = w - m[1] - m[3];
	 h = h - m[0] - m[2]*2;

var actions = data['action'];
var retweets = data['retweets'];
var data0 = data['tweet-pace'];  
 
if( duration.indexOf("session")!=-1){
	
	var session = duration.substring("session".length);
         // console.log("session name="+session);        		
         session = +session;        		
         console.log(sessionData[session-1].session_start);
	
	    sessionStart = sessionData[session-1].session_start;
	    sessionEnd = sessionData[session-1].session_end;
	    
	    
	    var start = format.parse(sessionStart);
		var d = new Date(start);
		d = +d;
		
		var end = format.parse(sessionEnd);
		var e = new Date(end);
		e = +e;
		if(e-d <= 2*24*60*60*1000){
			parse2 =  d3.time.format("%d-%b %I:%M%p"); 
			// xAxis = d3.svg.axis().scale(x).tickFormat(parse2).tickSize(4).ticks(d3.time.days, 1);//.tickSubdivide(true);
			xAxis.tickFormat(parse2).ticks(d3.time.minutes, 30);
			
		}
		else{
			parse2 =  d3.time.format("%d-%b"); 
			// xAxis = d3.svg.axis().scale(x).tickFormat(parse2).tickSize(4).ticks(d3.time.days, 1);//.tickSubdivide(true);
			xAxis.tickFormat(parse2).ticks(d3.time.days, 1);
		}
	
	//filter by session 
	actionvalues = filterActionBySession(duration, actions);
	values = filterBySession(duration, data0);
	rets = filterBySession(duration, retweets);
	
}
else if( duration.indexOf("custom")!=-1){	
	// var session = duration.substring("session".length);
    console.log("duration after brush, from "+ sessionStart +" to " + sessionEnd );
	//filter by session 
	var start = format.parse(sessionStart);
	var d = new Date(start);
	d = +d;
	
	var end = format.parse(sessionEnd);
	var e = new Date(end);
	e = +e;
	if(e-d <= 2*24*60*60*1000){
		parse2 =  d3.time.format("%d-%b %I:%M%p"); 
		// xAxis = d3.svg.axis().scale(x).tickFormat(parse2).tickSize(4).ticks(d3.time.days, 1);//.tickSubdivide(true);
		xAxis.tickFormat(parse2).ticks(d3.time.minutes, 30);
		
	}
	else{
		parse2 =  d3.time.format("%d-%b"); 
		// xAxis = d3.svg.axis().scale(x).tickFormat(parse2).tickSize(4).ticks(d3.time.days, 1);//.tickSubdivide(true);
		xAxis.tickFormat(parse2).ticks(d3.time.days, 1);
	}
	
	actionvalues = filterActionBySession(duration, actions);
	values = filterBySession(duration, data0);
	rets = filterBySession(duration, retweets);	
}
else 
{	console.log(" tick length "+ xAxis.ticks().length);	
	sessionStart='';
	sessionEnd='';
	if (duration =='1'){
		parse2 =  d3.time.format("%d-%b %I:%M%p"); 
		// xAxis = d3.svg.axis().scale(x).tickFormat(parse2).tickSize(4).ticks(d3.time.days, 1);//.tickSubdivide(true);
		xAxis.tickFormat(parse2).ticks(d3.time.minutes, 30);
		
	}
	else{
		parse2 =  d3.time.format("%d-%b"); 
		// xAxis = d3.svg.axis().scale(x).tickFormat(parse2).tickSize(4).ticks(d3.time.days, 1);//.tickSubdivide(true);
		xAxis.tickFormat(parse2).ticks(d3.time.days, 1);
	}
	actionvalues = filterActionByDuration(duration, actions);
	values = filterByDuration(duration, data0);
	rets = filterByDuration(duration, retweets);
}
// console.log(" after "+actionvalues);
  var mintweet =   d3.min( values, function(d) { return d.tweet_time; });  
  var minact =   d3.min( actionvalues, function(d) { return d.action_date; });  
  var maxtweet = d3.max( values, function(d) { return d.tweet_time; });  
  var maxact = d3.max( actionvalues, function(d) { return d.action_date; });
  
  
x.domain([ d3.min( [minact,mintweet]), d3.max( [maxact, maxtweet] )]);

d3.select("#tweet-count").text(d3.sum(values, function(d ){ return d.total; })); 	 
  //showing total number of tweets in the time line // 	
	var area = d3.svg.line()
      .interpolate("monotone")
    .x(function(d) { return x(d.tweet_time); })
    // .y0(h)
    .y(function(d) { return h - y(d.total); });
 // if(values.length>0){
	  // chart = d3.select("#pace").select("svg");   	   	
	var t = chart.transition().duration(1050);
  
	    //redraw//
	  var note = chart.selectAll(".triangle").data(actionvalues , function(d) { return d.action_date;} ); // may change later 
	       
	  note.enter().insert("path")
	     .attr("d", function(d){
	     	return "M"+ x(d.action_date)+","+(height-45)
	     	+" L"+(x(d.action_date)-8)+","+( height-20)
	     	+" L"+(x(d.action_date)+8)+","+( height-20)
	     	+" Z";
	     })
	     .attr("class","triangle")
	      .attr("shape-rendering", "auto")
	     .attr("stroke","gray")
	     .attr("fill", "#f7e967")
	     ;
	     
	   var dot = chart.selectAll("circle").data(values, function(d) { return d.tweet_time;} );
	   
	   dot.enter()
	   .insert("circle")
 	 	.attr("cx", function(d){ return x(d.tweet_time); })
	 	.attr("cy", function(d){ return h - y(d.total);})
	 	.attr("r", 1);
	     
	 dot.selectAll("title").remove();
     dot.append("title").text(function(d) { return d.total+","+d.tweet_time; });
   
	 var actionmark = chart.selectAll(".anotateline").data(actionvalues , function(d) { return d.action_date;} );
	     
 	 actionmark
	 	 .enter().insert("line")
	 	    .attr("id", function(d){
	 	    	return "line-"+d.tweet_id; 	    	
	 	    })
	     	.attr("x1", function(d ){ return x(d.action_date);})
	     	.attr("x2", function(d) { return x(d.action_date);} )
	     	.attr("class","anotateline")
	     	.attr("y1", 0)
	     	.attr("y2", height ) 
	     	.attr("stroke","black")
	     	.attr("visibility","hidden")   	
	     	; 
	     
 note
   .on("click", function(d){       	
   	// console.log("click "+d.tweet_id);
   	var e = document.getElementById("line-"+d.tweet_id);
   	// console.log("name "+ e);
   	if(e.getAttribute("visibility")=="hidden"){
   		e.setAttribute("visibility","visible");
   		var tweetdiv = document.getElementById(d.tweet_id);
    	var feeddiv =  document.getElementById("twitter-feed");
    	if(tweetdiv!=null){
	       		tweetdiv.style.backgroundColor = '#f7e967';     
     			scrollIntoView(tweetdiv,feeddiv); 
     			}   		
   		}
   	   else if(e.getAttribute("visibility")=="visible"){
   	   e.setAttribute("visibility","hidden");
   	   var tweetdiv = document.getElementById(d.tweet_id);
    	var feeddiv =  document.getElementById("twitter-feed");
    	if(tweetdiv!=null){
	   	   tweetdiv.style.backgroundColor = 'white';
     	   		// $(feeddiv).scrollTop();
     	   		 }
   	}
   		// alert("clicked");	
   	 }); 	     	
    
     note.selectAll("title").remove();
     note.append("title").text(function(d) { return d.action_note+","+d.action_date; });
   
   note
       .transition()
       .duration(1050)
       .attr("d", function(d){
     	return "M"+ x(d.action_date)+","+(height-40)
     	+" L"+(x(d.action_date)-8)+","+( height-10)
     	+" L"+(x(d.action_date)+8)+","+( height-10)
     	+" Z";
     });
     
    actionmark
    .transition()
    	.duration(1050).attr("id", function(d){
 	    	return "line-"+d.tweet_id; 	   	
 	    })
     	.attr("x1", function(d ){ return x(d.action_date);})
     	.attr("x2", function(d) { return x(d.action_date);} )
     	.attr("class","anotateline")
     	.attr("y1", 0)
     	.attr("y2", height ) 
     	;
     	
   dot.transition()
    	   .duration(1050)
 	 	.attr("cx", function(d){ return x(d.tweet_time); })
	 	.attr("cy", function(d){ return h - y(d.total);})
	 	.attr("r", 1); 	 
   // Exit…
   note.exit().remove();
   actionmark.exit().remove();
   dot.exit().remove();    
    	//redraw done
    	
    // now make the changes in the data and the axis //        
    // var newdata = t.select(".area").data();
   
    // t.select(".ret-area").attr("d", area(rets,  function(d) { return d.tweet_time; } ));
  //finally reload the tweet stream
    console.log("b4 load, after anim,inside main timeline ");
    clearallfilter = false;	  
  	t.select(".x.axis").call(xAxis);
   	chart.select(".x.axis").selectAll("text")
   	 	.attr("shape-rendering", "crispEdges")
   		.attr("transform","translate( -10,"+ 18 +"), rotate(-45)");
    t.select(".area").attr("d", area( values,  function(d) { return d.tweet_time; } ));
	  
 	chart.select(".x.brush").selectAll("rect").attr("fill","none");
        
}   


function scrollIntoView(element, container) {
  var containerTop = $(container).scrollTop(); 
  var containerBottom = containerTop + $(container).height(); 
  var elemTop = element.offsetTop;
  var elemBottom = elemTop + $(element).height(); 
  if (elemTop < containerTop) {
    $(container).scrollTop(elemTop);
  } else if (elemBottom > containerBottom) {
    $(container).scrollTop(elemBottom - $(container).height());
  }
}

function getTweetPace( div , timeduration ){
	  duration = timeduration;
	  
	  $.ajax({
                type: 'GET',
                url: 'server/getTweetPace.php', // or url:'server/gettweets.php' 
		  		// data: dataString,
                cache: false,
                success: function(data){   	
                	  
                	
                // here call the function to aggregate // assume that we have all the tweets //
                
                
                //////////////////////////////////////////////////////////////////////////////// 	
                	              
            		// countTweets(div1, data['total']);
            		// countUsers(div2, data['users']);	
           		chart = createTimeline(data, duration);
           	  
            	d3.select("#add-time")
					 .html('<a href="javascript:void(0);"> Add time line view of tweet feed</a>')
					 .on("click", function(){
						addMoreTimeLine(chart);
					});					
					
			   $("select").change(function () {
			            			duration = $("select option:selected").val();
			            			console.log("duraton "+duration);		            		
			        		
			            			userFilter='';
			            			hashtag='TtW12';         			
			            			
			            			
			            			// if(notweets==false)
			            			{		            						            			
				            			
				            			//clear other filters: user and tag, before loading the new feed.       			            			
				            			renderTweetPace(data,duration, chart);	
				            			animateSubtimelines(chart);
				            			
				            			getTagCloud("#tagcloud");
				            			renderUserTable("#users");	
			            			}
			            			
			            			loadTweets("#twitter-feed");		            			
			            			
			            			//now render new tag cloud //
			            		
			            		
			            		}).trigger('change'); 
            					
                },
		error: function() {
			// alert('Error loading tweets');
		}
        });	
	
}

function getMentionCounts(){
	  $.ajax({
                type: 'GET',
                url: 'server/getMentionCount.php', // or url:'server/gettweets.php' 
		  		// data: dataString,
                cache: false,
                success: function(data){                
            		// countTweets(div1, data['total']);
            		// countUsers(div2, data['users']);	
            		renderMentionedTweeters(data['mentions']);				
                },
		error: function() {
			// alert('Error loading tweets');
		}
        });		
}

function getUserTweetCounts( div1, div2 ){
	  $.ajax({
                type: 'GET',
                url: 'server/getUserTweetCounts.php', // or url:'server/gettweets.php' 
		  		// data: dataString,
                cache: false,
                success: function(data){                
            		// countTweets(div1, data['total']);
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

function initDBTwitterFeed(div, tag, rpp) {
	if (!tag) tag='';
	$(div).data("start", 1);
	$(div).data("max_id", 0);
	$(div).data("tag", tag);
	$(div).data("search", '');
	$(div).data("rpp", rpp);
	var today = new Date();
	var timezone = today.getTimezoneOffset() * 60;
	timezoneOffset = SERVER_TIMEZONE_OFFSET - timezone;
	// if (fromTime=='' && fiaEventID==0) setInterval('loadNewTweets("'+div+'")', 60000);
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

function addMoreTimeLine(chart){	
	// if(timelines.length>=4){		
		// alert("Cannot add more timeline, please remove existing to add more");
		// return;
	// } 
	
	var key = '';
	key +=duration;
	
	
		//Now generate another query if tag or user filter is on
	// if(userFilter!='' || ( hashtag!='' && hashtag!='TtW12' ) )
	
	{
			var dataString = '';
			
			dataString += 'tag='+hashtag;
				key +=hashtag;
			if(userFilter!='')
			   dataString += '&user='+userFilter;
			   key +=userFilter;
			   
		 	if(duration!='all')   	
				dataString += '&duration='+duration;
			if(showAttendees!="all"){
				dataString += '&show='+showAttendees;
				key+=showAttendees;
			}
	
	if(sessionEnd !=''){		
		dataString += '&sessionStart='+sessionStart;
		
		var start = format.parse(sessionStart);
		var startdate= new Date(start);
		var startdatesec= +startdate;

		key += startdatesec;
		
		start = format.parse(sessionEnd);
		startdate= new Date(start);
		startdatesec= +startdate;

		key += startdatesec;
		
		dataString += '&sessionEnd='+sessionEnd; 
		console.log(sessionEnd);
	} 
			   
			   
	$.ajax({
          type: 'POST',
          url: 'server/getTweetPace.php', // or url:'server/gettweets.php' 
		  data: dataString,
          cache: false,
          success: function(data) {
          	
          	console.log("name = "+ key );
          	timelines[key]= data;
          	timelineHeadings[key] = d3.select("#feed-desc").text();
	        //prepare tag and user for this set //
	        
	        subsetTweetPace(key, chart);        
//  the next line           added for the conf demo ///
	       detailsOfTimeLines();      	
                },
		 error: function() {
			// alert('Error loading tweets in add new ');
		}
        });         	   
        
        ////////////////////////////
        
       $.ajax({
          type: 'POST',
          url: 'server/tagcloud.php', // or url:'server/gettweets.php' 
		  data: dataString,
          cache: false,
          success: function(data2) {          	
          	console.log("name in time tags = "+ key );          	
          	timeTags[key]= data2['tags'];	                	
                },
		 error: function() {
			// alert('Error loading tags');
		}
        }); 
        
        $.ajax({
          type: 'POST',
          url: 'server/getUserTable.php', // or url:'server/gettweets.php' 
		  data: dataString,
          cache: false,
          success: function(data3) {          	
          	console.log("name in time users = "+ key );
          	timeUsers[key]= data3['users'];
	                	
                },
		 error: function() {
			// alert('Error loading tweets');
		}
        });   
//         
          
        // detailsOfTimeLines();  
         
       //////////////////////
		}
	
}

function detailsOfTimeLines(){
	
var keys = new Array();

for (var k in timelines ) {
    keys.unshift(k);
}

// instead of this, I can try prepending the element // # selection.insert(name, before) 
$("#analysis").empty();

var details= d3.select("#analysis");
  
details
 .selectAll("div")
 .data(keys)
 .enter()
 .append("div")
 .attr("id",function(d){ return "summary-"+ d ; })
		.attr("class","hero-in summary")
		.style("background-color","white");  

	var cur = details.selectAll("div");
//cur is the div which elemenets we want to hide or show //
   ///commented out for the confernce //
   
	cur.append("p").append("h3")
	    .text(function(d){ return timelineHeadings[d];})
	    .style("color", function(d ){ return timecolor(d);});
	    
    cur
        .append("div")
        .html( function(d){ return '<a id="tog-'+d+'" href="javascript:void(0)">Toggle</a>'; })
    	.on("click", function( d){
    		console.log("Toggle "+ "details-"+d);	
    		$("#details-"+d).toggle('slow');  	
    	
    });	
    
        
	///start of tags in this line 
   // var maxFontSizeEm = 3;
   // var dates = [] 
   var counts = [];
   // calculating the max and min count values
   
/////////////////////////////
   var inside = cur.append("div").attr("id", function(d){ return  "details-"+d ;});
//   
   inside.append("h6").text("Popular hash tags in the selected steram");
//    
   inside
   // .append("div")
   // .attr("class","hero-unit")   
   .append("div")
   .style("background-color","white")
       .selectAll("div")
   					.data( function(d){ return getTags(d).slice(1,10);} )   					  										
   					.enter().append("div")            		
   					.style("line-height","0.85em")	       
  					.attr("class","tagcloudlink")
   					.style("display","block")   					
   					 .text( function(d){
   					 		 return '#'+d.tag+ ", ("+d.count+")";
   					 	 });
   					 	
/////////////////////////////////////////   					 	

}


function getTags( key ){
   console.log(" get tag in details "+ key);
   var cl = timeTags[key];
   
   return cl;	
}

function getTagsDiv(selection, cl){	
      
   console.log("inside call gettags div ");   
   // var key = d3.select(this).data();
   // console.log(key+" in get tag div ");
   // var cl = timeTags[key];   
   var maxFontSizeEm = 3;
   var dates = [] 
   var counts = [];
   // calculating the max and min count values
   cl.forEach(function(val){
   	 counts.push(+val.count);
   	 dates.push(+format.parse(val.oldest_use) );
   	 // val.oldest_use = +val.oldest_use;
   	    	
   });
   var max = d3.max(counts);
   var min = d3.min(counts);
    
   var mintweet = d3.min( dates );    
   var maxtweet = d3.max( dates );
   // console.log(mintweet);
   // console.log(maxtweet);  

   // var color    = d3.scale.linear().domain([mintweet, maxtweet]).range(["#cc9933","#339900"]);
   var color    = d3.scale.linear().domain([mintweet,(mintweet+maxtweet)/2 ,maxtweet]).range(["brown","yellow","green"]);   
   // var fontsize = d3.scale.linear().domain([min,max]).range(1,maxFontSizeEm);  
   //Normalization helper
   var diff = ( max == min ? 1    // if all values are equal, do not divide by zero
                           : (max - min) / (maxFontSizeEm - 1) ); //optimization: Originally we want to divide by diff
                           // and multiple by maxFontSizeEm - 1 in getNormalizedSize.
   d3.select(this).append("ul")   					  					  					
                    .selectAll("span")
   					.data( cl )
   					.enter().append("span")
            		.attr("class","tagcloudlink")
   					.style("line-height","0.85em")
   					.style("display","block")	
   					.style("float","left")
   					.style("background-color", function(d){ 
   						// console.log(color(+format.parse(d.oldest_use)));
   						return ""+color(+format.parse(d.oldest_use));})   					
   					.text( function(d){
   					 	// return '<a href="javascript:void(0);">#'+d.tag+'&nbsp;</a>';
   					 	return '#'+d.tag; }
  						)
  					.style("line-height","0.8em")						
   					.style("font-size", function(d){
   					 return	 (1 + (d.count - min) / diff)+"em";
   					});
   // return cl;
	
}

function loadTweets(div, clear) {
	var tag = $(div).data("tag");
	var search = $(div).data("search");
	var start = $(div).data("start");
	var rpp = $(div).data("rpp");
	var dataString = 'tag='+tag+'&start='+start+'&rpp='+rpp;
	// if (search) dataString += '&search='+search;
	if (fromUsers) dataString += '&users='+fromUsers.toString();
	if (fiaEventID!=0) dataString += '&event='+fiaEventID;
	if (fromTime!='') dataString += '&from='+fromTime;
	if (toTime!='') dataString += '&to='+toTime;
	console.log(" in load ");
	// alert(dataString);
	if(clearallfilter){
    $.ajax({
          type: 'POST',
          url: 'server/gettweets.php', // or url:'server/gettweets.php' 
		  data: dataString,
          cache: false,
          success: function(data) {
                
          allTweets = data;
          usertweets = allTweets['tweets'];          
                	
		  if (typeof(updateTwitterFeedBeforeShow) == "function") {
				updateTwitterFeedBeforeShow(div, allTweets['total']);
			}
			
		 var more = data['total'] > (start+rpp-1);            
         appendTweets(div, allTweets['tweets'], clear, more);
         
         allActions = usertweets.filter(function(val) {
       		  		 	
			return ( (val.tweet_text.indexOf("#"+"in ")!= -1 || val.tweet_text.indexOf("#"+"iv")!= -1) 
				      && (val.screen_name=='TtW_conf' || val.screen_name=='pjrey' ) ); // diff in milli seconds
		});
         
         
         appendActions("#action-feed", allActions);
         
         d3.select("#tweet-count").text(usertweets.length);     
		 updateTwitterFeedState(div, allTweets);
                },
		 error: function() {
			// alert('Error loading tweets');
		}
        });
       }
       else { // apply all the filtering
	       var feed = d3.select("#feed-desc");
	       
	       feed.html("").style("color","#003333");
	       
	       usertweets = allTweets['tweets'];
	    
	       clear = true;	
	       
	       if(hashtag!='TtW12' && hashtag !=''){
	       	feed.html( function(){
	       		return d3.select(this).text()+  
	       		" with tag <b>#"+ hashtag+"</b>"; });
	       	console.log(hashtag);    
	       	
	    	usertweets= usertweets.filter(function(val) {
	       		 var comp= "#"+hashtag+" ";
	       		 comp= comp.toLowerCase(); 	
	       		 var text = val.tweet_text.toLowerCase(); 	 	
				return ( text.indexOf(comp)!= -1  ); // diff in milli seconds
			});   	     	
	        }    	
    	
       // if there is a use filter 
       if(userFilter !=''){
       	 	feed.html( function(){
       		return d3.select(this).html()+ " from, to and about @<b>"+ userFilter+"</b>" ;});
       		console.log(userFilter);
      
    		usertweets = usertweets.filter(function(val) {  
    		// console.log(val.screen_name);   	    		 
				return ( val.screen_name==userFilter || val.tweet_text.indexOf("@"+userFilter)!=-1); // diff in milli seconds
		});	
			 }
		if(showAttendees == "only"){
       	 	feed.html( function(){
       		return d3.select(this).html()+ " from attendees only" ;});
       		console.log(showAttendees);
      
    		usertweets = usertweets.filter(function(val) {  
    		// console.log(val.screen_name);   	    		 
				return ( ($.inArray(val.screen_name.toLowerCase(),attendeeslist)>=0)); // diff in milli seconds
		});	
			
       }
       
       else if(showAttendees == "none"){
       	 	feed.html( function(){
       		return d3.select(this).html()+ " from non-attendees only" ;});
       		console.log(showAttendees);      
    		usertweets = usertweets.filter(function(val) {  
    		// console.log(val.screen_name);   	    		 
				return ( ($.inArray(val.screen_name.toLowerCase(),attendeeslist)==-1)); // diff in milli seconds
		});	
			
       }	 
       //apply duration filtering //
        // console.log( " feed filter "+  duration );	
        
        if(duration !='all'){		
        	// console.log(" after duration check "+usertweets);
        
        	
       	var format = d3.time.format("%Y-%m-%d %H:%M:%S");       	      		
        	//if session 
        if(duration.indexOf("session")!=-1){
         var session = duration.substring("session".length);
         console.log("session name="+session);        		
		 feed.html( function(){
       		return d3.select(this).html()+" during <b>"+ duration+"</b>"; });
       		 	        
         session = +session;        		
         console.log(sessionData[session-1].session_start);
        		
         // sessionStart = sessionData[session-1].session_start;
        		var start = format.parse(sessionStart);
			 	var startdate= new Date(start);
			 	var startdatesec= +startdate;
			 	
		// sessionEnd = sessionData[session-1].session_end;
			 	var end = format.parse(sessionEnd);
			 	var enddate = new Date(end);
			 	var enddatesec = +enddate;
			 	
	    usertweets = usertweets.filter(function(val) {     	

			 var created_at = format.parse(val.created_at);
			 var datadate= new Date(created_at);
			 var datadatesec= +datadate;
			 return (  datadatesec <= enddatesec && datadatesec >= startdatesec);
		 });
		 
		  
        		
        	}
     else if(duration.indexOf("custom")!=-1){
     	feed.html( function(){     		
       		return d3.select(this).html()+" from <b>"+ sessionStart+"</b> to <b> "+ sessionEnd+"</b>"; });  		 	        
       
        		
         // sessionStart from brush extent ;
        		var start = format.parse(sessionStart);
			 	var startdate= new Date(start);
			 	var startdatesec= +startdate;
			 	
		// sessionEnd = sessionData[session-1].session_end;
			 	var end = format.parse(sessionEnd);
			 	var enddate = new Date(end);
			 	var enddatesec = +enddate;
			 	
	    usertweets = usertweets.filter(function(val) {     	

			 var created_at = format.parse(val.created_at);
			 var datadate= new Date(created_at);
			 var datadatesec= +datadate;
			 return (  datadatesec <= enddatesec && datadatesec >= startdatesec);
		 });
     	
     }   	
        	
     else {
        	//if not session //
       	 feed.html( function(){
       			return d3.select(this).html()+ " since last <b>"+ duration+ " </b> days " });
       			 
		 var day = +duration;    				
    	 usertweets = usertweets.filter(function(val) {     	
			 var today = new Date();
			 var todayinsec = +today;
			 var created_at = format.parse(val.created_at);
			 var datadate= new Date(created_at);
			 var datadatesec= +datadate;
			 // console.log(datadatesec);
			 // console.log(todayinsec);
			 return ( todayinsec - datadatesec <= day*24*60*60*1000); // diff in milli seconds
		 }); 	
		 }
		 }      
       // after all filtering is done //
        console.log("total tweets after filtering: "+ usertweets.length);
		var more = usertweets.length > (start+rpp-1);
		 
		if(usertweets.length<=0){
			notweets = true;
			// alert("No tweets with this filtering condition");
			// return;		
			
		}	
				
	    notweets = false;		  	
		          
		allActions = usertweets.filter(function(val) {       		  		 	
					return ( (val.tweet_text.indexOf("#"+"in ")!= -1 || val.tweet_text.indexOf("#"+"iv")!= -1) 
					        && val.screen_name=='TtW_conf' ); // diff in milli seconds
				});
		        // showing the actions/ interventions only //
		        
		appendActions("#action-feed", allActions);	
			
		feed.html( function(){
		       			return d3.select(this).html()+ " total <b>"+ usertweets.length + "</b> tweets " });
	    appendTweets(div, usertweets, clear, more);		
		updateTwitterFeedState(div, allTweets); // need to change		       			
	       
      } // end of filtered version //
        
};

function loadNewTweets(div) {
	var tag = $(div).data("tag");
	var maxID = $(div).data("max_id");
	var dataString = 'tag='+tag+'&newer='+maxID;
	// if (search) dataString += '&search='+search;
	if (fromUsers) dataString += '&users='+fromUsers.toString();
        $.ajax({
                type: 'POST',
                url: 'server/gettweets.php',
		data: dataString,
                cache: false,
                success: function(data) {
                        // prependTweets(div, data['tweets']);
			// updateTwitterFeedState(div, data);
                },
		error: function() {
			//alert('Error loading tweets');
		}
        });
}

function getTagCloud(div){

	var dataString = '';
	
	// if(tag) 
	dataString +='tag='+hashtag;
	// else
		// dataString +='tag=TtW12';

	if(userFilter!='')
	   dataString+='&user='+userFilter;
	   
	if(duration!='all')   	
		dataString += '&duration='+duration;
	
	if(sessionEnd !=''){		
		dataString += '&sessionStart='+sessionStart;
		dataString += '&sessionEnd='+sessionEnd; 
		console.log(sessionEnd);
	}	
	console.log("data at tag cloud call "+dataString );
	
	$.ajax({
                type: 'POST',
                data: dataString,
                url: 'server/tagcloud.php',
                cache: false,
                success: function(data) {
                	// renderTagCloud(div,data);
                currentTags = data['tags'];	
                tagcloud("tagcloud",data['tags']);
                 
                },
		error: function() {
			tagcloud("tagcloud");
			//alert('Error loading tweets');
		}
        });
	
}

function appendTweets(div, tweets, clear, more) {	
	// console.log(tweets);
	
	if (clear) $(div).empty();
	else $(div+' .loadmore').remove();
	
	console.log(div);
	console.log(tweets.length);
	
	var tweetdiv = d3.select("body").select(div);
	
	tweetdiv.selectAll(div)
     .data(tweets)
     .enter().append("div")
     .html(function(d){ 
     	return getTweetHtml(d, $(div).data("search"));
     	});

	if(more){
		tweetdiv.append("div")
		.attr("class","loadmore")
		.html("<a href=\"javascript:loadTweets('"+div+"', false)\"; return false;\">Load More Tweets</a>");
		
	}
}


function getActionHtml(tweet, highlightStr) {
	
	var createdAtAdjusted = adjustTime(tweet.created_at, timezoneOffset);
	var customTweetClasses = '';
	var html = '<div id="action-"'+tweet.tweet_id +' >\n';
	html += '<div class="tweet-pic">\n';
		// html += '<a href="http://twitter.com/user?screen_name='+tweet.screen_name+'" target="_blank">';		
		html += '<img src="'+tweet.profile_image_url+'" /> ';
		// html += '</a>';
		html += '</div>\n';
		html += '<div>\n';
		// if (highlightTweet) html += '<img src="/images/star.png" style="width:15px; height:15px"> ';
		html += '<b>'+tweet.screen_name+'</b>';
		
		html += '<div>';
		// if (highlightTweet) html += '<img src="/images/star.png" style="width:15px; height:15px"> ';
		html += convertLinks(tweet.tweet_text);
		html += '</div>';
		html += '</div>';
	
	return html;
}

function appendActions(div, tweets) {	
	// console.log(tweets);

	// console.log(div);
	// console.log(" actions "+ tweets.length);
	
	var tweetdiv = d3.select("body").select(div);
	// tweetdiv.selectAll("")
	
	tweetdiv.selectAll("div")
     .data(tweets)
     .enter().append("div")
     .attr("class","hero-unit")
     .style("background-color","#f7e967")
     .style("border","solid")
     .style("border-color","white")
     .attr("id", function(d) {
     	return "action-"+d.tweet_id;
     })
     .html(function(d){ 
     	return getActionHtml(d);
     	})
    .on("click", function(d){  	
    	
    	var e = document.getElementById("line-"+d.tweet_id);
    	
    	if( e.getAttribute("visibility")=="hidden"){ // do something
    		    		
    		// intervention = d.tweet_id;
    		var e = document.getElementById("line-"+d.tweet_id);    		
    		// d3.select("#action-feed").selectAll("div").attr("class","hero-in");
    		e.setAttribute("visibility","visible");
    		
    		var curr="#action-"+d.tweet_id;
    		d3.select("#action-feed").select(curr).style("border-color","gray");
    		
    		
    		var tweetdiv = document.getElementById(d.tweet_id);
	    	var feeddiv =  document.getElementById("twitter-feed");
	    	if(tweetdiv!=null){
	       		tweetdiv.style.backgroundColor = '#f7e967';     
     			scrollIntoView(tweetdiv,feeddiv); 
     			} 
    		
    	} 
   	   else{ // clear 
   	   		var e = document.getElementById("line-"+d.tweet_id);
   	   		e.setAttribute("visibility","hidden");
   	   		intervention = '';
   	   		var curr="#action-"+d.tweet_id;
   	   		d3.select("#action-feed").select(curr).style("border-color","white");
   	   		// d3.select("#action-feed").selectAll("div").attr("background-color","#f7e967");
   	   		
   	   		var tweetdiv = document.getElementById(d.tweet_id);
    		var feeddiv =  document.getElementById("twitter-feed");
    		if(tweetdiv!=null){
   	   			tweetdiv.style.backgroundColor = 'white';
     	   		$(fedddiv).scrollTop(); 
     	   		}
     	    // appendActions("#action-feed", allActions);		     	   		
   	}
    	
    }) 	
     	;
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
	if (highlightTweet) customTweetClasses += " yellow-bg";

	// var highlightWords = highlightStr.split(" ");
	// tweet.tweet_text = highlightText(tweet.tweet_text, highlightWords);

	// if (showFrom) 
	{
		var html = '<div class="tweet'+customTweetClasses+'" '+customTweetStyles+' id='+tweet.tweet_id +' >\n';
		html += '<div class="tweet-pic">\n';
		html += '<a href="http://twitter.com/user?screen_name='+tweet.screen_name+'" target="_blank">';		
		html += '<img src="'+tweet.profile_image_url+'" /> ';
		html += '</a>';
		html += '</div>\n';
		html += '<div class="tweet-text" '+customTweetTextStyles+'>\n';
		// if (highlightTweet) html += '<img src="/images/star.png" style="width:15px; height:15px"> ';
		html += '<a href="http://twitter.com/intent/user?screen_name='+tweet.screen_name+'" target="_blank">'+tweet.screen_name+'</a> ';
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
			//if (re.test(hashParam)) {
				//return before + '<a href="">#' + hash + '</a>';
			//}
			//else {
				return before + '<a href="?tag='+hashParam+'">#' + hash + '</a>';
			//}
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

