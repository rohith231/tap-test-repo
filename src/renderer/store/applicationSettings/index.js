import { encryptStorage } from '@/utils'

const STORED_SETTINGS = storedSettings => {
  const applicationSettings = {}
  Object.keys(storedSettings).forEach(key => {
    try {
      console.log("key ", `app.applicationSettings.${key}`)
      console.log("value ", encryptStorage.getItem(`app.applicationSettings.${key}`))
      const item = JSON.parse(encryptStorage.getItem(`app.applicationSettings.${key}`) || null);  
      console.log("item ", item)
      applicationSettings[key] = typeof item !== null ? item : storedSettings[key]
      if (applicationSettings[key] === null) applicationSettings[key] = storedSettings[key]
    } catch (error) {
      console.log(error)
    }
    
    
  })
  return applicationSettings
}

export default {
  state: {
    ...STORED_SETTINGS({
      // Read docs for available values: https://docs.visualbuilder.cloud
      // VB:REPLACE-START:SETTINGS
      masterName: 'TAP',
      theme: 'default',
      locale: 'en-US',
      isSidebarOpen: false,
      isSupportChatOpen: false,
      isMobileView: false,
      isMobileMenuOpen: false,
      isMenuCollapsed: false,
      isPreselectedOpen: false,
      preselectedVariant: 'default',
      menuLayoutType: 'left',
      routerAnimation: 'slide-fadein-up',
      menuColor: 'dark',
      authPagesColor: 'gray',
      isAuthTopbar: true,
      primaryColor: '#4b7cf3',
      leftMenuWidth: 256,
      isMenuUnfixed: false,
      isMenuShadow: true,
      isTopbarFixed: true,
      isTopbarSeparated: false,
      isGrayTopbar: false,
      isContentMaxWidth: false,
      isAppMaxWidth: false,
      isGrayBackground: false,
      isCardShadow: true,
      isSquaredBorders: false,
      isBorderless: false,
      layoutMenu: 'simply',
      layoutTopbar: null,
      layoutBreadcrumbs: 'v2',
      layoutFooter: 'v1',
      flyoutMenuType: 'flyout',
      flyoutMenuColor: 'red',

      // VB:REPLACE-END:SETTINGS
    }),
  },
  mutations: {
    CHANGE_SETTING(state, payload) {
      encryptStorage.setItem(`app.applicationSettings.${payload.setting}`, JSON.stringify(payload.value))
      state[payload.setting] = payload.value
    },
    CHANGE_SETTING_BULK(state, payload) {
      const applicationSettings = {}
      Object.keys(payload).forEach(key => {
        encryptStorage.setItem(`app.applicationSettings.${key}`, JSON.stringify(payload[key]))
        applicationSettings[key] = payload[key]
        state[key] = payload[key]
      })
    },
    SETUP_URL_SETTINGS(state, payload) {
      let queryParams = payload
      let keys = false
      if (payload.redirect) {
        const str = payload.redirect
        const subs = str.substring(str.indexOf('?') + 1)
        if (str.indexOf('?') >= 0) {
          queryParams = JSON.parse(
            '{"' +
              decodeURI(subs)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
              '"}',
          )
        }
      }
      delete queryParams.redirect
      keys = Object.keys(queryParams)
      if (keys.length) {
        keys.forEach(key => {
          let value
          switch (queryParams[key]) {
            case 'false':
              value = false
              break
            case 'true':
              value = true
              break
            default:
              value = queryParams[key]
              break
          }
          if (key in state) {
            state[key] = value
          }
        })
      }
    },
    SET_PRIMARY_COLOR(state, payload) {
      const { color } = payload
      const addStyles = () => {
        const styleElement = document.querySelector('#primaryColor')
        if (styleElement) {
          styleElement.remove()
        }
        const body = document.querySelector('body')
        const styleEl = document.createElement('style')
        const css = document.createTextNode(`:root { --vb-color-primary: ${color};}`)
        styleEl.setAttribute('id', 'primaryColor')
        styleEl.appendChild(css)
        body.appendChild(styleEl)
      }
      addStyles()
      state.primaryColor = color
      encryptStorage.setItem('app.applicationSettings.primaryColor', color)
    },
    SET_THEME(state, payload) {
      const { theme } = payload
      const nextTheme = theme === 'dark' ? 'dark' : 'default'
      document.querySelector('html').setAttribute('data-vb-theme', nextTheme)
      state.theme = nextTheme
      encryptStorage.setItem('app.applicationSettings.theme', nextTheme)
    },
  },
  actions: {},
  getters: {
    applicationSettings: state => state,
  },
}