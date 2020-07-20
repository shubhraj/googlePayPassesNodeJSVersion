//let auth = require("google-auth-library");
const {google} = require('googleapis');
let Conf = require('./conf');
let config = new Conf();
var request = require('request');
let rp = require("request-promise");
let googleJWT = require('googleapis').google.auth.JWT;

const scopes = config.SCOPES;
const offerClassApi = "https://walletobjects.googleapis.com/walletobjects/v1/offerClass";


var serviceAccount = require("./creds");
const HEADERS = Object.freeze({
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
});

class RestMethods {
    async getAccessToken() {
        let jwtClient = new googleJWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            config.SCOPES
        );

        let data = await jwtClient.authorize();
        let accessToken = data.access_token;
        return accessToken;
    };

    async insertClass(verticalType, payload) {
        let response;

        let accessToken = await this.getAccessToken();
        let url = `${offerClassApi}/?access_token=${accessToken}`;

        const options = {
            url: url,
            json: true,
            body: payload,
            resolveWithFullResponse: true,
            headers: HEADERS
        };

        try {
            response = await rp.post(options);
        } catch (err) {
            response = err;
        }

        return response;
    }

    async insertObject(verticalType, payload) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        };

        let jwtClient = new google.auth.JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            scopes
        );

        let data = await jwtClient.authorize();
        //Define insert() REST call of target vertical
        let accessToken = data.access_token;

        console.log("insert object : " + accessToken);
        let isValidData = await this.validateData(data);
        if (isValidData) {


            let url = `https://walletobjects.googleapis.com/walletobjects/v1/offerObject/?access_token=${accessToken}`;

            var options = {
                url: url,
                body: payload,
                json: true,
                headers: headers
            }, response;

            var promise = new Promise((resolve, reject) => {
                request.post(options, function (error, response) {

                    if (error) {
                        reject(error);
                    }
                    resolve(response);
                });
            });

            return promise;
        }
    }

    async validateData(data) {
        if (data.access_token === null) {
            console.log("Provided service account does not have permission to generate access tokens");
            return false;
        } else if (data === undefined) {
            console.log("Error making request to generate access token:");
            return false;
        }
        return true;
    }

    async getClass(verticalType, classId) {
        let jwtClient = new google.auth.JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            scopes
        );

        let data = await jwtClient.authorize();

        let isValidData = await this.validateData(data);

        if (isValidData) {
            let accessToken = data.access_token;
            let url = `https://walletobjects.googleapis.com/walletobjects/v1/offerClass/${classId}`;
            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            };

            var options = {
                method: 'GET',
                url: url,
                headers: headers,
                auth: {
                    'bearer': accessToken
                }
            };

            var promise = new Promise((resolve, reject) => {
                request.get(options, function (error, response) {

                    if (error) {
                        reject(error);
                    }
                    resolve(response);
                });
            });

            return promise;
        }
    }

    async getObject(verticalType, objectId) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        };

        let jwtClient = new google.auth.JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            scopes
        );

        let data = await jwtClient.authorize();
        let isValidData = await this.validateData(data);

        if (isValidData) {
            let accessToken = data.access_token;
            let url = `https://walletobjects.googleapis.com/walletobjects/v1/offerObject/${objectId}`;

            var options = {
                method: 'GET',
                url: url,
                headers: headers,
                auth: {
                    'bearer': accessToken
                }
            };

            var promise = new Promise((resolve, reject) => {
                request.get(options, function (error, response) {

                    if (error) {
                        reject(error);
                    }
                    resolve(response);
                });
            });

            return promise;

        }

    }
}

module.exports = RestMethods;