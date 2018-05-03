# Files Right Click (Nextcloud app)
  Add a simple right click menu on the Files Nextcloud app.
  Add also some open options in function of the file type

# Some screenshots
## Folder context menu
  Add "Open folder" option to open the folder as you just left clicked on it
  Add "Open in a new tab" option to open the folder in a new tab (middle click)
![alt text](https://raw.githubusercontent.com/NastuzziSamy/files_rightclick/master/screenshots/folder.png)

## Picture context menu
  Add "See this picture" option to see the picture
  Add "Open in the gallery app" option to open the picture in the gallery app
![alt text](https://raw.githubusercontent.com/NastuzziSamy/files_rightclick/master/screenshots/picture.png)

## File context menu
  Add "Edit this file" option to edit the file
![alt text](https://raw.githubusercontent.com/NastuzziSamy/files_rightclick/master/screenshots/file.png)

## Other file types are handled (if an app can open it)
- Audio files: start and stop playing
- Video files: start watching

# TODOs
- [x] Add a context menu for files applications (Files and Files_Sharing)
- [ ] Add custom options for each files:
    - [x] Open option (detect the file type)
    - [x] Check or uncheck option
    - [x] Adapt sharing and copy/move options with selected files
    - [ ] WebDAV link option
- [x] Detect if an app is installed
- [x] Split js files
- [x] Use strict mode
- [x] Create a context menu generator
- [ ] Add a context menu to create files or directories
- [ ] Add a context menu in each icon apps
- [ ] Add sub menu compatibility in context menu
- [ ] Publish a new app (with a different name) and allow any app to create its own context menu(s)
- [ ] Backport to NC 12

# Changelogs
## v0.8.0
    - Creation of an object to create simple menus (avalaible for any apps):
        - RightClick.Option create an option for a menu with an icon, a text and an onClick function
        - RightClick.Options regroup given options for a menu
        - RightClick.Menu allow to create a menu object applied to a delimited area
    - The next version will allow to have submenus
    - Add changelogs https://github.com/NastuzziSamy/files_rightclick/issues/16

## v0.7.0
    - Add TODO list
    - Optimizations
    - Set the NC compatibility to v13 and above https://github.com/NastuzziSamy/files_rightclick/issues/14

## v0.6.1
    - Add russian translation (thanks to @zorn)

## v0.6.0
    - Can now recognized available apps
    - Bug fixed:
        - Correct loop of death caused by audioplayer incompatibily (now fixed) https://github.com/NastuzziSamy/files_rightclick/issues/10

## v0.5.3
    - Bugs fixed:
        - Share icon didn't show https://github.com/NastuzziSamy/files_rightclick/issues/12
        - Right click context fixed

## v0.5.2
    - German text updated (thanks to @worldworm)
    - Right click context changed

## v0.5.1
    - Text shortened https://github.com/NastuzziSamy/files_rightclick/issues/9

## v0.5.0
    - Add portuguese brazil translation (thanks to @darioems)
    - Add german translation (thanks to @worldworm)
    - Add (un)select options
    - Bugs fixed:
        - Copy/Move options https://github.com/NastuzziSamy/files_rightclick/issues/5
        - Right click menu didn't show when the file was shared by link

## v0.4.0
    - First release in the NC appstore
    - Add right click on files
    - Add custom options for each type of file
