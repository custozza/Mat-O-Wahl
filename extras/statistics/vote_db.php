<?php

// COMMIT: Marius Nisslmueller, Bad Honnef, Juni 2020
// Anpassungen: Mathias Steudtner, Mai 2021

// Include Database Settings
	include "db_settings.php";
	include "db_password.php";

// Establish Connection
	$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
	if ($conn->connect_error) {
	    die("Mat-o-Wahl: Connection failed: " . $conn->connect_error);
	}

// DE: IP-Adresse des Besuchers
// EN: Ip address of visitor
	if (getenv("HTTP_X_FORWARDED_FOR")) {
		$ip=getenv("HTTP_X_FORWARDED_FOR"); }
	else {
		$ip=getenv("REMOTE_ADDR"); }

	$ip = explode (',', $ip);
	$ip = $ip[0];

// DE: Wenn keine IP gespeichert werden soll, einfach die folgende Zeile auskommentieren.
// Hierbei wird das soeben erhaltene Ergebnis von "$ip" mit einem "Null-Wert" überschrieben
// aber das Format für die simple Auswertung (results.html) bleibt erhalten.
// -> EMPFOHLENE EINSTELLUNG (gemäß DSGVO), da politische Meinungen abgefragt werden.
//
// EN: If you do not wish to save any IP addresses (privacy) please uncomment the following line.
// It replaces the result of "$ip" with zeros but keeps the right format.
// -> SUGGESTED SETTING (according to EDPR) because you're asking for political views
	$ip="0.0.0.0";


// $timestamp = time(); // Unix-Zeitstempel
 $timestamp = date("Y-m-d H:i:s");
//	$timestamp = date("Y-m-d");

	$votes = implode(',', $_GET["votes"]);
	$weights = implode(',', $_GET["weights"]);

echo "<br>Mat-o-Wahl: imploded votes".$votes;
echo "<br>Mat-o-Wahl: imploded weights".$weights;

// Sanitize User Input
//	$votesSanitized = mysqli_real_escape_string($conn, $_GET["votes"]);
//	$weightsSanitized = mysqli_real_escape_string($conn, $_GET["weights"]);

//echo "<br>Mat-o-Wahl: sanitized votes".$votesSanitized;
//echo "<br>Mat-o-Wahl: sanitized weights".$weightsSanitized;

// Prepare and execute SQL Statement
	$sql = "INSERT INTO `$tablename` (ip, timestamp, personal, parties) VALUES ('$ip', '$timestamp', '$votes', '$weights')";

echo "<br>Mat-o-Wahl: created insert ".$sql;

// Send data
	if ($conn->query($sql) === TRUE) {
	  echo "<br>Mat-o-Wahl: New record created successfully into table ".$tablename;
	} else {
	  echo "<br>Mat-o-Wahl: Error: <strong>" . $sql . " </strong> <br /> Error-Code:" . $conn->error;
	}

// Close connection
	$conn->close();

?>
