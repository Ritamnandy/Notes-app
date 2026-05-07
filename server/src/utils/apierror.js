
class ApiError extends Error {
    constructor(
        statuscode,
        message = "Something wants wong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statuscode = statuscode
        this.message = message
        this.data = null
        this.success = false
        this.error = errors
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }