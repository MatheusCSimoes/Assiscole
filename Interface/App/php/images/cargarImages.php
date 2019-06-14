<?php
	$text = "";
	$target_dir = "";
	$target_file = $target_dir . basename($_FILES["image"]["name"]);
	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	// Check if image file is a actual image or fake image
	// if(isset($_POST["submit"])) {
	    $check = getimagesize($_FILES["image"]["tmp_name"]);
	    if($check !== false) {
	        $text = "File is an image - " . $check["mime"] . ".";
	        $uploadOk = 1;
	    } else {
	        $text = "File is not an image.";
	        $uploadOk = 0;
	    }
	// }
	    // Check if file already exists
	if (file_exists($target_file)) {
	    $text = "Este archivo ya existe";
	    $uploadOk = 0;
	}
	if ($_FILES["image"]["size"] > 2000000) {
	    $text = "El archivo no puede ser de mas de 2MB";
	    $uploadOk = 0;
	}
	if($imageFileType != "JPG" && $imageFileType != "PNG" && $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
	    $text = "El archivo no es valido, revise que sea jpg, png o jpeg";
	    $uploadOk = 0;
	}
	if ($uploadOk == 0) {
	    $text .= "Sorry, your file was not uploaded.";
	// if everything is ok, try to upload file
	} else {
	    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
	        $text = "El archivo ". basename( $_FILES["image"]["name"]). " ha sido cargado";
	    } else {
	        $text = "Disculpa, ocurrio un problema, intentalo de nuevo";
	    }
	}
	$json = json_encode(array(
	  'text' => $text,
	  'success' => $uploadOk,
	  'tipo' => $imageFileType,
	  'tamano' => $_FILES["image"]["size"],
	));
	echo $json;
?>