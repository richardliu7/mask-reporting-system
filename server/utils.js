const loginRequiredMiddleware = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(403).json({
            authenticated: false,
            message: "Please login to continue!"
        })
    }
}

export default loginRequiredMiddleware;