var PROFILE_TAB = 0;
var EVENT_TAB = 1;

var TINY = 1;
var SMALL = 2;
var LARGE = 3;

var TINY_WIDTH = "25px";
var SMALL_FOR_WEBSITE_WIDTH = "35px"; 
var SMALL_WIDTH = "50px";
var LARGE_WIDTH = "80px";

var BASE_HASHTAG = "#TtW12";
//================================================================
// Twitter Feed (Official) 
//================================================================

function initTwitterFeed(id, search, speed, width, height) {
	var rpp = 0;
	var scrollbar = false;
	var loop = true;
	var behavior = 'default';
	
	if (speed == 0) {
		scrollbar = true;
		loop = false;
		behavior = 'all';
		rpp = 10;
	}

        new TWTR.Widget({
                version: 2,
                type: 'search',
                id: id,
                search: search,
		rpp: rpp,
                interval: speed,
                title: 'TTW12 Tweets',
                subject: '',
                width: width,
                height: height,
                theme: {
                        shell: {
                                background: 'none',
                                color: '#ffffff'
                        },
                        tweets: {
                                background: '#ffffff',
                                color: 'black',
                                links: '#be1e2d'
                        }
                },
                features: {
                        scrollbar: scrollbar,
                        loop: loop, 
                        live: true,
                        hashtags: true,
                        timestamp: true,
                        avatars: true,
                        toptweets: false,
                        behavior: behavior
                }
        }).render().start();
}

//================================================================
// Tag Cloud
//================================================================

function loadTagCloud(div, type) {
        var dataString = '';
        if (type) {
                dataString = 'type='+type;
        }
        $.ajax({
                type: 'POST',
                url: '/ttw12/server/tagcloud.php',
                data: dataString,
                cache: false,
                success: function(html) {
                        $(div).html(html);
                }
        });
};

//================================================================
// Misc
//================================================================

function isScrolledIntoView(elem) {
	var docViewTop = $(window).scrollTop();
	var docViewBottom = docViewTop + $(window).height();
	var elemTop = $(elem).offset().top;
	var elemBottom = elemTop + $(elem).height();
	return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) 
		&& (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
}

