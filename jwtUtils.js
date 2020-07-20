var config = require('./config');
var jwt = require('jsonwebtoken');
var serviceAccount = require("./creds");
const crypto = require('crypto');


class JwtUtils {
    constructor(){
        this.audience = config.AUDIENCE;
        this.type = config.JWT_TYPE;
        this.iss = config.SERVICE_ACCOUNT_EMAIL_ADDRESS;
        this.origins = config.ORIGINS;
        this.iat = Math.floor(Date.now() / 1000) - 30 ;
        this.payload = {};
    }

    addOfferObject(resourcePayload){
        this.payload['offerObjects'] = [resourcePayload];
        console.log(this.payload);
    }

   async generateUnsignedJwt(){
      let  unsignedJwt = {};
        unsignedJwt['iss'] = this.iss;
        unsignedJwt['aud'] = this.audience;
        unsignedJwt['typ'] = this.type;
        unsignedJwt['iat'] = this.iat;
        unsignedJwt['payload'] = this.payload;
        unsignedJwt['origins'] = this.origins;

        return unsignedJwt
    }

    async generateSignedJwt(){
       let jwtToSign = await this.generateUnsignedJwt();
       let signedJwt = jwt.sign(jwtToSign, serviceAccount.private_key, { algorithm: 'RS256' });
       return signedJwt;
    }
}

module.exports = JwtUtils;