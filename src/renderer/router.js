import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import AuthLayout from '@/layouts/Auth'
import MainLayout from '@/layouts/Main'
import store from '@/store'
var notifier = require('../../common/Notifier')


const router = createRouter({
  base: process.env.BASE_URL,
  scrollBehavior(to, from) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
      }
    }
    return { left: 0, top: 0 }
  },
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // VB:REPLACE-NEXT-LINE:ROUTER-REDIRECT
      redirect: '/system-sections/dashboard',
      component: MainLayout,
      meta: {
        checkDBRequired: true,
        authRequired: true,
        hidden: true,
      },
      children: [
        // VB:REPLACE-START:ROUTER-CONFIG
        {
          path: '/system-sections/dashboard',
          meta: {
            title: 'Quick View',
            icon: 'fas fa-home',
            showSelectSystems: true,
            showSelectFramework: true
           },

          component: () => import('./views/dashboard/alpha'),
        },
        {
          path: '/users',
          redirect: '/users/list',
          meta: {
            title: 'Users',
          },
          component: () => import('./views/users'),
          children: [
            {
              path: '/users/profile/:id',
              component: () => import('./views/users/profile'),
              meta: {
                title: 'User Profile',
                adminPage: true,
                parents: [{
                    path: '/users',
                    title: 'Users',
                    icon: 'fas fa-users'
                 }],
             },
            },
            {
              path: '/users/list',
              component: () => import('./views/users/list'),
              adminPage: true,
              meta: {
                icon: 'fas fa-users',
                parents: []
               },
            }
          ]
        },
        {
          path: '/roles',
          meta: {
            adminPage: true,
            title: 'Roles',
            icon: 'fas fa-dice-d20'

          },
          component: () => import('./views/roles'),
        },
        {
          path: '/roles/profile/:id',
          meta: {
            adminPage: true,
            title: 'Roles',
            icon: 'fas fa-dice-d20'

          },
          component: () => import('./views/roles/details'),
        },
        {
          path: '/NIST-controls/:framework',
          meta: {
            adminPage: true,
            title: 'NIST controls',
            icon: 'fas fa-list-alt'

           },
          component: () => import('./views/NIST-controls'),
        },
        {
          path: '/control-approval',
          meta: {
            adminPage: true,
            title: 'Control Approval',
            icon: 'fas fa-file-signature'
           },
          component: () => import('./views/pre-configurations/main'),
        },
        {
          path: '/ATO-approval',
          meta: {
            adminPage: true,
            title: 'ATO Approval',
            icon: 'fas fa-check-double'

         },
          component: () => import('./views/pre-configurations/main'),
        },
        {
          path: '/system-credentials',
          meta: {
            adminPage: true,
            title: 'System Credentials',
            icon: 'fas fa-key'

           },
          component: () => import('./views/pre-configurations/main'),
        },

        {
          path: '/organization',
          meta: {adminPage: true, title: 'General Settings', icon: 'fa fa-sitemap mr-2'},
          component: () => import('./views/organization'),
        },
        {
          path: '/license',
          meta: {adminPage: true, title: 'Upgrade License', icon: 'fa fa-sitemap mr-2'},
          component: () => import('./views/license'),
        },
        {
          path: '/color-theme',
          meta: {adminPage: true, title: 'Color Theme', icon: 'fa fa-sitemap mr-2'},
          component: () => import('./views/color-theme'),
        },
        {
          path: '/interrogator',
          meta: {adminPage: true, title: 'Interrogator', icon: 'fa fa-sitemap mr-2'},
          component: () => import('./views/interrogator'),
        },
        {
          path: '/settings',
          meta: { adminPage: true, title: 'System', icon: 'fe fe-settings mr-2'},
          component: () => import('./views/settings'),
        },
        {
          path: '/STIGs',
          meta: {  adminPage: true, title: 'STIGs' },
          component: () => import('./views/control-sets/STIGs'),
        },
        {
          path: '/deviations',
          meta: { adminPage: true, title: 'Deviations' },
          component: () => import('./views/control-sets/deviations'),
        },
        {
          path: '/system-sections/compliance',
          meta: {
            systemView: true,
            title: 'Compliance Overview',
            showSelectSystems: true,
            showSelectFramework: true
           },
          component: () => import('./views/system-sections/main'),
        },
        {
          path: '/system-sections/devices',
          meta: {
            systemView: true,
            title: 'Target(s)',
            showSelectSystems: true,
            showSelectFramework: false,

           },
          component: () => import('./views/system-sections/Devices'),
        },
        {
          path: '/device/profile/:id',
          meta: {

            title: 'Target',
            showSelectSystems: false,
            showSelectFramework: false
          },
          component: () => import('./views/system-sections/Devices/details'),
        },
        {
          path: '/device/category/:id',
          meta: {

            title: 'Category',
            showSelectSystems: false,
            showSelectFramework: false
          },
          component: () => import('./views/system-sections/Devices/category'),
        },
        {
          path: '/systems',
          meta: {
            title: 'Systems',
            showSelectSystems: false,
            showSelectFramework: false,
           },
          component: () => import('./views/system-sections/System'),
        },
        {
          path: '/systems/profile/:id',
          meta: {
            title: 'System',
            showSelectSystems: false,
            disabledSelectSystems: true,
            showSelectFramework: false
          },
          component: () => import('./views/system-sections/System/details'),
        },
        {
          path: '/system-sections/ip-ranges',
          meta: {
            systemView: true,
            title: 'IP Ranges',
            showSelectSystems: true,
            showSelectFramework: false
           },
          component: () => import('./views/system-sections/main'),
        },
        {
          path: '/system-sections/dashboard',
          meta: {
            systemView: true,
            title: 'Dashboard',
            showSelectSystems: true,
            showSelectFramework: true
           },
          component: () => import('./views/dashboard/alpha'),
        },
        {
          path: '/system-sections/ssp',
          meta: {
            systemView: true,
            title: 'System Security Plan',
            showSelectSystems: true,
            showSelectFramework: true
           },
          component: () => import('./views/system-sections/main'),
        },
        {
          path: '/system-sections/custom-controls',
          meta: {
            systemView: true,

            title: 'Custom Controls',
            showSelectSystems: true,
            showSelectFramework: false
           },
          component: () => import('./views/system-sections/main'),
        },
        {
          path: '/custom-controls/profile/:id',
          meta: {
            title: 'Custom control',
            showSelectSystems: true,
            disabledSelectSystems: true,
            showSelectFramework: false,

           },
          component: () => import('./views/system-sections/CustomControls/CustomControl'),
        },
        {
          path: '/system-sections/framework-controls',
          meta: {
            systemView: true,

            title: 'Framework controls',
            showSelectSystems: true,
            showSelectFramework: true
           },
          component: () => import('./views/system-sections/main'),
        },
        {
          path: '/framework-controls/profile/:id',
          meta: {

            title: 'framework control',
            showSelectSystems: true,
            disabledSelectSystems: true,
            showSelectFramework: false,


          },
          component: () => import('./views/system-sections/FrameworkControls/FrameworkControl'),
        },
        {
          path: '/system-sections/inheritance',
          meta: {
            systemView: true,
            title: 'Inheritance',
            showSelectSystems: true,
            showSelectFramework: true
           },
          component: () => import('./views/system-sections/main'),
        },
        {
          path: '/system-sections/POA&Ms',
          meta: {
            systemView: true,
            title: 'POA&Ms',
            icon: 'fas fa-boxes',
            showSelectSystems: true,
            showSelectFramework: true
         },
         component: () => import('./views/system-sections/main'),
        },
        {
          path: '/command/:type/:vuln_num/:vuln_id',
          meta: {
            adminPage: true,


          },
          component: () => import('./views/system-sections/command'),
        },


        // VB:REPLACE-END:ROUTER-CONFIG
      ],
    },

    // System Pages
    {
      path: '/auth',
      component: AuthLayout,
      redirect: 'auth/login',
      children: [
        {
          path: '/auth/404',
          name: 'route404',
          meta: {
            title: 'Error 404',
          },
          component: () => import('./views/auth/404'),
        },
        {
          path: '/auth/500',
          meta: {
            title: 'Error 500',
          },
          component: () => import('./views/auth/500'),
        },
        {
          path: '/auth/login',
          name: 'login',
          meta: {
            title: 'Sign In',
            checkDBRequired: true,
          },
          component: () => import('./views/auth/login'),
        },
        {
          path: '/auth/database/:modeParam',
          props: true,
          meta: {
            adminPage: true,
            title: 'Database connection',
          },
          component: () => import('./views/auth/database'),
        },
      ],
    },

    // Redirect to 404
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'route404' },
    },
  ],
})

