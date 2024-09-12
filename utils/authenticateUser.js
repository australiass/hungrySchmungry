// Authenticate user
function isAuthenticated(req, res, next) {
    if (req.cookies && req.cookies.userEmail) { 
        next();
    } else {
        res.status(401).redirect('/login');
    }
}

module.exports = isAuthenticated;