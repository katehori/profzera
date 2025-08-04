const errorHandler = (err, req, res, next) => {
    console.error("An unexpected error occurred:", err);
    res.status(err.status || 500).json({ error: err.message || "Unexpected error" });
};

module.exports = errorHandler;