# Changelogs
## 0.15.1
- The right click menu was not loaded.

## 0.15.0
- Add multiple translations thanks to Transifex
- RightClick does no more load in log in screen.
- Fix IE11 incompatibily

## 0.14.2
- Keys are handled when right clicking. By default, the right click menu does not show up if a mod key is pressed (ctrl, shift, alt).
- Allow developer to use the regular right click (https://github.com/nextcloud/files_rightclick/issues/59 thanks to @juliushaertl)

## 0.14.1
- Fix printed options

## 0.14.0
- Improve README
- App embended by default for NC 17

## 0.13.0
- Remove regular click option: "Open folder" for example
- Improve outside clicks detection
- Code cleaning

## 0.12.0
- The app repository was transfered to Nextcloud in order to ship the Right click app by default.
- Update README.md and info.xml
- Remove the very specific option: WebDAV link

## 0.11.1
- Add Norwegian translation (https://github.com/NastuzziSamy/files_rightclick/pull/48 thanks to @apiraino)
- Add Italian translation (https://github.com/NastuzziSamy/files_rightclick/pull/49 thanks to @apiraino)

## 0.11.0
- Add Spanish translation (https://github.com/NastuzziSamy/files_rightclick/pull/45 thanks to @Teshynil)
- Add Escape button management (close all menus)
- Fix menu listing
- Fix changelog

## 0.10.2
- Fix submenus auto scrolling (https://github.com/NastuzziSamy/files_rightclick/issues/40 thanks to @worldworm)
- Add Dutch translations (https://github.com/NastuzziSamy/files_rightclick/pull/43 thanks to @joklaps)

## 0.10.1
- Fix IE11 incompatibily (https://github.com/NastuzziSamy/files_rightclick/issues/39 thanks to @geokh)
- Improve changelogs (https://github.com/NastuzziSamy/files_rightclick/issues/21 thanks to @lachmanfrantisek)

## 0.10.0
- Change menu generation and handler
- Update calcul and disposition for menus and sub-menus
- Fix selected actions

## 0.9.1
- Update calcul and disposition
- Improve display

## 0.9.0
- App compatible with NC 15/16 (https://github.com/NastuzziSamy/files_rightclick/pull/35 thanks to @nextgen-networks, linked to https://github.com/NastuzziSamy/files_rightclick/issues/34 thanks to @violoncelloCH)
- Right click arrows have now a class (https://github.com/NastuzziSamy/files_rightclick/issues/26 thanks to @blackcrack)
- Move changelog

## 0.8.4
- Rerouting as suggested by @zorn
- Bugs fixed:
    - Bad delimiter selection
    - Submenus went out of the screen
    - Submenus was not deleted (at the end, unnecessary use of memory)

## 0.8.3
- Add a copy function (text instead of an onClick function)
- Add WebDAV link copy option https://github.com/NastuzziSamy/files_rightclick/issues/15
- Bugs fix:
    - Bad sub menu positions
    - Bad urls corrected https://github.com/NastuzziSamy/files_rightclick/issues/17

## 0.8.2
- Improve submenu display
- Better onHover management
- Better class names
- Bug fix:
    - Share option didn't show correctly https://github.com/NastuzziSamy/files_rightclick/issues/19

## 0.8.1
- Add submenu compatibility
- Optimizations and bugs fixed

## 0.8.0
- Creation of an object to create simple menus (avalaible for any apps):
    - RightClick.Option create an option for a menu with an icon, a text and an onClick function
    - RightClick.Options regroup given options for a menu
    - RightClick.Menu allow to create a menu object applied to a delimited area
- The next version will allow to have submenus
- Add changelogs https://github.com/NastuzziSamy/files_rightclick/issues/16

## 0.7.0
- Add TODO list
- Optimizations
- Set the NC compatibility to v13 and above https://github.com/NastuzziSamy/files_rightclick/issues/14

## 0.6.1
- Add russian translation (thanks to @zorn)

## 0.6.0
- Can now recognized available apps
- Bug fixed:
    - Correct loop of death caused by audioplayer incompatibily (now fixed) https://github.com/NastuzziSamy/files_rightclick/issues/10

## 0.5.3
- Bugs fixed:
    - Share icon didn't show https://github.com/NastuzziSamy/files_rightclick/issues/12
    - Right click context fixed

## 0.5.2
- German text updated (thanks to @worldworm)
- Right click context changed

## 0.5.1
- Text shortened https://github.com/NastuzziSamy/files_rightclick/issues/9

## 0.5.0
- Add portuguese brazil translation (thanks to @darioems)
- Add german translation (thanks to @worldworm)
- Add (un)select options
- Bugs fixed:
    - Copy/Move options https://github.com/NastuzziSamy/files_rightclick/issues/5
    - Right click menu didn't show when the file was shared by link

## 0.4.0
- First release in the NC appstore
- Add right click on files
- Add custom options for each type of file
