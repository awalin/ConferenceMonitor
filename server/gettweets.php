<?php
include "fia.inc";

$BASE_TAG = 'TtW12';

$tag = getURLValue('tag');
$users = getURLValue('users');
$search = getURLValue('search');
$event = getURLValue('event');
$from = getURLValue('from');
$to = getURLValue('to');

$newer = getURLValue('newer');
$start = getURLValue('start');
if (!$start) $start = 1;

$db = connectToTweetDatabase();
mysql_query("set names 'utf8'",$db);

$tables = "tweets";
$where = '';
$orderby = "order by created_at desc";
$limit = '';

if ($tag) {
	$tables = "tweets, tweet_tags";
	if (empty($where)) $where = 'where ';
	else $where .= 'and ';
	$where .= "tweets.tweet_id=tweet_tags.tweet_id and ";
	$tagcond = "tweet_tags.tag='".addslashes($tag)."' ";
	if ($tag == "idea" || $tag == "ideas") $tagcond = "(tweet_tags.tag='idea' || tweet_tags.tag='ideas') ";
	if ($tag == "event" || $tag == "events") $tagcond = "(tweet_tags.tag='event' || tweet_tags.tag='events') ";
	$where .= $tagcond;
	if ($users) {
		$where .= "and (";
		$userArray = explode(",", $users);
		$i = 0;
		foreach ($userArray as $user) {
			if ($i>0) $where .= " or ";
			$where .= "screen_name='$user'";
			$i++;
		}
		$where .= ") ";
	}
}
else if ($users) {
	if (empty($where)) $where = 'where ';
	$where .= " (";
	$userArray = explode(",", $users);
	$i = 0;
	foreach ($userArray as $user) {
		if ($i>0) $where .= " or ";
		$where .= "screen_name='$user'";
		$i++;
	}
	$where .= ") ";
}
else if ($from) {
	if (empty($where)) $where = 'where ';
	$where .= "created_at>=STR_TO_DATE('$from', '%Y-%m-%d %H:%i')";
	if ($to) {
		$where .= " and created_at<=STR_TO_DATE('$to', '%Y-%m-%d %H:%i')";
	}
	$orderby = "order by created_at";
}

if ($newer) {
	$newerThan = getURLValue('newer');
	if (empty($where)) $where = 'where ';
	else $where .= 'and ';
	$where .= "tweets.tweet_id>$newerThan ";
	$orderby = "order by created_at desc";
}

if (!$newer) {
	$offset = $start - 1;
	// $limit = "limit $offset, $rpp";
}

// $count = getCount("select count(*) from $tables $where", $db);

$maxID = 0;
$tweets = array();

// $sql = "select * from $tables $where $orderby ;";// $limit"; //sopan: load all tweets

$sql= "SELECT tweet_id, tweet_text, created_at, user_id, screen_name, profile_image_url FROM tweets order by created_at desc;";

$result = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($result)) {
	$tweets[] = $row;
	//if ($row['entities']) $tweets[count($tweets)-1]['entities'] = unserialize(base64_decode($row['entities']));
	if ($row['tweet_id']>$maxID) $maxID = $row['tweet_id'];
}

 $count = getCount("select count(*) from tweets;", $db);
 mysql_close($db);
 
 
 
$result = array();
//$result['debug'] = $sql;
$result['total'] = $count;
$result['max_id'] = $maxID;
$result['tweets'] = $tweets;

header('Content-type: application/json');
echo json_encode($result);

?>
