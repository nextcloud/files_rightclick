⚠️ As of Nextcloud 28, this app is deprecated.
The right click feature has been merged upstream.

# Right click for Nextcloud
  This app allows users and developers to have a right click menu.
  Simply use the RightClick object to quickly create context menus.
  The Files app already shows the actions menu when right clicking on files and folders.
  The regular right click menu of the browser can be accessed either on areas which don’t have a right-click handler (like the header or left navigation) or anywhere by simply holding <kbd>⬆ Shift</kbd> before right click.

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

# Development setup
1. ☁ Clone the app into the apps folder of your Nextcloud: `git clone https://github.com/nextcloud/files_rightclick.git`
2. ✔️ Enable the app through the app management of your Nextcloud
3. 🎉 Help fix some [issues](https://github.com/nextcloud/files_rightclick/issues) and [review pull requests](https://github.com/nextcloud/files_rightclick/pulls) 👍
