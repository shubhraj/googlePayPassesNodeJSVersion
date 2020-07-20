const path = require('path');

class Conf {
    constructor(){
        this.SERVICE_ACCOUNT_EMAIL_ADDRESS = "";
        this.SERVICE_ACCOUNT_FILE = path.join("nodeJS","creds.json");
        this.ISSUER_ID = "";
        this.AUDIENCE = "";
        this.JWT_TYPE = "";
        this.SCOPES = [''];
        this.ORIGINS = [''];
    }
}

module.exports = Conf;