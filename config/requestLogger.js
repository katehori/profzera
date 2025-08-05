const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${decodeURI(req.url)}`);
    next();
};

module.exports = requestLogger