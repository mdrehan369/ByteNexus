class ApiError{
    constructor(statusCode, message, error) {
        // super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.data = null;
        this.error = error;
    }
}

export { ApiError }

// class ApiError extends Error {
//     constructor(
//         statusCode,
//         message= "Something went wrong",
//         errors = [],
//         stack = ""
//     ){
//         super(message)
//         this.statusCode = statusCode
//         this.data = null
//         this.message = message
//         this.success = false;
//         this.errors = errors

//         if (stack) {
//             this.stack = stack
//         } else{
//             Error.captureStackTrace(this, this.constructor)
//         }

//     }
// }

// export {ApiError}