router.beforeEach(async(to, from, next) => {

  NProgress.start()
    // notifier.emit('apiClient-cancel', {});
  // console.log(to, from)
  // if (to.matched.some((record) => record.meta.authRequired)) {
  //   console.log("to.matched")

  // await store.dispatch('database/DATABASE_CONNECTION_CHECK',{ payload: { operation: 'check' } }).then(async function (response) {
    // console.log("DATABASE_CONNECTION_CHECK")


  //   if(!store.state.database.hasConnection){
  //   console.log("store.state.database.hasConnection")

  //     next({
  //       path: '/auth/database',
  //       query: { redirect: route.fullPath },
  //     })
  //     return
  //   }

  //   await store.dispatch('user/LOAD_CURRENT_ACCOUNT').then(async function (response) {
  //     console.log("LOAD_CURRENT_ACCOUNT")

  //         if (!store.state.user.authorized) {
  //           next({
  //             path: '/auth/login',
  //             query: { redirect: to.fullPath },
  //           })
  //           return
  //         }else{
  //           next()
  //         }


    // })

  //   NProgress.done()
  // }).catch(error => {
  //   NProgress.done()
  //   console.log("catch")

  //   next({
  //       path: '/auth/database',
  //       query: { redirect: to.fullPath },
  //     })
  //     return
  // })
  // }else{
  //   NProgress.done()
  //   console.log("else LOAD_CURRENT_ACCOUNT")

    // await store.dispatch('user/LOAD_CURRENT_ACCOUNT').then(async function (response) {
      if (to.matched.some((record) => record.meta.authRequired)) {
          if (!store.state.user.authorized) {
            next({
              path: '/auth/login',
              query: { redirect: to.fullPath },
            })
          } else {
            next()
          }
        } else {
          next()
        }
      NProgress.done()


    // })
  // }

  // if (to.matched.some((record) => record.meta.authRequired)) {
  // console.log("if 1")
  //   if (!store.state.user.authorized) {
  //     next({
  //       path: '/auth/login',
  //       query: { redirect: to.fullPath },
  //     })
  //   } else {
  //     console.log("else 2")

  //     next()
  //   }
  // } else {
  //   console.log("else 1")

  //   next()
  // }

})

export default router
