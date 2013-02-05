<?php 

include "fia.inc";
$db = connectToTweetDatabase();
mysql_query("set names 'utf8'",$db);

$BASE_TAG = 'TtW12';

$duration = getURLValue('duration');
$sessionEnd = getURLValue('sessionEnd');
$sessionStart = getURLValue('sessionStart');

$tag = getURLValue('tag');

$where0 = " and tweet_mentions.tweet_id in ( select tweets.tweet_id from tweets  ";
$where2=" and tweets.tweet_id in ( select tweets.tweet_id from tweets  ";
$where="";

if($duration){
 if($sessionEnd){

	$where .= " created_at<=STR_TO_DATE('$sessionEnd', '%Y-%m-%d %H:%i:%s')";
	$where .= " and created_at>=STR_TO_DATE('$sessionStart', '%Y-%m-%d %H:%i')";
}
else {

	$where .= " created_at>= DATE_SUB( NOW(), INTERVAL $duration DAY)";
}
}

if($tag && $tag!=$BASE_TAG){
	if(!empty($where))
		// $where .= " where ";
	// else 
	$where .=" and ";
	$where .= "  tweet_text like '%#$tag%' ";	
}

if(!empty($where)){
	$where2.=" where ". $where;
	$where2.=") ";	
}
else {
	$where2="";
}
 

$sql1="create or replace view userdata as
SELECT users.screen_name, users.user_id ,
       COUNT( tweets.tweet_id) as alltweets ,       
       users.followers_count, users.friends_count 
      ,  DATE(users.last_update) as last_update          
       FROM users ,tweets  
       where tweets.user_id = users.user_id 
       $where2
       group by users.user_id 
       order by alltweets desc;";
	        
 mysql_query($sql1, $db);


if(!empty($where)){
	$where0.=" where ". $where;
	$where0.=") ";	
}
else {
	$where0="";
}
       
$sql2="create or replace view mentionsdata as
 SELECT target_user_id as user_id,
       COUNT( tweet_mentions.tweet_id) as mentions,
       count(distinct tweet_mentions.source_user_id) as mentioned_by
       from  tweet_mentions, users
       where target_user_id=users.user_id 
       $where0 
       group by target_user_id
       order by mentions desc;";
mysql_query($sql2, $db);
	   
      // ,      last_update  , friends_count as friends               
$sql="select screen_name, alltweets as total_tweets, followers_count as followers
     
     , COALESCE(mentions, 0) AS mentioned_in
     , COALESCE(mentioned_by, 0) AS mentioned_by
   
      from userdata left join mentionsdata 
      on 
      userdata.user_id = mentionsdata.user_id
      order by alltweets desc;";
$result= mysql_query($sql, $db);
	  
// $sql = "SELECT count(tweet_id) as total, DATE_SUB( DATE_SUB(created_at, INTERVAL MINUTE(created_at) MINUTE), INTERVAL SECOND(created_at) SECOND ) as tweet_time FROM tweets 
	   // where tweets.tweet_text like  '%RT @%' group by tweet_time order by created_at desc;";
	  
	  
// $result = mysql_query($sql, $db);

while ($row = mysql_fetch_assoc($result)) {
	$users[] = $row;
}
$result = array();
$result['users'] = $users;
$result['qry1']=$sql1;
$result['qry2']=$sql2;
	  
mysql_close($db);
header('Content-type: application/json');
echo json_encode($result);	  
	  

?>