Insert into anotation (action_date,action_note) values 
( str_to_date('02/27/2012 06:00:00','%m/%d/%Y %H:%i:%s'), 'test action');

SELECT * FROM awalin.anotation;