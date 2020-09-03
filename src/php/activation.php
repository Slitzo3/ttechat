<?php
   // connect to mongodb
   $m = new MongoClient();
   echo "Connection to database successfully";
	
   // select a database
   $db = $m->test;
   echo "Database mydb selected";
   $collection = $db->mycol;
   echo "Collection selected succsessfully";
   // now update the document
   $collection->update(array("title"=>"MongoDB"), 
      array('$set'=>array("title"=>"MongoDB Tutorial")));
   echo "Document updated successfully";
	
   // now display the updated document
   $cursor = $collection->find();
	
   // iterate cursor to display title of documents
   echo "Updated document";
	
   foreach ($cursor as $document) {
      echo $document["title"] . "\n";
   }
?>