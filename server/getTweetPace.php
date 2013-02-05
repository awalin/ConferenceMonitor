<?php
include "fia.inc";
$db = connectToTweetDatabase();

$attendees_list=" ( 'kthompsp' ,  'paolaricaurte' ,  'davidsancar' ,  'jvitak' ,  'katieshilton' ,
 'alicetiara' ,  'da_banks' ,  'thomas_wendt' ,  'katypearce' ,  'stineeckert' ,
 'yanyiluo' ,  'call_me_ismail' ,  'murilomachado' ,  'rlynn82' ,  'bibliotecariaT' ,
 'mayadotlivio' ,  'bridgettediann' ,  'jsantley' ,  'supernova7' ,  'pgde' ,
 'MacherM' ,  'sashenka87' ,  'kwhite1184' ,  'earlvarona' ,  'anthropunk' ,  'aporya' ,
 'Flipchik85' ,  'digiwonk' ,  'kzickuhr' ,  'Cre8tiveLib' ,  'aimeebe' ,
 'jarahmoesch' ,  'jessyrob' ,  'mkoliska' ,  'Jup83' ,  'Greene_DM' ,  'academicdave' ,
 'jhfrith' ,  'chenhuang' ,  'jarommcdonald' ,  'LibrariansFTW' ,
 'grimacetjackson' ,  'dynamicsymmetry' ,  'sladner' ,  'alogicalfallacy' ,
 'savasavasava' ,  'phenatypical' ,  'lportwoodstacer' ,  'kathleenkr' ,
 'afamiglietti' ,  'tgibson1989' ,  'livlab' ,  'whimsylohan' ,  'marginalutility' ,
 'eridowd' ,  'pjrey' ,  'nullhandle' ,  'heathermbro' ,  'anneohirsch' ,
 'nicolchasedream' ,  'wildebees' ,  'jenoldyoung' , 'farman' ,  'maizeandblue' ,
 'gmugar' ,  'purplekimchi' ,  'YussefJagatic' ,  'severinearsene' ,  'kathlvaughn' ,
 'andrewhazlett' ,  'ddchamberlain' ,  'supernova7' ,  'sladner' ,  'LibrariansFTW' ,
 'GIS_Libraries' ,  'sonofodin0913' ,  'kdclibsci' ,  'james3neal' ,
 'danicambauva' ,  'mokogobo' ,  'BenjaminTarsa' ,  'mschandorf' ,  'AMRigby12' ,
 'jdefontes' ,  'jranck' ,  'OhShnit' ,  'call_me_ismail' ,  'SarahAWebster' ,
 'donaldtaylorii' )";

mysql_query("set names 'utf8'",$db);

$tag = getURLValue('tag');
$user = getURLValue('user');
$show = getURLValue('show');

$where = '';

if($tag){
	// $tag ="#".$tag;
	$where = " where tweet_text like '%#$tag%' ";	
}

if($user){
	if(empty($where))
		$where = " where screen_name='$user' or tweet_text like '%@$user%' ";
	else $where .= " and screen_name='$user' or tweet_text like '%@$user%' ";
}

if($show){
	if($show=="only"){
	if(empty($where))
		$where = " where screen_name in ( select screen_name from attendees)";
	else $where .= " and sscreen_name in ( select screen_name from attendees)";
	}
	else if($show=="none"){
	if(empty($where))
		$where = " where screen_name not in  ( select screen_name from attendees)";
	else $where .= " and screen_name not in  ( select screen_name from attendees)";
	}
	
}

// $sql = "SELECT users.user_id, users.screen_name, COUNT( tweets.tweet_id) as alltweets FROM awalin.users,awalin.tweets  where tweets.user_id=users.user_id group by users.user_id order by alltweets desc limit 10;";
// $sql = "SELECT count(tweet_id) as total, 
// DATE_SUB( DATE_SUB(created_at, INTERVAL MINUTE(created_at) MINUTE), INTERVAL SECOND(created_at) SECOND ) as tweet_time 
// FROM tweets ".$where." group by tweet_time;";

//aggregates tweets every 10 minutes//
$sql="SELECT  count(tweet_id) as total,FROM_UNIXTIME(UNIX_TIMESTAMP(created_at)- UNIX_TIMESTAMP(created_at)%(10*60)) AS tweet_time
	FROM     tweets
	 ".$where." 
	GROUP BY tweet_time;" ;

// echo $sql;
$result = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($result)) {
	$tweets[] = $row;
}

// $count = mysql_numrows($result);
$result = array();

$result['tweet-pace'] = $tweets;

////now show anotation // commented out, only show the #INT for now . 
$sql = "select tweet_id, action_date , action_note from anotation;";

$anot = mysql_query($sql, $db);

if ( !empty($anot)) 
{
 while ($row = mysql_fetch_assoc($anot)) {
	 $actions[] = $row;
 }

$result['action'] = $actions;
}

$sql="select tweet_id, created_at as action_date , tweet_text as action_note 
from tweets 
where tweet_text like '%#iv%'
order by created_at desc;";
// $sql = "select created_at as action_date , tweet_text as action_note from tweets where tweet_text like '%#INT%';";
$anotate = mysql_query($sql, $db);
if (!empty($anotate)) {
while ($row = mysql_fetch_assoc($anotate)) {
	$actions[] = $row;
}

// $result['action']= array_merge($result['action'],$actions );
$result['action'] = $actions;

}
//only retweets 
$sql = "SELECT count(tweet_id) as total, DATE_SUB( DATE_SUB(created_at, INTERVAL MINUTE(created_at) MINUTE), INTERVAL SECOND(created_at) SECOND ) as tweet_time FROM tweets 
	   where tweets.tweet_text like  '%RT @%' group by tweet_time order by created_at desc;";

// retweets can be Zero, so made this check // 

$retweets = mysql_query($sql, $db);
if ( !empty($retweets) ) {
	while ($row = mysql_fetch_assoc($retweets)) {
		
		$ret[] = $row;
	}
	$result['retweets'] = $ret;
}



//only originals
$sql = "SELECT count(tweet_id) as total, DATE_SUB( DATE_SUB(created_at, INTERVAL MINUTE(created_at) MINUTE), 
	   INTERVAL SECOND(created_at) SECOND ) as tweet_time FROM tweets 
	   where tweets.tweet_text not like  '%RT @%' group by tweet_time order by created_at desc;";

$originals = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($originals )) {
	$origin[] = $row;
}
$result['originals'] = $origin;

mysql_close($db);
 
header('Content-type: application/json');
echo json_encode($result);


?>
