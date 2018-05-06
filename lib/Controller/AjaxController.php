<?php

namespace OCA\FilesRightClick\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;

class AjaxController extends Controller
{
    /**
     * @NoAdminRequired
     */
    public function applications()
    {
        $availableApplications = [];
        $applications = [
            'gallery',
            'audioplayer',
            'music'
        ];
        foreach ($applications as $application) {
            if (\OCP\App::isEnabled($application)) {
                $availableApplications[] = $application;
            }
        }
        return new JSONResponse($availableApplications);
    }
}
