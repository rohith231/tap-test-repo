const path = require('path')

module.exports = {
  pluginOptions: {
    electronBuilder: {
      externals: ['fsevents'],
      customFileProtocol: './',
      chainWebpackMainProcess: (config) => {
        // Chain webpack config for electron main process only

      },
      chainWebpackRendererProcess: (config) => {
        // Chain webpack config for electron renderer process only (won't be applied to web builds)
      },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/main/background.js',
      preload: 'src/main/preload.js',
      // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
      rendererProcessFile: 'src/renderer/main.js',
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      mainProcessWatch: ['backend/'],
      // Provide a list of arguments that Electron will be launched with during "electron:serve",
      // which can be accessed from the main process (src/background.js).
      // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
      // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
      // mainProcessArgs: ['--arg-name', 'arg-value'],
      builderOptions: {
        extraResources: [
          
            // The pattern to include your HTML files
            './backend/templates/**'
            // The destination where you want to place the files in the final build
          
        ],
        "win": {
          "icon": "public/icon.icns",
          "extraResources": [
            "demo_database"
          ],
          "target": [
            "NSIS"
          ],
        },
        "nsis": {
          "deleteAppDataOnUninstall": true
        },
        "linux": {
          "extraResources": [
            "demo_database"
          ],
          "target": ["deb"]
        },
        "mac": {
          "extraResources": [
            "demo_database"
          ]
        }
      }
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "./src/renderer"),
        "~": path.join(__dirname, "./common")
      },
      extensions: [
        '.js', '.vue', '.json', 'pg', 'tedious', 'pg-hstore',
        '.wasm',
        '.mjs',
        '.jsx',
      ],
      plugins: [],
      fallback: { 
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
      },
    },
    watchOptions: {
      poll: true,
    },
    devServer: {
      liveReload: true,
      hot: false,
      client: {
        logging: 'info',
      },
    },
  },
  pwa: {
    iconPaths: {
      favicon32: './icon.icns',
      favicon16: './icon.icns',
      appleTouchIcon: './icon.icns',
      maskIcon: './icon.icns',
      msTileImage: './icon.icns',
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
}