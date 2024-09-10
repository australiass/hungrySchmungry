// Authenticate user
function isAuthenticated(req, res, next) {
    if (req.cookies && req.cookies.userEmail) { 
        next();
    } else {
        res.status(401).send("Unauthorised user");
        res.render('login', { title: 'Login' });
    }
}

module.exports = isAuthenticated;