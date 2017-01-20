# App Launcher

> Launch app groups by name.

![demo](readmeattachments/app-demo.gif)

The App Launcher is a Mac OS app built with [Electron](http://electron.atom.io/) and [Vue.js](https://vuejs.org/). The app allows you to create groups of apps that can be launched by group name. [You can download the app here](https://github.com/chris-schmitz/app-launcher/releases).

If you want to dig into the code, [jump down to the Development Setup section](#development-setup).


## Creating Groups

To add a new group, click the "New Group" button.

![newgroup](readmeattachments/NewGroup.png)

This will take you to the group details screen. From here you can name the group and add apps by either drag and dropping them or by picking them from a drop down selection window.

![addingapps](readmeattachments/addingapps.png)
![dropdownselector](readmeattachments/dropdownselector.png)

Once you've picked the apps you want to launch for the group, click "Update" to save the group. This will add the new group to your launchable list.

![savedgroup](readmeattachments/savedgroup.png)

Once you've created your groups you can launch them from the tray icon:

![trayicon](readmeattachments/trayicon.png)

Or from the dock icon context menu:

![appiconcontextmenu](readmeattachments/appiconcontextmenu.png)

Once you've configured the groups you can hide the app's window by clicking the "Only show menubar on launch" option and closing the window.

![hideonlaunch](readmeattachments/hideonlaunch.png)

When you close the window the app will sit in the background and wait for you to launch a group from the tray or dock icon.

# Development setup

### Starting up vue

I'm using [Vue.js](http://www.vuejs.org) for the interface and I'm using webpack's `vue-loader` to break out the components into their own `.vue` files. To get up and running with Vue development do the following:

``` bash
# from the root of the project

# install dependencies
npm install

# Development
## there's an issue at the moment with how the normal dev script interacts with the cross-env package
## so you can't use `npm run dev` by itself. Instead, you'll need to launch the `electron` and `watch:ui` 
## scripts separately. Both electron and watch:ui are continuously running processes so they'll need to be
## started in seperate terminal windows.

# terminal window 1
npm run electron

#terminal window 2
npm run watch:ui

# Packaging
# build the vue client and then package the electron app
npm run package

# the commands behind these script calls can be found in `package.json`
```


## Misc details
- Color pallet used: [OnyxCF from http://www.color-hex.com/](http://www.color-hex.com/color-palette/25343)
- App icon from: [icons8.com](https://icons8.com/)
- Menu icon from: [fontawesome.io](http://fontawesome.io/)
