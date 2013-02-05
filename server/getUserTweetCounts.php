<?php
include "fia.inc";
// returns the users with their corresponding twet counts with the hashtag
// @sopan:///find top tweeters : SELECT users.user_id, users.screen_name, 

$db = connectToTweetDatabase();
mysql_query("set names 'utf8'",$db);

$sql = "SELECT users.user_id, users.screen_name, COUNT( tweets.tweet_id) as alltweets FROM users,tweets  
where tweets.user_id=users.user_id group by users.user_id order by alltweets desc limit 5;";



$result = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($result)) {
	$tweets[] = $row;
	//if ($row['entities']) $tweets[count($tweets)-1]['entities'] = unserialize(base64_decode($row['entities']));
	// if ($row['tweet_id']>$maxID) $maxID = $row['tweet_id'];
}

// $count = mysql_numrows($result);
$result = array();
//$result['debug'] = $sql;

$count = getCount("select count(*) from tweets;", $db);

$result['total'] = $count;
$result['users'] = getCount("select count(*) from users;", $db);
// $result['max_id'] = $maxID;
$result['tweets'] = $tweets;
 mysql_close($db);
header('Content-type: application/json');
echo json_encode($result);

?>
