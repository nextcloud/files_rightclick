var RightClick = RightClick || {};

(function(window, $, RightClick, undefined) {
    'use strict';

    if (!RightClick) {
        console.log('The RightClick app is recommanded to have context menus');
        return false;
    }

    var appName = RightClick.appName;

    new RightClick.Menu($('tbody[id=fileList]'), function (event, context, delimiter) {
        var options = new RightClick.Options();
        var openSubOptions = new RightClick.Options();
        var currentFile = $(event.target).closest('tr');
        currentFile.find('.action-menu').click();

        var menu = currentFile.find('.fileActionsMenu');
        var menuStyle = $('style.rightClickStyle');
        var selectedActionsList = $('.selectedActions');
        var generateNewOption = function (action, icon, text, onClick, prepend, subOptions) {
            return new RightClick.Option(action, text, 'icon-' + icon, typeof onClick === 'function' ? function (event, context) {
                event.stopPropagation();
                event.preventDefault();

                menu.remove();
                currentFile.removeClass('mouseOver');
                currentFile.removeClass('highlighted');
                currentFile.find('.action-menu').removeClass('open');

                onClick(event, context);
            } : onClick, subOptions);
        };
        var addNewOption = function (action, icon, text, onClick, prepend, subOptions) {
            if (prepend === undefined)
                prepend = true;

            var option = generateNewOption(action, icon, text, onClick, prepend, subOptions);

            if (prepend)
                options.prepend(option);
            else
                options.append(option);
        };
        var addNewOpenSubOption = function (action, icon, text, onClick, prepend, subOptions) {
            if (prepend === undefined)
                prepend = true;

            var option = generateNewOption(action, icon, text, onClick, prepend, subOptions);

            if (prepend)
                openSubOptions.prepend(option);
            else
                openSubOptions.append(option);
        };

        menu.css('visibility', 'hidden');

        if (currentFile.hasClass('selected')) {
            menu.find('ul').html('');

            addNewOption('Check', 'category-disabled', t(appName, 'Unselect'), function () {
                $(currentFile.find('input.selectCheckBox')).click();
            });

            $.each(selectedActionsList, function (i, selectedActions) {
                $.each($(selectedActions).find('a'), function (j, selectedAction) {
                    var action = $(selectedAction);

                    if (action.is(":visible")) {
                        addNewOption(action.attr('class'), $(action.find('span.icon')).attr('class').replace('icon', '').replace(' ', '').replace('icon-', ''), $(action.find('span:not(.icon)')).text(), function () {
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
                addNewOption('Share', 'shared', t(appName, 'Share ' + (currentFile.attr('data-type') === 'dir' ? 'folder' : 'file')), function () {
                    share.click();
                });
            }

            if (currentFile.attr('data-type') === 'dir') {
                text = t(appName, 'Open folder');
                icon = 'filetype-folder-drag-accept';

                addNewOpenSubOption('NewTab', 'category-app-bundles', t(appName, 'Open in new tab'), function () {
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
            else if (mimeType.indexOf('image') >= 0 && RightClick.isAppAvailable('gallery')) {
                text = t(appName, 'See picture');

                addNewOpenSubOption('Gallery', 'category-multimedia', t(appName, 'Open in Gallery'), function () {
                    window.open(OC.generateUrl('/apps/gallery') + currentFile.attr('data-path').replace('/', '/#') + (currentFile.attr('data-path') === '/' ? '' : '/') + currentFile.attr('data-file'), "_blank");
                });
            }
            else if (mimeType.indexOf('audio') >= 0 && (RightClick.isAppAvailable(['audioplayer', 'music']))) {
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
            else if (mimeType.indexOf('video') >= 0 && RightClick.isAppAvailable('audioplayer')) {
                text = t(appName, 'Watch');
                icon = 'play';
            }
            else if (currentFile.attr('data-type') === 'file') {
                text = t(appName, 'Open file');
            }

            if (text !== '') {
                addNewOpenSubOption('WebDAV', 'public', t(appName, 'Get WebDAV link'), OC.linkToRemote('webdav' + currentFile.attr('data-path') + (currentFile.attr('data-path') === '/' ? '' : '/') + currentFile.attr('data-file')), false);

                addNewOption('Open', icon, text, onClick, true, openSubOptions);
            }

            if (!$('#selectedActionsList').hasClass('hidden')) {
                addNewOption('Check', 'category-enabled', t(appName, 'Select'), function () {
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
        return $('#app-content-files #fileList');
    });
})(window, jQuery, RightClick);
