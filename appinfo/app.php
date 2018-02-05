<?php
  \OC::$server->getEventDispatcher()->addListener(
    'OCA\Files::loadAdditionalScripts',
    function () {
      \OCP\Util::addScript('files_rightclick', 'script');
    }
  );
?>
