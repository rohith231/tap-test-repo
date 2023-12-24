# for mac
xcode-select --install

# dependencies on software
postgres 14 (for commands pg_restore and dropdb)

# working versions
node 16.15.1
npm 8.11.0

# package setup
npm install
# run locally
npm run electron:serve
# to build
npm run build:publish


### following steps are obsolete

# Setup on windows
1. Download [Node.js](https://nodejs.org/dist/v14.17.3/node-v14.17.3-x64.msi)
2. Download [Postgresql](https://www.postgresql.org/download/windows/)
3. Download [Visual Studio Community 2019](https://my.visualstudio.com/Downloads?q=visual%20studio%202019&wt.mc_id=o~msft~vscom~older-downloads) - download windows 10 Sdk + MSVC v141 2017
4. Download [PgAdmin4](https://www.pgadmin.org/download/pgadmin-4-windows/) v4.3.
5. Run the following commands in terminal:
    - `npm install -g node-gyp`
    - `npm install -g postgresql` 
    - `npm install -g pg` 
    - `npm install -g win-node-env` 

## Enviroment variables setup
- Add PostgreSQL bin to envrioment variable
    > Go to enviroment variables -> Path -> New -> C:\Program Files\PostgreSQL\10\bin
- Add SET NODE_ENV=development

## converting docker run application to desktop electron app
https://jordan-eckowitz.medium.com/make-any-website-into-a-desktop-app-with-1-line-of-code-ba53d59bf9e1
npm install nativefier -g
nativefier --name "HTAP" "http://localhost:8080"

## Code signing on mac
check valid identities with:
security find-identity -v -p codesigning

to setup certs:
a. install x-code. settings -> accounts -> login with H3O account details (ANIL can provide)
b. create new mac distribution cert if it is not already saved in your keychain
c. export the cert and double click the downloaded cert to install to keychain. Should appear under System folder.
d. install root and intermediate certs from here:
https://www.apple.com/certificateauthority/
root: https://www.apple.com/appleca/AppleIncRootCertificate.cer
intermediate: https://www.apple.com/certificateauthority/DevAuthCA.cer

check valid identities should show output as follows:
  1) F574568F4719599346BB75F09D69C9DCCD1F4ECD "Apple Distribution: H3O Labs, LLC (QU9F229J64)"
