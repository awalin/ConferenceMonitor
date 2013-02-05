<?php
include "fia.inc";

$result = loginInit(true);
$login = $result[0];
$db = $result[1];

// check if logged in
if (!isMemberLoggedIn($login)) {
       sendError('Must login to view members');
}

$range = getURLValue('range');
if (!$range) $range='A-B';

$abc = array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
$where = "where saved_by_user=1 and share_info=1";
$orderby = "order by last_name";

$rangeWhere = $where;
$tokens = explode("-", $range);
$start = $tokens[0];
if (count($tokens)==1) {
	$rangeWhere .= " and last_name like '$start%'";
}
else if (count($tokens)==2) {
	$end = $tokens[1];
	$endIndex = array_search($end, $abc);
	if ($end!='Z' && $endIndex!==FALSE) {
		$end = $abc[$endIndex+1];	
	}
	else {
		$end = '';
	}
	if ($start) $rangeWhere .= " and last_name>='$start'";
	if ($end) $rangeWhere .= " and last_name<'$end'";
}

$total = getcount("select count(*) from members $where", $db);
$count = getCount("select count(*) from members $rangeWhere", $db);

$members = array();
$sql = "select * from members $rangeWhere $orderby"; 
$result = mysql_query($sql, $db);
while ($row = mysql_fetch_assoc($result)) {
	$members[] = $row;
}

$result = array();
//$result['sql'] = $sql;
$result['total'] = $total;
$result['count'] = $count;
$result['members'] = $members;

header('Content-type: application/json');
echo json_encode($result);
?>
