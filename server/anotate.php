 Welcome <?php echo $_POST['note']; ?>!<br />
 Date <?php echo $_POST['date']; ?>!<br />
 
 <?php
 
 include "fia.inc";
 
 $date=$_POST['date'];
 $note=$_POST['note'];
 $date=$date.':00';
 
 // echo $date;
 // echo $note;
 
 $db = connectToDatabase();
 
 mysql_query("set names 'utf8'",$db);
 
 $sql = "Insert into anotation (action_date,action_note) 
	values ( str_to_date('$date','%m/%d/%Y %H:%i:%s'),'$note');";
 
 mysql_query($sql,$db);  

 mysql_close($db);

?>