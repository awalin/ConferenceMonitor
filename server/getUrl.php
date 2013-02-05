<?php

//made changes to the query for tags// @sopan

include "fia.inc";

$MIN_FONT_SIZE = 10;
$MAX_FONT_SIZE = 30;



$db = connectToTweetDatabase();
mysql_query("set names 'utf8'",$db);	
$result = mysql_query("SELECT url, count(url) as ct FROM tweet_urls group by url order by ct desc limit 5;", $db);

while($row = mysql_fetch_array($result)) { 
	$urls[] = $row;
} 
$result= array();
$result['urls']=$urls;
header('Content-type: text/html');
echo json_encode($result['urls']);

?>


