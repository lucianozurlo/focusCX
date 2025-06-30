<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    /* ─── Configuración ──────────────────────────────────────────────── */
    $mail_to = 'tu@correo.com.ar';               // destinatario final
    $from    = 'no-reply@tu-dominio.com';        // debe ser un mail de tu dominio
    $subject = 'Nuevo mensaje desde tu web';     // asunto

    /* ─── Sanitización de datos ─────────────────────────────────────── */
    $name    = filter_input(INPUT_POST, 'name',    FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $empresa = filter_input(INPUT_POST, 'empresa', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $cargo   = filter_input(INPUT_POST, 'cargo',   FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email   = filter_input(INPUT_POST, 'email',   FILTER_VALIDATE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    /* ─── Validación ───────────────────────────────────────────────── */
    if (!$name || !$empresa || !$cargo || !$email || !$message) {
        http_response_code(400);
        echo 'Faltan datos obligatorios. Revisá el formulario.';
        exit;
    }

    /* ─── Armado del cuerpo en HTML ─────────────────────────────────── */
    $content  = "<strong>Nombre:</strong> {$name}<br>";
    $content .= "<strong>Empresa:</strong> {$empresa}<br>";
    $content .= "<strong>Cargo:</strong> {$cargo}<br>";
    $content .= "<strong>E-mail:</strong> {$email}<br><br>";
    $content .= "<strong>Mensaje:</strong><br>" . nl2br($message);

    /* ─── Encabezados ──────────────────────────────────────────────── */
    $headers  = "From: {$from}\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    /* ─── Envío ─────────────────────────────────────────────────────── */
    if (mail($mail_to, $subject, $content, $headers)) {
        http_response_code(200);
        echo '¡Gracias! Tu mensaje fue enviado con éxito.';
    } else {
        http_response_code(500);
        echo 'Ups… no pudimos enviar el mensaje. Probá de nuevo más tarde.';
    }

} else {
    http_response_code(403);
    echo 'Acceso no permitido.';
}
?>
