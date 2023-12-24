if (typeof window !== 'undefined' && !('process' in window)) {
  // @ts-ignore
  window.process = {}
}
const env = process.env

exports.DB = {
  name: env.VUE_APP_DB_NAME_DEMO != 'undefined' ? env.VUE_APP_DB_NAME_DEMO : env.VUE_APP_DB_NAME_STG,
  username: env.VUE_APP_DB_USER != 'undefined' ? env.VUE_APP_DB_USER : 'postgress',
  password: env.VUE_APP_DB_PASS != 'undefined' ? env.VUE_APP_DB_PASS : 'H3jkHtyUyh!89k',
  port: env.VUE_APP_DB_PORT != 'undefined' ? env.VUE_APP_DB_PORT : 5432,
  host: env.VUE_APP_DB_HOST != 'undefined' ? env.VUE_APP_DB_HOST : 'dbh3odev.cw14djtrv8xq.us-east-1.rds.amazonaws.com',
}


exports.ENVIROMENT = {
  isdev: env.NODE_ENV !== 'production' ? true : false,
  isMac: process.platform === 'darwin'? true: false,
  allowDemo: true,
}


exports.KEYS = {
  storage: '4u7x!A%D*G-KaPdS',
  passphrase: 'B?D(G+KbPeShVmYq3t6w9z$C&F)H@McQfTjWnZr4u7x!A%D*G-KaNdRgUkXp2s5v',
  store: 'oiV32mVp5lOwYneFESjrWq2xFByNOvN',
}


exports.PORTS = {
  app: 3331,
}

exports.DEVTOOL = {
  path: process.platform === 'darwin'? env.VUE_APP_MAC: env.VUE_APP_LINUX,
  extension: 'nhdogjmejiglipccpnnnanhbledajbpd/6.5.0_0',
}