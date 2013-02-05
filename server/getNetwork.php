<?php
include "fia.inc";
$db = connectToTweetDatabase();
mysql_query("set names 'utf8'",$db);

// $sql = "SELECT users.user_id, users.screen_name, COUNT( tweets.tweet_id) as alltweets FROM awalin.users,awalin.tweets  where tweets.user_id=users.user_id group by users.user_id order by alltweets desc limit 10;";
$sql = "SELECT * from users where user_id  
	in ( SELECT source_user_id from tweet_mentions UNION SELECT target_user_id from tweet_mentions);";

// $result = mysql_query($sql, $db);
// 
// $row = mysql_fetch_assoc($result);
// $line = "";
// $comma = "";
// foreach($row as $name => $value) {
    // $line .= $comma . '"' . str_replace('"', '""', $name) . '"';
    // $comma = ",";
// }
// $line .= "\n";
$fp = fopen("query-result", "w");
// fputs($fp, $line);
// 
// // remove the result pointer back to the start
// mysql_data_seek($result, 0);
// 
// // and loop through the actual data
// while($row = mysql_fetch_assoc($result)) {
//    
    // $line = "";
    // $comma = "";
    // foreach($row as $value) {
        // $line .= $comma . '"' . str_replace('"', '""', $value) . '"';
        // $comma = ",";
    // }
    // $line .= "\n";
    // fputs($fp, $line);
//    
// }
//get the nodes
$result = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($result)) {
	$nodes[] = $row;
}
// now get the edges 
$sql = "SELECT * FROM awalin.tweet_mentions where 
		source_user_id in (select user_id from users) and 
		target_user_id in ( select user_id from users);";
$result = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($result)) {
	$edges[] = $row;
}
// $count = mysql_numrows($result);

 mysql_close($db);
 
$finalresult = array();
$finalresult['nodes'] = $nodes;
$finalresult['edges'] = $edges;

fputs($fp, json_encode($finalresult));

fclose($fp);

header('Content-type: application/json');
echo json_encode($finalresult);

?>
