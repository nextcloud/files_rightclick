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
        return new JSONResponse(\OC_App::getEnabledApps());
    }
}
