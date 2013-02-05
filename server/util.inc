<?php
// 
// $DB_SERVER = "hornbake-313.umd.edu";
// $DB_NAME = "awalin";
// $DB_USER = "awalin";
// $DB_PWD = "awalin";
// $TWEET_DB_NAME = "awalin";
// // 
$DB_SERVER = "localhost";
$DB_NAME = "tets";
$DB_USER = "root";
$DB_PWD = "";
$TWEET_DB_NAME = "test";


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

$attendees=" and users.screen_name in  ".$attendees_list;

//========================================================================
// Database
//========================================================================

function connectToDatabase() {
	return dbConnect($GLOBALS['DB_SERVER'], $GLOBALS['DB_NAME'], $GLOBALS['DB_USER'], $GLOBALS['DB_PWD']);
}

function connectToTweetDatabase() {
	return dbConnect($GLOBALS['DB_SERVER'], $GLOBALS['TWEET_DB_NAME'], $GLOBALS['DB_USER'], $GLOBALS['DB_PWD']);
}

function dbConnect($host, $dbname, $login, $pwd) {
	ob_start();
	$db = mysql_connect($host, $login, $pwd);
	ob_end_clean();
	if (!$db) {
		die("Problem connecting to database.  Please email <a href=\"mailto:awalin@cs.umd.edu\">awalin@cs.umd.edu</a>.");
	}
	mysql_select_db($dbname, $db);
	return $db;
}

function getSqlValue($value, $defaultValue) {
	$sqlValue = $defaultValue;
	if ($value) {
		if (is_array($value)) {
			for ($i=0; count($value); $i++) {
				$value[$i] = mysql_real_escape_string($value[$i]);
			}
			if (!empty($value)) {
				$sqlValue = "'".join(":::", $value)."'";
			}
		}
		else {
			$sqlValue = "'".mysql_real_escape_string($value)."'";
		}
	}

	return $sqlValue;
}

function getSqlSetValue($field, $value, $defaultValue) {
	return "$field=".getSqlValue($value, $defaultValue);
}

function getCount($sql, $db) {
	$count = 0;
	$result = mysql_query($sql, $db);
	if ($row = mysql_fetch_row($result)) {
		$count = $row[0];
	}
	return $count;
}

//========================================================================
// Forms and Controls
//========================================================================

function getURLValue($name) {
	$value = '';
	if (isset($_POST[$name])) $value = $_POST[$name];
	else if (isset($_GET[$name])) $value = $_GET[$name];
	return html_entity_decode(stripslashes($value));
}

function getTextField($name, $value, $width) {
	return "<input class=\"text\" style=\"width:$width\" type=\"text\" name=\"$name\" value=\"$value\"/>";
}

function getTextFieldWithHelp($name, $value, $help) {
	return getTextField($name, $value, "100%")."<div class=\"help\">$help</div>\n";
}

function getTextFieldWithWidthWithHelp($name, $value, $width, $help) {
	return getTextField($name, $value, $width)."<div class=\"help\">$help</div>\n";
}

function printTextFieldRow($label, $name, $value) {
	$value = htmlentities($value);
        echo "<tr>\n";
        echo "<td class=\"label\">$label</td>\n";
        echo "<td>".getTextField($name,$value,"100%")."</td>\n";
        echo "</tr>\n";
}

function printTextFieldRowWithHelp($label, $name, $value, $help) {
	$value = htmlentities($value);
	echo "<tr>\n";
	echo "<td class=\"label\">$label</td>\n";
	echo "<td>".getTextFieldWithHelp($name,$value,$help)."</td>\n";
	echo "</tr>\n";
}

function getTextArea($name, $value, $rows, $cols) {
	return "<textarea name=\"$name\" rows=\"$rows\" cols=\"$cols\">$value</textarea>";
}

function getTextAreaWithWidth($name, $value, $width, $rows) {
	return "<textarea style=\"width:$width\" name=\"$name\" rows=\"$rows\">$value</textarea>";
}

