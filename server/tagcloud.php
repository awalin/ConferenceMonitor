<?php

// author: awalin sopan

include "fia.inc";

$BASE_TAG = 'TtW12';

$tag = getURLValue('tag');

$user = getURLValue('user');
$duration = getURLValue('duration');
$sessionEnd = getURLValue('sessionEnd');
$sessionStart = getURLValue('sessionStart');

$where0 = " and tweet_tags.tweet_id in ( select tweets.tweet_id from tweets  ";
$where="";

if($user){
	if(empty($where))
		$where .= " where ";
	else $where .=" and ";
	
	$where.= " screen_name='$user' or tweet_text like '%@$user%'";	
}

if($duration){
 if($sessionEnd){
 	if(empty($where))
		$where .= " where ";
	else $where .=" and ";
	
	$where .= " created_at<=STR_TO_DATE('$sessionEnd', '%Y-%m-%d %H:%i:%s')";
	$where .= " and created_at>=STR_TO_DATE('$sessionStart', '%Y-%m-%d %H:%i')";
}
 else {
	if(empty($where))
		$where .= " where ";
	else $where .=" and ";
	
	$where .= " created_at>= DATE_SUB( NOW(), INTERVAL $duration DAY)";
}
}

// if($BASE_TAG!=$tag) {
// 	
	// $BASE_TAG=$tag;
// }
if($tag){
	if(empty($where))
		$where .= " where ";
	else $where .= " and ";
    $where.=" tweet_text like '%$tag%' ";
}

if(!empty($where)){
	$where0.=$where;
	$where0.=") ";	
}
else {
	$where0="";
}



//if tags by a specific user //
$sqlwithuser = "select tag, COUNT( tag ) as ct from tweet_tags where tag !='ttw12' 
and tweet_tags.tweet_id in ( select tweets.tweet_id from tweets where screen_name='pjrey' )
group by tag order by ct desc limit 15;"; 

$type = 'hashtag';
$showBaseTag = true;
$searchPrefix = '';
$options = '';
$limit = 20;

if($where0==""){
	$limit= 5;
}
$db = connectToTweetDatabase();
mysql_query("set names 'utf8'",$db);
	// and tag!='$BASE_TAG' 
// if ($type == "hashtag") {
	$sql ="select tag, count(tag) as count ,
	min(created_at) as oldest_use 
	from tweets,tweet_tags 
	where tweets.tweet_id=tweet_tags.tweet_id	
	$where0 
	and tag!='$BASE_TAG' 	 
	group by tag order by count desc limit $limit;";
	
$result = mysql_query($sql , $db);

// }
// echo $sql;
if(!empty($result) ){
while($row = mysql_fetch_array($result)) { 
	$tags[] = $row;
} 

$result = array();

$result['tags']= $tags;

}
mysql_close($db);

header('Content-type: application/json');
echo json_encode($result);

?>
