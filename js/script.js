var RightClick = RightClick || {};

(function(window, $, exports, undefined) {
    'use strict';

    exports.appName = 'files_rightclick';

    $.get(OC.generateUrl('/apps/files_rightclick/ajax/applications'), function (data) {
      exports.availableApplications = data;
    });

    exports.isAppAvailable = function (appNames) {
        if (!(appNames instanceof Array))
            appNames = [appNames];

        for (var i = 0; i < appNames.length; i++) {
            if (exports.availableApplications.includes(appNames[i]))
                return true;
        }

        return false;
    };

    // Object where all options are listed for one (sub)menu
    exports.Options = function (options) {
        this.options = [];

        this.getIndexFromOptionName = function (name) {
            return this.getNbrOfOptions(); // TODO
        };

        // Add one or more options
        this.add = function (options, index) {
            if (!(typeof index === 'number'))
                index = this.getIndexFromOptionName(index);

            if (index === undefined)
                index = this.getNbrOfOptions();

            if (typeof options === 'string' || typeof options === 'number')
                options = new exports.Option(options);

            if (options instanceof exports.Option)
                this.options.splice(index, 0, options);
            else if (options !== undefined && Array.isArray(options)) {
                for (var name in options) {
                    var option = options[name];

                    if (typeof option !== 'function') {
                        if (typeof option === 'string' || typeof option === 'number')
                            option = new exports.Option(option);
                    }

                    if (option instanceof exports.Option)
                        this.options.splice(index, 0, option);
                }
            }

            return this;
        };

        this.prepend = function (options) {
            return this.add(options, 0);
        };

        this.append = function (options) {
            return this.add(options, this.getNbrOfOptions());
        };

        // Generate all options html
        this.generate = function () {
            var ul = $('<ul>');

            for (var name in this.options) {
                var li = this.options[name].generate();

                if (li) {
                    li.addClass('action-' + name);
                    ul.append(li);
                }
            }

            return ul;
        };

        this.getNbrOfOptions = function () {
            return this.options.length;
        };

        this.isDisabled = function () {
            for (var name in this.options) {
                if (!this.options[name].isDisabled())
                    return false;
            }

            return true;
        };

        this.isFirstDisabled = function () {
            if (this.getNbrOfOptions() === 0)
                return true;
            else
                return this.options[Object.keys(this.options)[0]].isDisabled();
        };

        this.add(options);
    };

    exports.Option = function (name, text, icon, onClick, subOptions) {
        this.name = name;
        this.text = text;
        this.icon = icon;
        this.onClick = onClick;
        this.subOptions = subOptions;
        var option = this;

        this.printIfAppEnabled = function (appName) {
            this.appName = appName;
            this.printIfNoApp = false;
        }

        this.enableIfAppEnabled = function (appName) {
            this.appName = appName;
            this.printIfNoApp = true;
        }

        this.generate = function () {
            var a = $('<a>', {
                'class': 'menu-option option-' + this.name.toLowerCase()
            }).css('width', '100%');
            var iconSpan = $('<span>', {
                'class': 'icon ' + this.icon
            });
            var textSpan = $('<span>', {
                'text': this.text,
            });

            if (this.appName && !this.printIfNoApp && !exports.isAppAvailable(this.appName))
                return;

            if (this.isDisabled()) {
                a.attr('disabled', true).css({
                    'cursor': 'default',
                    'background-color': '#AAA'
                });

                iconSpan.css('cursor', 'default');
                textSpan.css('cursor', 'default');
            }

            if (typeof this.onClick === 'string') {
                a.on('click', function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    var $temp = $("<input>");
                    $("body").append($temp);
                    $temp.val(option.onClick).select();
                    document.execCommand("copy");
                    $temp.remove();

                    var html = textSpan.html();
                    textSpan.html(t('files_rightclick', 'Copied !'));

                    setTimeout(function () {
                        textSpan.html(html);
                    }, 1000);
                });
            }
            else {
                a.on('click', function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    exports.closeAllMenus();

                    onClick(event, option);
                });
            }


            var li = $('<li>').append(a.append(iconSpan).append(textSpan));

            if (this.subOptions instanceof exports.Options && this.subOptions.getNbrOfOptions() > 0) {
                var sub = $('<a>').append($('<span>').text('▶')
                    .css('padding-right', '10px')).addClass('rightClickArrow')
                    .attr('style', 'width: auto; padding-right: 0px !important');

                new exports.Menu(sub, this.subOptions, li).setAsSubMenu().setAlsoOnHover().setAlsoOnLeftClick();
                li.append(sub);
            }

            return li;
        };

        this.isDisabled = function () {
            if (this.appName && !exports.isAppAvailable(this.appName))
                return true;

            return this.onClick === undefined;
        };
    };

    exports.menus = [];
    exports.Menu = function (delimiter, options, context, onClose) {
        this.delimiter = $(delimiter);
        this.context = context;
        this.currentContext = undefined;
        this.options = options || new exports.Options();
        this.onClose = onClose;
        this.isSubMenu = false;

        if (delimiter === undefined)
            return undefined;

        // Allow onClick function to access to menu data
        var menu = this;

        this.setContext = function (context) {
            this.context = context;

            return this;
        };

        this.isOpened = function () {
            return this.element !== undefined;
        }

        var onClick = function (event) {
            event.stopPropagation();
            event.preventDefault();

            var delimiter = $(this);
            var context = menu.context;
            var options = menu.options;
            var params = menu.params;

            if (menu.isSubMenu) {
                if (!exports.closeAllSubMenus())
                    return false;
            }
            else if (!exports.closeAllMenus())
                return false;

            if (menu.isOpened())
                return false;

            exports.prepare();

            menu.attachedEvent = event;

            if (typeof context === "function")
                context = context(event);

            context = (context === undefined) ? delimiter : $(context[0]);
            menu.currentContext = context;

            if (typeof options === "function")
                options = options(event, context, delimiter);

            if (options.getNbrOfOptions() === 0)
                return;

            menu.element = $('<div>', menu.isSubMenu ? {
                'class': 'rightClick rightSubMenu bubble open'
            } : {
                'id': 'rightClickMenu',
                'class': 'rightClick bubble open'
            }).append(options.generate());

            menu.element.appendTo(exports.container);

            if (menu.isSubMenu) {
                var top = context.parents('.rightClick').first().offset().top - parseInt(menu.element.css("marginTop").replace('px', ''));
                var left = context.offset().left + context.parents('.rightClick').first().innerWidth() - (parseInt(menu.element.css("marginLeft").replace('px', '')) / 2);
            }
            else {
                var top = event.clientY - parseInt(menu.element.css("marginTop").replace('px', ''));
                var left = event.clientX - parseInt(menu.element.css("marginLeft").replace('px', ''));
            }

            var height = menu.element.outerHeight();
            var width = menu.element.outerWidth();

            if (left + width >= $(window).width()) {
                left -= width;
            }
            if (top + height >= $(window).height()) {
                top -= height;
            }

            if (top < 0) {
                top = 0;
            }
            if (left < 0) {
                left = 0;
            }

            menu.element.css({
                'top': top,
                'left': left,
                'right': 'auto',
                'z-index': 10000
            });

            var optionsDisabled = options.isDisabled();

            if (optionsDisabled)
                menu.element.css('background-color', '#AAA');

            menu.element.on('mouseleave', function (event) {
                if (menu.isOpenedOnHover)
                    menu.close();
            });

            return false;
        };

        this.close = function () {
            if (!this.isOpened())
                return true;

            if (this.element) {
                if (this.onClose) {
                    if (this.onClose(this.attachedEvent, this.currentContext, this.delimiter) === false)
                        return false;
                }

                this.element.remove();
                delete this.element;

                if (!exports.isAMenuOpen())
                    exports.clean();
            }

            return true;
        };

        this.setAlsoOnLeftClick = function () {
            this.delimiter.on('click', function (event) {
                if (menu.isOpened() && !menu.isOpenedOnHover) {
                    menu.close();

                    return false;
                }

                menu.isOpenedOnHover = false;
            }).on('click', onClick);

            return this;
        };

        this.setAlsoOnHover = function () {
            this.delimiter.on('mouseenter', function (event) {
                menu.isOpenedOnHover = true;
            }).on('mouseenter', onClick);

            return this;
        };

        this.setAsSubMenu = function (isSubMenu) {
            this.isSubMenu = isSubMenu || true;

            return this;
        };

        this.delimiter.contextmenu(onClick);
        exports.menus.push(this);
    };

    exports.closeAllMenus = function () {
        for (var key in exports.menus) {
            if (exports.menus.hasOwnProperty(key)) {
                if (exports.menus[key].close() === false)
                    return false;

                if (exports.menus[key].isSubMenu)
                    exports.menus.splice(key, 1);
            }
        }

        return true;
    };

    exports.closeAllSubMenus = function () {
        for (var key in exports.menus) {
            if (exports.menus.hasOwnProperty(key)) {
                if (exports.menus[key].isSubMenu) {
                    if (exports.menus[key].close() === false)
                        return false;
                }
            }
        }

        return true;
    };

    exports.isAMenuOpen = function () {
        for (var key in exports.menus) {
            if (exports.menus[key].isOpened()) {
                return true;
            }
        }

        return false;
    };

    exports.prepare = function () {
        $(window).on('resize', exports.closeAllMenus);
        $('body').on('click contextmenu', exports.closeAllMenus);
        $('body').css({
            'height': '100%',
            'overflow': 'hidden'
        });
    };

    exports.clean = function () {
        $(window).off('resize', exports.closeAllMenus);
        $('body').off('click contextmenu', exports.closeAllMenus);
        $('body').css({
            'height': 'auto',
            'overflow': 'auto'
        });
    };

    exports.container = $('<div id="rightClickContainer"></div>').css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'z-index': '1000',
    }).appendTo('body');
})(window, jQuery, RightClick);
