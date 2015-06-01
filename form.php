<?php
$to      = 'info@best-quest.ru';
$subject = 'Отправлена форма с сайта';

$headers = 'From: bestquest_website@website.ru' . "\r\n" ;
$headers .= "Content-type: text/plain; charset=UTF-8" . "\r\n";
$headers .= "Mime-Version: 1.0" . "\r\n";

if ($_GET['name']) $message = $message . "Имя: " . $_GET['name'] . "\r\n";
if ($_GET['email']) $message = $message . "E-mail: " . $_GET['email'] . "\r\n";
if ($_GET['phone']) $message = $message . "Телефон: " . $_GET['phone'] . "\r\n";
if ($_GET['date']) $message = $message . "Дата: " . $_GET['date'] . "\r\n";
if ($_GET['qty']) $message = $message . "Количество человек: " . $_GET['qty'] . "\r\n";
if ($_GET['descr']) $message = $message . "Дополнительная информация: " . $_GET['descr'] . "\r\n";
if ($_GET['locattion']) $message = $message . "Отправлено со страницы: " . $_GET['location'] . "\r\n";
if ($_GET['task']) $message = $message . "Цель мероприятия: " . $_GET['task'] . "\r\n";
if ($_GET['work']) $message = $message . "Сфера деятельности компании: " . $_GET['work'] . "\r\n";
if ($_GET['age']) $message = $message . "Средний возраст участников: " . $_GET['age'] . "\r\n";
if ($_GET['like']) $message = $message . "Понравившиеся сценарии прошлых мероприятий: " . $_GET['like'] . "\r\n";
if ($_GET['dislike']) $message = $message . "Мероприятия, концепции которых вам не понравились: " . $_GET['dislike'] . "\r\n";
if ($_GET['ideas']) $message = $message . "Пожелания и идеи: " . $_GET['ideas'] . "\r\n";

mail($to, $subject, $message, $headers);
?>