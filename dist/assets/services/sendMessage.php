<?php
  $name = $_POST["user"];
  $name = addslashes($name);
  $email = $_POST["email"];
  $email = addslashes($email);
  $msg = $_POST["msg"];
  $msg = addslashes($msg);

  $errorCode = 0;
  $errorMessage = "";

  try {
    $to = "whagwaan@lnflash.me";
    $from = "$email";
    $fromName = "$name";
    $subject = "Message from $name";
    $message = "
      <html>
      <head>
      <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />
      </head>
      <body>
      <table role=\"presentation\" style=\"max-width: 600px;border-collapse:collapse;border:1px solid #41ad49;margin-left:auto;margin-right:auto;\">
        <tr style=\"font-weight: 700;background:#41ad49;color:#000000;\">
          <td style=\"padding:20px 20px;\">From:</td>
          <td style=\"padding:20px 20px;\">$name</td>
        </tr>
        <tr style=\"font-weight: 700;background:#41ad49;color:#000000;\">
          <td style=\"padding:20px 20px;\">Email:</td>
          <td style=\"padding:20px 20px;\">$email</td>
        </tr>
        <tr>
          <td style=\"padding:20px 20px;\">$msg</td>
        </tr>
      </table>
      </body>
      </html>";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n"; 
  
    $headers .= "From: " .$name."<".$email.">" . "\r\n" .
    "Reply-To: $email" . "\r\n" .
    "X-Mailer: PHP/" . phpversion();
    $success = mail($to, $subject, $message, $headers);
    if (!$success) {
      $errorCode = 100;
      $errorMessage = error_get_last()['message'];
    }

  } catch(PDOException $e) {
    $this->errorCode = 1;
    $errorCode = -1;
    $errorMessage = "PDOException for sendMsg.";
  }
  
  $error["id"] = $errorCode;
  $error["message"] = $errorMessage;
  $data["error"] = $error;
  $data["msgSent"] = $success;
  $data = json_encode($data);

  header("Content-Type: application/json");

  echo $data;
?>