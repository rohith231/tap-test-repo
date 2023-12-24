const {utils, constants, authentication, flush, cache} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/license`;
const {Op} = require('sequelize');
const crypto = require('crypto');
const fs = require('fs');
const { ENVIROMENT } = require('../../common/config/env')

const path = require("path");
const dataPath = !ENVIROMENT.isdev
? path.join(global.AppPath, '../../common/extraResources')
: path.join(process.resourcesPath, '/common/extraResources');
module.exports = (app) => {
  

  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      // const {userInfo} = req.headers;
      const {} = req.query;


      // const userInfo = app.get("cache").getItem('user-info')
     
      const license = await app.get("models").License.findOne({
        where: {},
        order: [ [ 'createdAt', 'DESC' ]]
      });

      var result = {};
      if(license == null){
       result = {
        "license_name" : "Trial Edition",
        "showaddlicense" : true
       }
      }else{
        const encryptedLicense = Buffer.from(license.licensekey, 'base64');
        const originalData = encryptedLicense.slice(256);
        var decrypted_data = decryptString(originalData.toString('utf-8'))
        var data = JSON.parse(decrypted_data.toString('utf8'))
        result ={
          "license_name": "Full Edition",//data.license_name,
          "license_type": data.license_type,
          "effective_date": data.effective_date,
          "expiry_date": data.expiry_date,
         "max_info_system":data.usage_limits.max_info_system,
         "max_devices":data.usage_limits.max_devices,
         "showaddlicense":false
        }
       }
       return utils.response(statusCodes.SUCCESS, result, req, res);
      
    } catch (error) {
      console.log(error);
      return utils.response(statusCodes.SERVER_ERROR, error, req, res);
    }
  });

  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const licenseData = req.body
      if (licenseData.licensekey==null || licenseData.licensekey == "") {
       return utils.response(statusCodes.BAD_REQUEST, "License Key Couldn't Be Empty", req, res)
      }else{
      const result = await decodeAndVerifyLicense(licenseData.licensekey)
      if(result){
        const currentlicense = await app.get("models").License.findOne({
          where: {},
          order: [ [ 'createdAt', 'DESC' ]]
        });
      if(currentlicense == null){
         const license = await app.get('models').License.create({ licensekey: licenseData.licensekey })
          return utils.response(statusCodes.SUCCESS, license, req, res)
      }else{
        console.log("currentlicense", currentlicense.is)
       const license = await app.get('models').License.update(
        {
          licensekey: licenseData.licensekey
        }, 
        {
          where: {
            id: currentlicense.id
          },
        })
        console.log("updatedlicense", license)
        return utils.response(statusCodes.SUCCESS, license, req, res)
       }
      }else{
      return utils.response(statusCodes.BAD_REQUEST, "Invalid License Key", req, res)
      }
      }
    } catch (err) {
      let errMessage = err
      if (
        err.name === 'SequelizeUniqueConstraintError' ||
        err.name === 'SequelizeValidationError'
      ) {
        errMessage = ' '
        err.errors.forEach(error => {
          errMessage += ' ' + error.message + ' \n'
        })
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res)
    }
  })

 async function decodeAndVerifyLicense(licensekey) {
    try {

      enc_lic = licensekey
      console.log("enc_lic", enc_lic)
       // enc_lic = "sQDJTUcUSOU3hXtiF+ghBnPjqzzScB95g/aaBuINJHlZXZkzE+vgNy3MLamShktslHwIrbzOvxCyNMZxhXSVDgaz3Udp37N9/KRSLH1maDe+nIHbBCE5nMVu9p8YO5Fatm7h+cVpnp2SKZ3lhQHmH3c5Bwd77GKk1dsqWh0kszaMviLhGwCGkChby7hXydWA4g/xryTwXYYdkUMXAjYFFixIL66xaS4OheqzEh5jQ8YuuE87YN55FfC+xRkNIh177AEmP6XdBgs1B9DPYs+I/PpPDh8/fJGgg+gYgJ3Z+ZIGA1zwX9bp6nhy1p/gQlCLxo+fN5Mo+Wd3tggJxsn5pEdHL0YyMVFHcmlVbFBYQndRTXdiVUVuK2pNWXBFN1JXTTE4eFBhYko4dHMxUzdoSlRPZlF3c2dkTmd3USs0MCsvdlMwYjVpR01rd1NEanFaR3NEazJ0N01SdzhYaEFHN1FwZnVHMC9senB4Y21GMVNJakppTzJJTGY5aUxZcjF1VXdtWU9sNkNkeW16b1JRMk0wVktxZzF1TVZ5SVhySmNPNmE4WUw3L0dVQ1IyeDlPdVZyeGNSc0tQWHJFcTZGWGN3YjNKUzJEbkY0UzJQUmk0Z2lzZXBMUGN0cGx4WHFxQXRBNGZVWjhUMmpmVWt1bGs1bS8yRTBVQkxMTm5oZCs="
        //console.log('Reading base64-encoded "encrypted" license...');
        //const encryptedLicenseBase64 = fs.readFileSync('license.dat', 'utf8');
       // console.log('Reading public key...');
        const filepath = path.join(dataPath, 'public.pem')
        const publicKeyPem = fs.readFileSync(filepath, 'utf8');

        //console.log('Decoding base64-encoded "encrypted" license...');
        const encryptedLicense = Buffer.from(enc_lic, 'base64');

        // Separate the signature and the original data
        //console.log('Separating signature and original data...');
        const signature = encryptedLicense.slice(0, 256);  // Assuming 2048-bit key
        const originalData = encryptedLicense.slice(256);
        //console.log("originalData : " + originalData)
        decrypted_data = decryptString(originalData.toString('utf-8'))
        // Create a verification object
       // console.log('Creating a verification object...');
        const verify = crypto.createVerify('SHA256');

        // Update the verification data
        //console.log('Updating the verification data...');
        verify.update(originalData);
        // Set the verifier object to use the public key and RSA-PSS padding
        verify.end();
        // Perform the verification
       // console.log('Performing the verification...');
        const isVerified = verify.verify({
            key: publicKeyPem,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN,
        }, signature);

        if (isVerified) {
            console.log('Verification successful.');
            // Parse and pretty-print JSON
            const originalDataJSON = JSON.parse(decrypted_data.toString('utf8'));
           // console.log('Decrypted License:', JSON.stringify(originalDataJSON, null, 2));
             return true
        } else {
            console.log('Failed to verify the license.');
            return false
        }
    } catch (err) {
        console.error('An error occurred:', err);
        return false
    }
}
function decryptString(encryptedText) {
  // Use mainKey if key is not provided
  key = "d2d273f7e6e2c74ee63640d2fe4d40b8"
  // Ensure the key is in bytes
  const keyBytes = Buffer.from(key, 'utf-8');
  // Decode the Base64 encoded encrypted text
  const combined = Buffer.from(encryptedText, 'base64');
  // Extract the IV and the encrypted data
  const iv = combined.slice(0, 16); // AES block size is 16 bytes
  const encryptedData = combined.slice(16);
   // Create a new AES cipher object
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  // Decrypt the encrypted data
  const decryptedData = decipher.update(encryptedData) + decipher.final();
  // Return the decrypted data
  return decryptedData.toString('utf-8');
}


}
