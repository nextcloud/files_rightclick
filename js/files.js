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

    new RightClick.ContextMenu($('tbody[id*=fileList]'), function (event) {
        if ($('tbody').has(event.target).length === 0)
          return;

        var appName = 'files_rightclick';
        var currentFile = $(event.target).closest('tr');
        var leftToRemove = currentFile.find('.selection').width();

        if (currentFile.find('.fileActionsMenu').length != 0) {
          currentFile.find('.fileActionsMenu').remove();
          currentFile.removeClass('mouseOver');
          currentFile.removeClass('highlighted');
          currentFile.find('.action-menu').removeClass('open');

          return false;
        }

        if ($(event.target).parent().hasClass('fileactions') || $(event.target).parent().parent().hasClass('fileactions')) {
            $(event.target).click();
            return false;
        }
        else
            currentFile.find('.action-menu').click();

        var menu = currentFile.find('.fileActionsMenu');
        var menuStyle = $('style.rightClickStyle');
        var selectedActionsList = $('.selectedActions');
        var top = (event.pageY - currentFile.offset().top + (currentFile.height() / 4));
        var left = event.pageX - currentFile.offset().left - leftToRemove - (menu.width() / 2) - 4;
        var generateNewOption = function (action, icon, text, onClick, prepend) {
        if (prepend === undefined)
          prepend = true;

        var newOption = $('<li><a href="#" class="menuitem action permanent" data-action="' + action + '"><span class="icon icon-' + icon + '"></span><span>' + text + '</span></a></li>').on('click', function (event) {
            event.stopPropagation();
            event.preventDefault();

            menu.remove();
            currentFile.removeClass('mouseOver');
            currentFile.removeClass('highlighted');
            currentFile.find('.action-menu').removeClass('open');

            onClick();
        });

        if (prepend) {
            menu.find('ul').prepend(
                newOption
            );
        }
        else {
            menu.find('ul').append(
                newOption
            );
        }
        };

        menu.addClass('rightClickMenu');
        menu.css('visibility', 'hidden');

        if (left < (-leftToRemove)) {
            left = (-leftToRemove);

            if ((event.pageX - currentFile.offset().left) <= 11)
              menuStyle.text('.fileActionsMenu.rightClickMenu{border-top-left-radius:0} .fileActionsMenu.rightClickMenu:after{left:0}');
            else
              menuStyle.text('.fileActionsMenu.rightClickMenu:after{transform:translateX(-50%);left:' + (event.pageX - currentFile.offset().left) + 'px}');
        }
        else if (left + menu.width() + leftToRemove + 10 > currentFile.width()) {
            left = currentFile.width() - leftToRemove - menu.width() - 10;

            if ((event.pageX - currentFile.offset().left - leftToRemove - left) >= (menu.width() - 11))
                menuStyle.text('.fileActionsMenu.rightClickMenu{border-top-right-radius:0} .fileActionsMenu.rightClickMenu:after{right:0}');
            else
                menuStyle.text('.fileActionsMenu.rightClickMenu:after{transform:translateX(-50%);left:' + (event.pageX - currentFile.offset().left - leftToRemove - left) + 'px}');
        }
        else
            menuStyle.text('.fileActionsMenu.rightClickMenu:after{transform:translateX(-50%);left:' + (menu.width() / 2) + 'px}');

        menu.css({
            right: 'auto',
            top: top,
            left: left
        });

        if (currentFile.hasClass('selected')) {
            menu.find('ul').html('');

            generateNewOption('Check', 'category-disabled', t(appName, 'Unselect'), function () {
                $(currentFile.find('input.selectCheckBox')).click();
            });

            $.each(selectedActionsList, function (i, selectedActions) {
                $.each($(selectedActions).find('a'), function (j, selectedAction) {
                    var action = $(selectedAction);

                    if (action.is(":visible")) {
                        generateNewOption(action.attr('class'), $(action.find('span.icon')).attr('class').replace('icon', '').replace(' ', '').replace('icon-', ''), $(action.find('span:not(.icon)')).text(), function () {
                            action.click()
                        }, false);
                    }
                });
            });
        }
        else {
            var mimeType = currentFile.attr('data-mime');
            var text = '';
            var icon = 'toggle';
            var onClick = function () {
                currentFile.find('.filename .nametext').click();
            };

            var share = currentFile.find('.filename .fileactions .action-share');

            if (share.length !== 0) {
                generateNewOption('Share', 'share', t(appName, 'Share ' + (currentFile.attr('data-type') === 'dir' ? 'folder' : 'file')), function () {
                    share.click();
                });
            }

            if (currentFile.attr('data-type') === 'dir') {
                text = t(appName, 'Open folder');
                icon = 'filetype-folder-drag-accept';

                generateNewOption('Open', 'category-app-bundles', t(appName, 'Open in new tab'), function () {
                    window.open('?dir=' + currentFile.attr('data-path') + (currentFile.attr('data-path') === '/' ? '' : '/') + currentFile.attr('data-file'), "_blank");
                });
            }
            else if (mimeType === 'text/plain') {
                text = t(appName, 'Edit file');
                icon = 'edit';
            }
            else if (mimeType === 'application/pdf') {
                text = t(appName, 'Read PDF');
            }
            else if (mimeType.indexOf('image') >= 0 && availableApplications.includes('gallery')) {
                text = t(appName, 'See picture');

                generateNewOption('Open', 'category-multimedia', t(appName, 'Open in Gallery'), function () {
                    window.open('/apps/gallery' + currentFile.attr('data-path').replace('/', '/#') + (currentFile.attr('data-path') === '/' ? '' : '/') + currentFile.attr('data-file'), "_blank");
                });
            }
            else if (mimeType.indexOf('audio') >= 0 && (availableApplications.includes('audioplayer') || availableApplications.includes('music'))) {
                var isReading = function () {
                    return (currentFile.find('.ioc').length === 1) && (currentFile.find('.ioc').css('display') !== 'none');
                };

                text = t(appName, 'Play/Pause');
                icon = 'play';

                onClick = function () {
                    if (!isReading()) {
                        currentFile.find('.filename .nametext').click();
                    }
                };
            }
            else if (mimeType.indexOf('video') >= 0 && availableApplications.includes('audioplayer')) {
                text = t(appName, 'Watch');
                icon = 'play';
            }
            else if (currentFile.attr('data-type') === 'file') {
                text = t(appName, 'Open file');
            }

            if (text !== '') {
                generateNewOption('Open', icon, text, onClick);
            }

            if (!$('#selectedActionsList').hasClass('hidden')) {
                generateNewOption('Check', 'category-enabled', t(appName, 'Select'), function () {
                    $(currentFile.find('input.selectCheckBox')).click();
                });
            }
        }

        var options = new RightClick.Options();

        for (var key in menu.find('li')) {
            if (!isNaN(key)) {
                var spans = $($(menu.find('li')[key]).find('span'));

                options.add(new RightClick.Option($(spans[1]).text(), $(spans[0]).attr('class')));
            }
        }

        return options;
    }, $('#controls').css('z-index') - 1);
})(window, jQuery, RightClick);
