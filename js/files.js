var RightClick = RightClick || {};

(function(window, $, RightClick, undefined) {
    'use strict';

    if (!RightClick) {
        console.log('The RightClick app is recommanded to have context menus');
        return false;
    }

    var availableApplications = [];

    $.get('/apps/files_rightclick/ajax/applications.php', function (data) {
      try {
        availableApplications = JSON.parse(data);
      }
      catch (error) {
        availableApplications = [];
      }
    });

    new RightClick.Menu($('tbody[id*=fileList]'), function (event, currentFile, delimiter) {
        var appName = 'files_rightclick';
        var options = new RightClick.Options();

        currentFile.find('.action-menu').click();

        var menu = currentFile.find('.fileActionsMenu');
        var menuStyle = $('style.rightClickStyle');
        var selectedActionsList = $('.selectedActions');
        var generateNewOption = function (action, icon, text, onClick, prepend) {
            if (prepend === undefined)
                prepend = true;

            var option = new RightClick.Option(action, text, 'icon icon-' + icon, function (event) {
                event.stopPropagation();
                event.preventDefault();

                menu.remove();
                currentFile.removeClass('mouseOver');
                currentFile.removeClass('highlighted');
                currentFile.find('.action-menu').removeClass('open');

                onClick();
            });

            if (prepend)
                options.prepend(option);
            else
                options.append(option);
        };

        menu.css('visibility', 'hidden');

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

                generateNewOption('NewTab', 'category-app-bundles', t(appName, 'Open in new tab'), function () {
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

                generateNewOption('Gallery', 'category-multimedia', t(appName, 'Open in Gallery'), function () {
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

        for (var key in menu.find('li')) {
            if (!isNaN(key)) {
                var li = $(menu.find('li')[key]);
                var spans = $(li.find('span'));

                options.append(new RightClick.Option($(li.find('a')).attr('data-action'), $(spans[1]).text(), $(spans[0]).attr('class'), function (event, option) {
                    event.stopPropagation();
                    event.preventDefault();

                    $($('.fileActionsMenu').find('a[data-action="' + option.name + '"]')).click();
                }));
            }
        }

        setTimeout(function () {
            currentFile.find('.action-menu').click();
            $('.fileActionsMenu').css('visibility', 'hidden');
        }, 250);

        return options;
    }, $('#controls').css('z-index') - 1).setContext(function (event) {
        return $(event.target).closest('tr');
    });
})(window, jQuery, RightClick);
