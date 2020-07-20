let prompt = require("prompt");

async function confirmWithPrompt(msg) {
    msg = msg || "Are you sure you want to continue? (y/n) ";
    let result = await getFromPrompt(msg);
    return ["y", "ya", "yes", "yup", "yeah", "yeehaw", "affirmative"].includes(result.toLowerCase());
}

function getFromPrompt(promptDescription, options = {}) {
    return new Promise(function(resolve, reject) {
        var schema = {
            properties: {
                [promptDescription]: {
                    description: promptDescription,
                    required: true,
                    ...options
                }
            }
        };

        prompt.message = "";
        prompt.start();

        prompt.get(schema, function (err, result) {
            if (err || !result) {
                reject(err || "Process aborted");
            }
            resolve(result[promptDescription]);
        });
    });
}

async function getCredentials() {
    return {
        user: await getFromPrompt("username"),
        password: await getFromPrompt("password", {hidden: true, replace: '*'})
    };
}

module.exports = {
    confirmWithPrompt,
    getCredentials,
    getFromPrompt
};