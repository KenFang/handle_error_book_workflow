const fetch = require("node-fetch");
const BOOKING_SERVICE = process.env.BOOKING_SERVICE;

class InvalidInputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidInputError';

        // clean up the stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidInputError);
        }
    }
}

class TransientError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TransientError';

        // clean up the stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransientError);
        }
    }
}

async function checkResponseStatus(response) {
    if(response.ok) {
        return response
    } else if(response.status === 418)  {
        throw new InvalidInputError(`The HTTP status of the response is ${response.status} ; Invalid Input Error`);
    } else if (response.status === 503) {
        throw new TransientError(`The HTTP status of the response is ${response.status} ; Transient Error`);
    } else {
        throw new Error("There was an unknown error with museum booking process.");
    }
}

exports.handler = async (evt) => {
    // fetch the request
    let response = await fetch(BOOKING_SERVICE, {
        method: 'POST',
        body: JSON.stringify(evt)
    })
    let body = await checkResponseStatus(response);
    return await body.json();
}