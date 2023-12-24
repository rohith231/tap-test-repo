import { createStore } from 'vuex'
import user from './user'
import applicationSettings from './applicationSettings'
import database from './database'
import users from './users'
import roles from './roles'
import auth from './auth'
import notifications from './notifications'
import setting from './setting'
import controls from './controls'
import systems from './systems'
import STIGs from './STIGs'
import approvalProcess from './approvalProcess'
import organization from './organization'
import checkControls from './checkControls'
import ip from './ip'
import device from './device'
import devicecategory from './devicecategory'
import compliance from './compliance'
import deviations from './deviations'
import interrogator from './interrogator'
import dashboard from './dashboard'
import ssp from './ssp'
import audit from './audit'
import search from './search'
import license from './license'

export default createStore({
  modules: {
    applicationSettings,
    database,
    user,
    auth,
    dashboard,
    users,
    roles,
    setting,
    controls,
    systems,
    STIGs,
    deviations,
    ip,
    ssp,
    audit,
    device,
    devicecategory,
    approvalProcess,
    organization,
    checkControls,
    compliance,
    interrogator,
    notifications,
    search,
    license
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {},
})
