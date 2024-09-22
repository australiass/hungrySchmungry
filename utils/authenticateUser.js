// Authenticate user
function isAuthenticated(req, res, next) {
	// if the user's cookie is set, allow the async function to continue
    if (req.cookies && req.cookies.userEmail) { 
        next();
    } else { // Otherwise, send the user to the login page
        res.status(401).redirect('/login'); 
    }
}
// Export the function for use in other files
module.exports = isAuthenticated;