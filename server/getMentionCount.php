<?php
include "fia.inc";
// returns the users with their corresponding twet counts with the hashtag
// @sopan:///find top tweeters : SELECT users.user_id, users.screen_name, 
// //COUNT( tweets.tweet_id) as alltweets FROM awalin.users,awalin.tweets  
// //where tweets.user_id=users.user_id group by users.user_id order by alltweets desc limit 10; 

// $db = connectToDatabase();
// mysql_query("set names 'utf8'",$db);
// 
// if ($event) {
	// $result = mysql_query("select *,date_format(date,'%M %e, %Y') as fdate, time_format(start_time,'%l:%i %p') as 
	// fstart_time, time_format(end_time,'%l:%i %p') as fend_time, subdate(concat(date, ' ', start_time), interval 15 minute) 
	// as from_time, adddate(concat(date,' ',end_time), interval 15 minute) as to_time from events where id=$event", $db);
	// if ($row = mysql_fetch_assoc($result)) {
		// $from = $row['from_time'];
		// $to = $row['to_time'];
	// }	
// }

$db = connectToTweetDatabase();
mysql_query("set names 'utf8'",$db);
//target user id 
$sql="SELECT COUNT(source_user_id) as mention, 
      screen_name  FROM tweet_mentions,users 
      where target_user_id=user_id group by target_user_id order by mention desc limit 5;";

// $sql = "SELECT users.user_id, users.screen_name, COUNT( tweets.tweet_id) as alltweets FROM awalin.users,awalin.tweets  where tweets.user_id=users.user_id group by users.user_id order by alltweets desc limit 10;";

$result = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($result)) {
	$tweets[] = $row;
	//if ($row['entities']) $tweets[count($tweets)-1]['entities'] = unserialize(base64_decode($row['entities']));
	// if ($row['tweet_id']>$maxID) $maxID = $row['tweet_id'];
}
$result = array();
//$result['debug'] = $sql;
$count = getCount("select count(*) from tweet_mentions;", $db);
$result['total'] = $count;
// $result['users'] = getCount("select count(*) from awalin.users;", $db);
// $result['max_id'] = $maxID;
$result['mentions'] = $tweets;

header('Content-type: application/json');
echo json_encode($result);

?>