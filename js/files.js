(function(window, $, RightClick, undefined) {
    'use strict';

    if (!RightClick) {
        console.error('The RightClick app is recommanded to have context menus');
        return false;
    }

    var appName = RightClick.appName;

    new RightClick.Menu($('tbody[class=files-fileList]'), function (event, context, delimiter) {
        var options = new RightClick.Options();
        var currentFile = $(event.target).closest('tr');
        var selectedActions = '.selectedActions .menu-center li';
        currentFile.find('.action-menu').click();
        $('.filesSelectMenu').css('visibility', 'hidden');
        $('.actions-selected').click();

        var menu = currentFile.find('.fileActionsMenu');
        var menuStyle = $('style.rightClickStyle');
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

            $.each($('.selectedActions:not(.hidden) .menu-center li:not(.hidden)'), function (i, selectedAction) {
                var action = $(selectedAction);

                addNewOption(action.attr('class'), $(action.find('span.icon')).attr('class').replace('icon', '').replace(' ', '').replace('icon-', ''), $(action.find('span:not(.icon)')).text(), function () {
                    action.find('a').click();
                }, false);
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
                addNewOption('Share', 'shared', (currentFile.attr('data-type') === 'dir' ? t(appName, 'Share folder') : t(appName, 'Share file')), function () {
                    share.click();
                });
            }

            if (!$('.selectedActions').hasClass('hidden')) {
                addNewOption('Check', 'category-enabled', t(appName, 'Select'), function () {
                    $(currentFile.find('input.selectCheckBox')).click();
                });
            }
        }

        var fileOptions = menu.find('li:not(.hidden)');

        for (var key in fileOptions) {
            if (!isNaN(key)) {
                var li = $(fileOptions[key]);
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
        }, 100);

        return options;
    }, $('#app-content-files .files-fileList'), function () {
        $('.filesSelectMenu').css('visibility', 'visible');
    });
})(window, jQuery, RightClick);
