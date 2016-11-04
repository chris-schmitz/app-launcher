# App Launcher

> Launch app groups by name.

## Development setup

### Starting up vue

I'm using [Vue.js](http://www.vuejs.org) for the interface and I'm using webpack's `vue-loader` to break out the components into their own `.vue` files. To get up and running with Vue development do the following:

``` bash
# from the root of the project

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
Once you've run these commands webpack will start listening for changes to the interface files and will compile the code on those changes.

### Starting electron

Since the GUI for this project is written in [Electron](http://electron.atom.io/) you'll need to run electron's binary to develop this project:

```
# from the root of the project
electron .
```

This will launch the electron app window. You'll be able to work in the electron window as you would normally in a browser window.


## Misc details
- Color pallet used: [OnyxCF from http://www.color-hex.com/](http://www.color-hex.com/color-palette/25343)
