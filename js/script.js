var openContext = function (event) {
  event.stopPropagation();
  event.preventDefault();

  var currentFile = $(event.target).closest('tr');
  var leftToRemove = currentFile.find('.selection').width();

  setTimeout(function () {
    if ($('.fileActionsMenu').length != 0)
      return false;
    else if ($(event.target).parent().hasClass('fileactions') || $(event.target).parent().parent().hasClass('fileactions')) {
      $(event.target).click();
      return false;
    }
    else
      currentFile.find('.action-menu').click();

    var menu = currentFile.find('.fileActionsMenu');
    var menuStyle = $('style.rightClickStyle');
    var top = (event.pageY - currentFile.offset().top + (currentFile.height() / 4));
    var left = event.pageX - currentFile.offset().left - leftToRemove - (menu.width() / 2) - 4;

    menu.addClass('rightClickMenu');

    if (left < (-leftToRemove)) {
      right = menu.width();
      left = (-leftToRemove);

      if ((event.pageX - currentFile.offset().left) <= 11)
        menuStyle.text('.fileActionsMenu.rightClickMenu{border-top-left-radius:0} .fileActionsMenu.rightClickMenu:after{left:0}');
      else
        menuStyle.text('.fileActionsMenu.rightClickMenu:after{transform:translateX(-50%);left:' + (event.pageX - currentFile.offset().left) + 'px}');
    } else if (left + menu.width() + leftToRemove + 10 > currentFile.width()) {
      right = 0;
      left = currentFile.width() - leftToRemove - menu.width() - 10;

      if ((event.pageX - currentFile.offset().left - leftToRemove - left) >= (menu.width() - 11))
        menuStyle.text('.fileActionsMenu.rightClickMenu{border-top-right-radius:0} .fileActionsMenu.rightClickMenu:after{right:0}');
      else
        menuStyle.text('.fileActionsMenu.rightClickMenu:after{transform:translateX(-50%);left:' + (event.pageX - currentFile.offset().left - leftToRemove - left) + 'px}');
    } else
      menuStyle.text('.fileActionsMenu.rightClickMenu:after{transform:translateX(-50%);left:' + (menu.width() / 2) + 'px}');

    menu.css({
      right: 'auto',
      top: top,
      left: left
    });
  }, 200)

  return false;
};

if ($('#filesApp').length == 1 && $('#filesApp').val() == 1) {
  $('<style class="rightClickStyle"></style>').appendTo('head');
  $('#fileList').contextmenu(openContext);
}
