<?php

$includes = [
    'Files' => 'files',
    'Files_Sharing' => 'files',
];

$eventDispatcher = \OC::$server->getEventDispatcher();

$eventDispatcher->addListener(\OCP\AppFramework\Http\TemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS_LOGGEDIN, function() {
	\OCP\Util::addScript('files_rightclick', 'script');
});

foreach ($includes as $app => $include) {
    $eventDispatcher->addListener(
        'OCA\\'.$app.'::loadAdditionalScripts',
        function () use ($include) {
			\OCP\Util::addScript('files_rightclick', 'script');
			\OCP\Util::addScript('files_rightclick', $include);
            \OCP\Util::addStyle('files_rightclick', 'app');
        }
    );
}
