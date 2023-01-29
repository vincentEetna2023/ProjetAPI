module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    /*const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(400).json({ message: "A token is required for authentication" });
    }*/
    if (typeof err === "string") {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === "ValidationError") {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === "UnauthorizedError") {
        // jwt authentication error
        return res.status(401).json({ message: "Invalid Token" });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}