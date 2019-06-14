<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, X-Auth-Token, Origin, Authorization');
$req_method = $_SERVER['REQUEST_METHOD'];

require 'email/class.phpmailer.php';
require 'email/class.smtp.php';

$msg='<!-- Notification 6 -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="full2"  bgcolor="#303030"style="background-color: rgb(48, 48, 48);">
	<tbody><tr mc:repeatable>
		<td style="background-image: url(images/not6_bg_image.jpg); -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; background-position: center center; background-repeat: no-repeat;" id="not6">
		<div mc:hideable>
			
			<!-- Mobile Wrapper -->
			<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="mobile2">
				<tbody><tr>
					<td width="100%">
					
						<div class="sortable_inner ui-sortable">
						<!-- Space -->
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="full" object="drag-module-small">
							<tbody><tr>
								<td width="100%" height="50"></td>
							</tr>
						</tbody></table><!-- End Space -->
						
						<!-- Space -->
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="full" object="drag-module-small">
							<tbody><tr>
								<td width="100%" height="50"></td>
							</tr>
						</tbody></table><!-- End Space -->
			
						<!-- Start Top -->
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="mobile2" bgcolor="#4edeb5" style="border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: rgb(78, 222, 181);" object="drag-module-small">
							<tbody><tr>
								<td width="100%" valign="middle" class="image75">
									
									<!-- Header Text --> 
									<table width="540" border="0" cellpadding="0" cellspacing="0" align="center" style="text-align: center; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="fullCenter2">
										<tbody><tr>
											<td width="100%" height="30"></td>
										</tr>
										<tr>
											<td width="100%"><h2 style="color:white; text-align: center; font-family: Helvetica; font-weight: normal;">';

$msg.='SOPORTE';
$msg.='</h2></td>
										</tr>
									</tbody></table>
								</td>
							</tr>
						</tbody></table>
						
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="mobile2" bgcolor="#ffffff"object="drag-module-small" style="background-color: rgb(255, 255, 255);">
							<tbody><tr>
								<td width="100%" valign="middle">
								 
									<table width="540" border="0" cellpadding="0" cellspacing="0" align="center" style="text-align: center; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="fullCenter2">
										<tbody><tr>
											<td width="100%" height="30"></td>
										</tr>
									</tbody></table>
								</td>
							</tr>
						</tbody></table>';

$msg.='<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="mobile2" bgcolor="#ffffff"object="drag-module-small" style="background-color: rgb(255, 255, 255);">
							<tbody><tr>
								<td width="100%" valign="middle">
								 
									<table width="540" border="0" cellpadding="0" cellspacing="0" align="center" style="text-align: center; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="fullCenter2">
										<tbody><tr>
											<td width="100%" height="30"></td>
										</tr>
									</tbody></table>
								</td>
							</tr>
						</tbody></table>
						
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="mobile2" bgcolor="#ffffff"object="drag-module-small" style="background-color: rgb(255, 255, 255);">
							<tbody><tr>
								<td width="100%" valign="middle">
								 
									<table width="540" border="0" cellpadding="0" cellspacing="0" align="center" style="text-align: center; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="fullCenter2">
										<tbody><tr>
											<td valign="middle" width="100%" style="text-align: left; font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: rgb(63, 67, 69); line-height: 24px;"mc:edit="41">';

$msg.='<ul style="list-style-type: disc;">
													<li><b>Prioridad: '.$_POST['prioridad'].'</b></li>
													<li><b>Tipo: '.$_POST['tipo'].'</b></li>
													<li><b>Nombre: '.$_POST['nombre'].'</b></li>
													<li><b>Correo: '.$_POST['correo'].'</b></li>
													<li><b>Colegio: '.$_POST['colegio'].'</b></li>
												</ul>
												<!--[if !mso]><!--><span style="font-family: Helvetica; font-weight: normal;"><!--<![endif]-->'.$_POST['mensaje'].' <!--[if !mso]><!--></span><!--<![endif]-->';
$msg.='</td>
										</tr>
									</tbody></table>
								</td>
							</tr>
						</tbody></table>
						
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="mobile2" bgcolor="#ffffff"object="drag-module-small" style="background-color: rgb(255, 255, 255);">
							<tbody><tr>
								<td width="100%" valign="middle">
								 
									<table width="540" border="0" cellpadding="0" cellspacing="0" align="center" style="text-align: center; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="fullCenter2">
										<tbody><tr>
											<td width="100%" height="40"></td>
										</tr>
									</tbody></table>
								</td>
							</tr>
						</tbody></table>
						
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="full2" object="drag-module-small">
							<tbody><tr>
								<td width="100%" height="30"></td>
							</tr>
						</tbody></table>
						
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="mobile2" object="drag-module-small">
							<tbody><tr>
								<td width="100%" height="30"></td>
							</tr>
						</tbody></table>
						
						<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="mobile2" object="drag-module-small">
							<tbody><tr>
								<td width="100%" height="29"></td>
							</tr>
							<tr>
								<td width="100%" height="1"></td>
							</tr>
						</tbody></table>
						</div>
						
					</td>
				</tr>
			</tbody></table>
			
		</div>
		</td>
	</tr>
</tbody></table><!-- End Notification 6 -->';

//Create a new PHPMailer instance
$mail = new PHPMailer;
//Tell PHPMailer to use SMTP
$mail->isSMTP();
//Whether to use SMTP authentication
$mail->SMTPAuth = true;
// if you're using SSL
$mail->SMTPSecure = 'ssl';
//Set the hostname of the mail server
$mail->Host = "mail.aplicando.com.co";
//Set the SMTP port number - likely to be 25, 465 or 587
$mail->Port = 465;
//Username to use for SMTP authentication
$mail->Username = "contacto@aplicando.com.co";
//Password to use for SMTP authentication
$mail->Password = "Angel2309152";
//Set who the message is to be sent from
$mail->setFrom('contacto@aplicando.com.co', 'Mi Contacto');
//Set the subject line
$mail->Subject = 'Soporte Asiscole';
//mensaje
$mail->MsgHTML($msg);
//Set who the message is to be sent to
// $mail->addAddress('soporte@asiscole.aplicando.com.co', 'Soporte Asiscole');
$mail->addAddress('danyiel93@gmail.com', 'gerencia');
$mail->addAddress('luisfernandojimenezr@gmail.com', 'gerencia');
//pasa a html
$mail->IsHTML(true);

// send the message, check for errors
if (!$mail->send()) {
// if (false) {
    echo json_encode(array(
    	'post' => $_POST,
    	'res' => false,
    	'mensaje' => $mail->ErrorInfo
    	)
    );
} else {
    echo json_encode(array(
    	'post' => $_POST,
    	'res' => true
    	)
    );
}
