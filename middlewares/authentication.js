const checkIfAuthenticatedAdmin = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.info.type === "Admin") {
            next();
        } else {
            if (req.url !== "/") {
                req.flash('error_messages', 'You are not authorized to access this page');
            }
            res.redirect('/login');
        }
        
    } else {
        if (req.url !== "/") {
            req.flash('error_messages', 'You need to sign in to access this page');
        }
        res.redirect('/login');
    }
}

module.exports = { checkIfAuthenticatedAdmin };