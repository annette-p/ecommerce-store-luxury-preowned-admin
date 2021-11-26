const checkIfAuthenticatedAdmin = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.info.type === "Admin") {
            if (req.url !== '/settings/change-password' && req.session.user.passwordExpired === true) {
                req.flash('success_messages', "Please change your password :)");
                res.redirect('/settings/change-password');
            } else {
                next();
            }
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