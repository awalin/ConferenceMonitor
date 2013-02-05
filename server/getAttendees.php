<?php
include "fia.inc";
$db = connectToTweetDatabase();
mysql_query("set names 'utf8'",$db);

// $sql = "SELECT users.user_id, users.screen_name, COUNT( tweets.tweet_id) as alltweets FROM awalin.users,awalin.tweets  where tweets.user_id=users.user_id group by users.user_id order by alltweets desc limit 10;";
$sql = "select screen_name from attendees;";

$result = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($result)) {
	$tweets[] = $row;
}

// $count = mysql_numrows($result);
$result = array();

$result['attendees'] = $tweets;

mysql_close($db);
 
header('Content-type: application/json');
echo json_encode($result);
?>