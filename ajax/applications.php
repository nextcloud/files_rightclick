<?php

if (!\OCP\User::isLoggedIn())
  \OC_Response::setStatus(403);

$availableApplications = [];
$applications = [
  'gallery',
  'audioplayer',
  'music'
 ];

foreach ($applications as $application) {
  if (\OCP\App::isEnabled($application))
    array_push($availableApplications, $application);
}

echo json_encode($availableApplications);