function getTextAreaWithHelp($name, $value, $rows, $help) {
	return getTextAreaWithWidth($name, $value, "100%", $rows)."<div class=\"help\">$help</div>\n";
}

function printTextAreaSpan($name, $value, $rows, $span) {
	echo "<tr>\n";
	echo "<td colspan=\"$span\">".getTextAreaWithWidth($name,$value,"100%",$rows)."</td>\n";
	echo "</tr>\n";
}

//========================================================================
// Misc
//========================================================================

function getUrl($url) {
	if ($url && !preg_match("/^http:\/\//",$url)) $url = "http://".$url;
	return $url;
}

function printLink($url) {
	$url = getUrl($url);
	$link = str_replace("http://", "", $url);
	echo "<a href=\"".$url."\">$link</a>\n";
}

function printSectionHeader($header) {
	echo "<tr>\n";
	echo "<td class=\"sectionheader\" colspan=\"2\">$header</td>\n";
	echo "</tr>\n";
}

function getBreadcrumbsAsHtml($names, $urls) {
        $breadcrumbs = "<span class=\"breadcrumb\">\n";
        $i = 0;
        foreach ($names as $crumb) {
                if ($i > 0) $breadcrumbs .= " &gt; ";
                $url = count($urls)>$i ? $urls[$i] : "";
                if ($url) $breadcrumbs .= "<a href=\"$url\">";
                $breadcrumbs .= $crumb;
                if ($url) $breadcrumbs .= "</a>";
                $i++;
        }
        $breadcrumbs .= "</span>\n";
        return $breadcrumbs;
}

function ModeRWX2Octal($Mode_rwx) {    // enter rwx mode, e.g. 'drwxr-sr-x'
	if ( ! preg_match("/[-d]?([-r][-w][-xsS]){2}[-r][-w][-xtT]/", $Mode_rwx) )
		die("wrong <TT>-rwx</TT> mode in ModeRWX2Octal('<TT>$Mode_rwx</TT>')");
	$Mrwx = substr($Mode_rwx, -9);    // 9 chars from the right-hand side
	$ModeDecStr     = (preg_match("/[sS]/",$Mrwx[2]))?4:0;    // pick out sticky 
	$ModeDecStr    .= (preg_match("/[sS]/",$Mrwx[5]))?2:0;    // _ bits and change
	$ModeDecStr    .= (preg_match("/[tT]/",$Mrwx[8]))?1:0;    // _ to e.g. '020'
	$Moctal     = $ModeDecStr[0]+$ModeDecStr[1]+$ModeDecStr[2];    // add them
	$Mrwx = str_replace(array('s','t'), "x", $Mrwx);    // change execute bit 
	$Mrwx = str_replace(array('S','T'), "-", $Mrwx);    // _ to on or off
	$trans = array('-'=>'0','r'=>'4','w'=>'2','x'=>'1');    // prepare for strtr
	$ModeDecStr    .= strtr($Mrwx,$trans);    // translate to e.g. '020421401401'
	$Moctal    .= $ModeDecStr[3]+$ModeDecStr[4]+$ModeDecStr[5];    // continue 
	$Moctal    .= $ModeDecStr[6]+$ModeDecStr[7]+$ModeDecStr[8];    // _ adding 
	$Moctal    .= $ModeDecStr[9]+$ModeDecStr[10]+$ModeDecStr[11];  // _ triplets
	return $Moctal;    // returns octal mode, e.g. '2755' from above.
}

function startsWith($str, $start) {
	return strpos($str, $start) === 0;
}

function sendError($warning) {
	$data = array();
	$data['status'] = 0;
        $data['warning'] = $warning;
        header('Content-type: application/json');
        echo json_encode($data);
        exit;
}

function getName($firstName, $lastName) {
	if (!$firstName) $firstName='';
	if (!$lastName) $lastName='';
	return trim($firstName. " " . $lastName);
}


?>
