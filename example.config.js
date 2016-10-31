// To configure the locations you'd like to make available and the apps you'd
// like to launch per location:
//
// - Create a new property in the object below for a location.
//     - Note that the name you use in the property is what you'll call as the
//         location in the binary. E.g. launching the work app group:
//
//          appgroup -l work
//
// - To add an applciation, add an array value with the fully qualitified path
//     to the array for the desired location. E.g. the following configuration
//     will launch Iterm, Google Chrome, and Atom when using the `appgroup -l work`
//     command:
//
//          module.exports = {
//              work: [
//                  '/Applications/iTerm.app',
//                  '/Applications/Google Chrome.app',
//                  '/Applications/Atom.app'
//              ]
//          }

module.exports = {
 work: [],
 home: []
}
