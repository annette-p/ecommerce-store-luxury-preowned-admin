const express = require("express");
const cors = require('cors');
const hbs = require("hbs");
const wax = require("wax-on");

// for sessions and flash messages
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');

// read from .env file
require("dotenv").config();

// global variables
global.apiUrl = process.env.BACKEND_API_ENDPOINT

const { checkIfAuthenticatedAdmin } = require("./middlewares/authentication");

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// use cors
app.use(cors());

// static folder
app.use(express.static("public"));
// app.use(express.static( "views/images"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// use the csurf middleware
app.use(csrf());

// global middleware 
app.use(function(req, res, next) {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
})

// setup our flash messages
app.use(flash());

// middleware to extact out the flash messages from
// the session and make it available to all hbs files
app.use(function(req, res, next) {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
})

// share the current logged in user with all hbs files
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  // be sure to call the next() function in your middleware
  next();
})

// Except for /login and /logout, ensure that other pages are only accessible
// to authenticated admins.
app.use(function(req, res, next) {
  if (req.url === "/login" || req.url === "/logout") {
    next();
  } else {
    checkIfAuthenticatedAdmin(req, res, next);
  }
})

// import in custom routes
const homeRoutes = require('./routes/home');
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const cartRoutes = require('./routes/carts')
const consignmentRoutes = require('./routes/consignments')
const userRoutes = require('./routes/users')
const settingRoutes = require('./routes/settings')

async function main() {

  app.use(express.static( "/public"));
  app.use('/', homeRoutes);
  app.use('/products', productRoutes);
  app.use('/orders', orderRoutes);
  app.use('/carts', cartRoutes);
  app.use('/consignments', consignmentRoutes);
  app.use('/users', userRoutes);
  app.use('/settings', settingRoutes);
  
}

main();

const port = process.env.APP_PORT || 3000
app.listen(port, () => {
  console.log("Server has started");
});