<?php

  $eventDispatcher = \OC::$server->getEventDispatcher();

  $eventDispatcher->addListener(
    'OCA\Files::loadAdditionalScripts',
    function () {
      \OCP\Util::addScript('files_rightclick', 'script');
    }
  );

  $eventDispatcher->addListener(
    'OCA\Files_Sharing::loadAdditionalScripts',
    function () {
      \OCP\Util::addScript('files_rightclick', 'script');
    }
  );
?>
