<?php

 if(empty($_POST['name']) OR empty($_POST['email']) OR empty($_POST['message']))
  {
	header('Location:/PromotionCZ.html');
  }
 else
 {
  if(!empty($_POST['name']) AND !empty($_POST['email']) AND !empty($_POST['message']))
  {
	
   $headers='From:'.$_POST['name'].
            'Reply-To: d.sckibin2017@yandex.ru'.
			
	
   $EmailTo='assasin2133@gmail.com';
	
   $theme='New Massage from Russiano web site';  
	  
   $letter = "Данные сообщения:";
   $letter .="";
   $letter .="Имя: ".$_POST['name'];
   $letter .="Email: ".$_POST['email'];
   $letter .="Сообщение: ".$_POST['message'];
   
   
  if( mail($EmailTo, $theme, $letter, $headers))
   {
	  header('Location:/index.html');
   }
  } 
 }