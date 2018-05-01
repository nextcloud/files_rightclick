var RightClick = RightClick || {};

(function(window, $, RightClick, undefined) {
    'use strict';

    var availableApplications = [];

    $.get('/apps/files_rightclick/ajax/applications.php', function (data) {
      try {
        availableApplications = JSON.parse(data);
      }
      catch (error) {
        availableApplications = [];
      }
    });

    $('<style class="rightClickStyle"></style>').appendTo('head');
    $('table[id*=filestable]').contextmenu(RightClick.openContextOnRightClick);
})(window, jQuery, RightClick);
