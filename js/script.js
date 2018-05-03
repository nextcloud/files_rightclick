var RightClick = RightClick || {};

(function(window, $, exports, undefined) {
    'use strict';

    // Object where all options are listed for one (sub)menu
    exports.Options = function (options) {
        this.options = [];

        this.getIndexFromOptionName = function (name) {
            return this.getNbrOfOptions(); // TODO
        }

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
        }

        this.append = function (options) {
            return this.add(options, this.getNbrOfOptions());
        }

        // Generate all options html
        this.generate = function () {
            var ul = $('<ul>');

            for (var name in this.options) {
                var li = this.options[name].generate();

                li.addClass('action-' + name);
                ul.append(li);
            }

            return ul;
        }

        this.getNbrOfOptions = function () {
            return this.options.length;
        }

        this.isDisabled = function () {
            for (var name in this.options) {
                if (!this.options[name].isDisabled())
                    return false;
            }

            return true;
        }

        this.isFirstDisabled = function () {
            if (this.getNbrOfOptions() === 0)
                return true;
            else
                return this.options[Object.keys(this.options)[0]].isDisabled();
        }

        this.add(options);
    }

    exports.Option = function (name, text, icon, onClick, subOptions) {
        this.name = name;
        this.text = text;
        this.icon = icon;
        this.onClick = onClick;
        this.subOptions = subOptions;
        var option = this;

        this.generate = function () {
            var a = $('<a>', {
                'class': 'action action-' + this.name.toLowerCase()
            });
            var iconSpan = $('<span>', {
                'class': this.icon
            });
            var textSpan = $('<span>', {
                'text': this.text
            });

            if (this.onClick === undefined) {
                a.attr('disabled', true).css({
                    'cursor': 'default',
                    'background-color': '#AAA'
                });

                iconSpan.css('cursor', 'default');
                textSpan.css('cursor', 'default');
            }

            return $('<li>').on('click', function (event) {
                event.stopPropagation();
                event.preventDefault();

                exports.closeAllMenus();

                onClick(event, option);
            }).append(a.append(iconSpan).append(textSpan));
        };

        this.isDisabled = function () {
            return this.onClick === undefined;
        }
    }

    exports.menus = [];
    exports.Menu = function (delimiter, options, zIndex, onClose) {
        this.delimiter = $(delimiter);
        this.context = undefined;
        this.options = options || new exports.Options();
        this.params = {
            'z-index': zIndex || 100
        };
        this.onClose = onClose;
        this.isOpened = false;

        if (delimiter === undefined)
            return undefined;

        // Allow onClick function to access to menu data
        var menu = this;

        this.setContext = function (context) {
            this.context = context;
        }

        var onClick = function (event) {
            event.stopPropagation();
            event.preventDefault();

            var delimiter = $(this);
            var context = menu.context;
            var options = menu.options;
            var params = menu.params;

            if (exports.closeAllMenus() === false)
                return false;

            menu.attachedEvent = event;
            menu.isOpened = true;

            if (typeof context === "function")
                context = context(event);
            context = (context === undefined) ? delimiter : $(context[0]);

            if (typeof options === "function")
                options = options(event, context, delimiter);

            if (options.getNbrOfOptions() === 0)
                return;

            var div = $('<div>', {
                'id': 'rightClickMenu',
                'class': 'bubble open'
            }).append(options.generate());

            div.appendTo(context);

            var top = event.pageY + context.position().top - context.offset().top + 15;
            var left = event.pageX + context.position().left - context.offset().left - (div.width() / 2) - 5;
            var arrow = (div.width() / 2);
            var space = div.outerWidth(true) - div.innerWidth();

            if (left < 0) {
                arrow += left;

                if (arrow < space) {
                    arrow = space;
                    div.css('border-top-left-radius', 0);
                }

                left = 0;
            }
            else if (left + div.outerWidth(true) >= context.width()) {
                var newLeft = context.width() - div.outerWidth(true) - 1;
                arrow += left - newLeft;

                if (arrow > div.width() - space) {
                    arrow = div.width() - space;
                    div.css('border-top-right-radius', 0);
                }

                left = newLeft;
            }

            div.css({
                'top': top,
                'left': left,
                'right': 'auto',
                'z-index': params['z-index']
            });

            var optionsDisabled = options.isDisabled();

            if (optionsDisabled)
                div.css('background-color', '#AAA');

            $('style.rightClickStyle').text('#rightClickMenu:after{transform:translateX(-50%);left:' + arrow + 'px;' + (optionsDisabled || options.isFirstDisabled() ? 'border-bottom-color:#AAA;' : '') + '}');

            return false;
        }

        this.close = function () {
            var openedMenu = this.delimiter.find('#rightClickMenu');

            if (openedMenu.length > 0) {
                if (this.onClose) {
                    if (this.onClose(this.attachedEvent, this.context, this.delimiter) === false)
                        return false;
                }

                openedMenu.remove();
            }

            return true;
        }

        this.setAlsoOnLeftClick = function () {
            this.delimiter.on('click', onClick);

            return this;
        }

        this.delimiter.contextmenu(onClick);
        exports.menus.push(this);
    };

    exports.closeAllMenus = function () {
        for (var i in exports.menus) {
            if (exports.menus.hasOwnProperty(i)) {
                if (exports.menus[i].close() === false)
                    return false;
            }
        }

        return true;
    }

    $('<style class="rightClickStyle"></style>').appendTo('head');
    $('body').on('click', exports.closeAllMenus).contextmenu(exports.closeAllMenus);
})(window, jQuery, RightClick);
