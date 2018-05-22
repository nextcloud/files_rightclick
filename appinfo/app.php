<?php

$includes = [
    'Files' => 'files',
    'Files_Sharing' => 'files',
];

\OCP\Util::addScript('files_rightclick', 'script');

$eventDispatcher = \OC::$server->getEventDispatcher();

foreach ($includes as $app => $include) {
    $eventDispatcher->addListener(
        'OCA\\'.$app.'::loadAdditionalScripts',
        function () use ($include) {
            \OCP\Util::addScript('files_rightclick', $include);
            \OCP\Util::addStyle('files_rightclick', 'app');
        }
    );
}
