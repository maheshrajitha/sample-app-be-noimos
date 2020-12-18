
class AppError extends Error {
    constructor(error, exception, statusCode){
        super()
        this.error = error || "Application Error";
        if (process.env.DEBUG == "true")
            this.exception = exception;
        this.statusCode = statusCode || 400;
    }
}

exports.AppError = AppError

exports.CommonError = {
    PAGE_NOT_FOUND: { message: "page not found", code: "PAGE_NOT_FOUND" },

    UNAUTHORIZED: { message: "Unauthorized", code: "UNAUTHORIZED" },

    DATABASE_ERROR: { message: "Database Error", code: "DATABASE_ERROR" },

    FILE_UPLOAD_ERROR: { message: "File Upload Error", code: "FILE_UPLOAD_ERROR" },

    CACHE_ERROR: { message: "Cache Error", code: "CACHE_ERROR" },

    INVALID_REQUEST: { message: "Invalid Request", code: "INVALID_REQUEST" },

    MISSING_QUERY_DATA: { message: "Missing Query Data", code: "MISSING_QUERY_DATA"},

    INSUFFICIENT_DATA: { message: "Insufficient Data", code: "INSUFFICIENT_DATA" }
};
