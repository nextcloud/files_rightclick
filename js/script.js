var RightClick = RightClick || {};

(function(window, $, exports, undefined) {
    'use strict';

    // Object where all options are listed for one (sub)menu
    exports.Options = function (options) {
        this.options = {};
        this.nbr = 0;

        // Add one or more options
        this.add = function (options) {
            if (typeof options === 'string' || typeof options === 'number')
                options = new exports.Option(options);

            if (options instanceof exports.Option)
                this.options[this.nbr++] = options;
            else if (options !== undefined && options instanceof Object) {
                for (var name in options) {
                    var option = options[name];

                    if (typeof option !== 'function') {
                        if (typeof option === 'string' || typeof option === 'number')
                            option = new exports.Option(option);

                        if (option instanceof exports.Option) {
                            this.options[name] = option;
                            this.nbr++;
                        }
                    }
                }
            }

            return this;
        };

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

        this.isDisabled = function () {
            for (var name in this.options) {
                if (!this.options[name].isDisabled())
                    return false;
            }

            return true;
        }

        this.add(options);
    }

    exports.Option = function (text, icon, callback, subOptions) {
        this.text = text;
        this.icon = icon;
        this.callback = callback;
        this.subOptions = subOptions;

        this.generate = function () {
            var a = $('<a>');
            var iconSpan = $('<span>', {
                'class': this.icon
            });
            var textSpan = $('<span>', {
                'text': this.text
            });

            if (this.callback === undefined) {
                a.attr('disabled', true).css({
                    'cursor': 'default',
                    'background-color': '#AAA'
                });

                iconSpan.css('cursor', 'default');
                textSpan.css('cursor', 'default');
            }

            return $('<li>', {
                'onClick': this.callback
            }).append(a.append(iconSpan).append(textSpan));
        };

        this.isDisabled = function () {
            return this.callback === undefined;
        }
    }

    exports.ContextMenu = function (context, options, zIndex) {
        this.context = context;
        this.options = options || new exports.Options();
        this.params = {
            'z-index': zIndex || 100
        };

        if (context === undefined)
            return undefined;

        var onClick = function (event) {
            event.stopPropagation();
            event.preventDefault();

            var $this = $(this);
            var options = $.data($this[0], 'right_click-options');
            var params = $.data($this[0], 'right_click-params');

            if (typeof options === "function")
                options = options(event);

            if (options.nbr === 0)
                return;

            var div = $('<div>', {
                'class': 'bubble open rightClickMenu'
            }).append(options.generate());

            div.appendTo($this);

            var top = event.pageY + $this.position().top - $this.offset().top + 15;
            var left = event.pageX + $this.position().left - $this.offset().left - (div.width() / 2) - 5;

            div.css({
                'top': top,
                'left': left,
                'right': 'auto',
                'z-index': params['z-index']
            });

            var optionsDisabled = options.isDisabled();

            if (optionsDisabled)
                div.css('background-color', '#AAA');

            $('style.rightClickStyle').text('.rightClickMenu:after{transform:translateX(-50%);left:' + (div.width() / 2) + 'px;' + (optionsDisabled ? 'border-bottom-color:#AAA;' : '') + '}');

            return false;
        }

        $.data(this.context[0], 'right_click-options', this.options);
        $.data(this.context[0], 'right_click-params', this.params);
        this.context.contextmenu(onClick);
    };

    $('<style class="rightClickStyle"></style>').appendTo('head');
})(window, jQuery, RightClick);
