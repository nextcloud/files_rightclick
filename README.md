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
- [x] Add custom options for each files:
    - [x] Open option (detect the file type)
    - [x] Check or uncheck option
    - [x] Adapt sharing and copy/move options with selected files
    - [x] WebDAV link option
- [x] Detect if an app is installed
- [x] Split js files
- [x] Use strict mode
- [x] Create a context menu generator
- [ ] Add a context menu to create files or directories
- [ ] Add a context menu in each icon apps
- [x] Add sub menu compatibility in context menu
- [x] Backport to NC 12
