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


        this.add(options);
    }

    exports.Option = function (text, icon, callback, subOptions) {
        this.text = text;
        this.icon = icon;
        this.callback = callback;
        this.subOptions = subOptions;

        this.generate = function () {
            return $('<li>', {
                'onClick': callback
            }).append(
                $('<a>').append(
                    $('<span>', {
                        'class': this.icon
                    })
                ).append(
                    $('<span>', {
                        'text': this.text
                    })
                )
            )
        };
    }

    exports.ContextMenu = function (context, options) {
        this.context = context;
        this.options = options || new exports.Options();

        if (context === undefined)
            return undefined;

        var onClick = function (event) {
            var $this = $(this);
            options = $.data($this[0], 'right_click-options');

            if (typeof options === "function")
                options = options(event);

            var div = $('<div>', {
                'class': 'bubble open rightClickMenu'
            }).append(options.generate());

            div.appendTo($this);

            var top = event.pageY + $this.position().top - $this.offset().top + 15;
            var left = event.pageX + $this.position().left - $this.offset().left - (div.width() / 2);

            div.css({
                'top': top,
                'left': left,
                'right': 'auto'
            });

            $('style.rightClickStyle').text('.rightClickMenu:after{transform:translateX(-50%);left:' + (div.width() / 2) + 'px}');

            return false;
        }

        $.data(this.context[0], 'right_click-options', this.options);
        this.context.contextmenu(onClick);
    };

    $('<style class="rightClickStyle"></style>').appendTo('head');
})(window, jQuery, RightClick);
