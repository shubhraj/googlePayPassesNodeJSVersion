let ResourceDefinitions = require('./resourceDefinitions');
let resourceDefinitions = new ResourceDefinitions();
let RestMethods = require('./restMethods');
let restMethods = new RestMethods();
var jwt = require('jsonwebtoken');
var JwtUtils = require('./jwtUtils');
var jwtUtils = new JwtUtils();

const EXISTS_MESSAGE = "No changes will be made when saved by link. To update info, use update() or patch(). For an example, see yt\n";

const types = {
    OFFER: 1,
    EVENTTICKET: 2,
    FLIGHT: 3,    // # also referred to as Boarding Passes
    GIFTCARD: 4,
    LOYALTY: 5,
    TRANSIT: 6
}

class Services {
    constructor() {
        this.verticleTypes = types;
    }

    async makeSkinnyJwt(verticalType, classId, objectId) {
        let signedJwt = null,
            classResponse = null,
            objectResponse = null;

        try {
            let {classResourcePayload, objectResourcePayload} = await this.getClassAndObjectDefinitions(verticalType, classId, objectId, this.classResourcePayload, this.objectResourcePayload);

            // make authorized REST call to explicitly insert class into Google server.
            // if this is successful, you can check/update class definitions in Merchant Center GUI: https://pay.google.com/gp/m/issuer/list
            classResponse = await restMethods.insertClass(verticalType, classResourcePayload);
            console.log('\nMaking REST call to insert object');

            //make authorized REST call to explicitly insert object into Google server.
           // objectResponse = await restMethods.insertObject(verticalType, objectResourcePayload);

            //continue based on insert response status. Check https://developers.google.com/pay/passes/reference/v1/statuscodes

            //check class insert response. Will print out if class insert succeeds or not. Throws error if class resource is malformed.
            await this.handleInsertCallStatusCode(classResponse, "class", classId, null, null);

            //check object get response. Will print out if object exists or not. Throws error if object resource is malformed, or if existing objectId's classId does not match the expected classId
           // await this.handleInsertCallStatusCode(objectResponse, "object", objectId, classId, verticalType);

            //put into JSON Web Token (JWT) format for Google Pay API for Passes

            let googlePassJwt = new JwtUtils();
            googlePassJwt.addOfferObject(objectResourcePayload);

            signedJwt = await googlePassJwt.generateSignedJwt();

            return signedJwt;

        } catch (e) {
            console.log(e);
        }
    }

    /*loadObjectIntoJWT(verticalType, googlePassJwt, objectResourcePayload){
        googlePassJwt.addOfferObject(objectResourcePayload);
    }*/

    async handleInsertCallStatusCode(insertCallResponse, idType, id, checkClassId, verticalType) {
        if (insertCallResponse.statusCode == 200) {
            console.log(`${idType} ID: ${id} insertion success!\n`);
        } else if (insertCallResponse.statusCode == 409) { //id resource exists for this issuer account
            console.log(`${idType} ID : ${id} already exists. ${EXISTS_MESSAGE} `);

            if (idType === "object") {
                //To DO : Need to test this case. and restMethods.getObject();
                let getCallResponse = await restMethods.getObject(verticalType, id);
                let classIdOfObjectId = JSON.parse(getCallResponse.body)['classId'];
                if (classIdOfObjectId != checkClassId && checkClassId != null) {
                    console.error(`
                     the classId of inserted object is ${classIdOfObjectId}. 
                     It does not match the target classId ${checkClassId}. 
                     The saved object will not have the class properties you expect.
                     `);
                }
            }
        }
        else {
            console.log(`${idType} insert issue. ${insertCallResponse.body}`);
        }
    }

    async getClassAndObjectDefinitions(verticalType, classId, objectId, classResourcePayload, objectResourcePayload) {
        if (verticalType === "VerticalType.OFFER") {
            classResourcePayload = await resourceDefinitions.makeOfferClassResource(classId); //done till here...
            objectResourcePayload = await resourceDefinitions.makeOfferObjectResource(classId, objectId); // work from here...
        }

        return {classResourcePayload, objectResourcePayload};
    }

}


module.exports = Services;