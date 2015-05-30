<?php
$to      = 'dmkazantsev@gmail.com';
$subject = 'Отправлена форма с сайта';

$headers = 'From: bestquest_website@website.ru' . "\r\n" ;
$headers .= "Content-type: text/plain; charset=UTF-8" . "\r\n";
$headers .= "Mime-Version: 1.0" . "\r\n";

if ($_REQUEST['name']) $message = $message . "Имя: " . $_REQUEST['name'] . "\r\n";
if ($_REQUEST['email']) $message = $message . "E-mail: " . $_REQUEST['email'] . "\r\n";
if ($_REQUEST['phone']) $message = $message . "Телефон: " . $_REQUEST['phone'] . "\r\n";
if ($_REQUEST['date']) $message = $message . "Дата: " . $_REQUEST['date'] . "\r\n";
if ($_REQUEST['qty']) $message = $message . "Количество человек: " . $_REQUEST['qty'] . "\r\n";
if ($_REQUEST['descr']) $message = $message . "Дополнительная информация: " . $_REQUEST['descr'] . "\r\n";
if ($_REQUEST['locattion']) $message = $message . "Отправлено со страницы: " . $_REQUEST['locattion'] . "\r\n";

mail($to, $subject, $message, $headers);
?>