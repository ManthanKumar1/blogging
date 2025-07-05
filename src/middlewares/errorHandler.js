// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error("💥 Error caught in middleware:");
    console.error(err); // Logs full error object for debugging

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        console.error("⚠️ Mongoose Validation Error:", err.errors);
        return res.status(400).json({
            status: false,
            message: 'Validation Error',
            errors: err.errors,
        });
    }

    // Handle express-validator errors (manually thrown from controller)
    if (Array.isArray(err.errors)) {
        console.error("⚠️ Express-Validator Errors:", err.errors);
        return res.status(400).json({
            status: false,
            message: 'Validation failed',
            errors: err.errors.map(e => ({ field: e.param, msg: e.msg }))
        });
    }

    // General fallback
    return res.status(err.statusCode || 500).json({
        status: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
