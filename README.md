# Luxury Preowned Platform - Admin Portal

## Demo

A live website for the API service is hosted on Heroku - https://annette-p-luxury-preowned-adm.herokuapp.com/

Refer to [DEVELOPMENT.md](docs/DEVELOPMENT.md) for the setup instructions.

## Features

* Login
* Main Page (Dashboard)
* Order Management
* Product Management
* Shopping Cart Management
* Consignment Management
* User Management
* Settings
* Logout

Refer to [PDF file](docs/admin-portal-hbs-project3.pdf) for more details.

## Business Logic

| Topic | Business Requirements |
|---|---|
|<b>Products </b>|<ul><li>Product deletion are not allowed for products that are active on carts/orders/consignment (for auditing trail purpose).<li>Admin can deactivate product to remove from listing on the web portal frontend.<li>Admin can perform editing of the product.</ul>|
|<b>Order</b>|<ul><li>Order deletion are not allowed. So, admins are unable to delete the order (for auditing trail purpose).<li>Admin can either change status to cancelled or refund (whichever appropriate).<li>Product quantity will be deducted immediately once order made successfully via Stripe.<li>Because the quantity of resales items are usually not many (ranging from 1-3 and mostly quantity 1).<li>The products will be removed from listing automatically once their quantity hit 0) to prevent any over order transactions.</ul>|
|<b>User Management</b>|<h4><u>Admin user account</u></h4><ul><li>Account deletion are not allowed. Admins are unable to delete the admin user account from DB but they can de-activate the admin account.</li><li>New admin account must be created by existing admin users.<ul><li>New admin is unable to self-created admin account, this task needs to be performed by an existing admin</li></ul></li></ul><li>New created admin account will be given a password. Upon first login, they are forced to change password immediately.</li></ul><h4><u>(Customer) user account</u></h4><ul><li>New account creation must be done by customer through self-created account via frontend portal (React).<ul><li>Admin is unable to create new account for customer user.</li></ul></li><li>Account deletion must be done by customer via frontend portal (React)<ul><li>Admin is unable to delete account for customer user.</li><li>Admin can de-activate the (customer) user account.</li></ul></li></ul><h4><u>What happen when (customer) user delete their account?</u></h4><ul><li>The existing info in the account will be removed.</li><li>It will then be re-assigned to random generated (fake) user data except to assign the order history for auditing trail purpose.</li></ul>|

## Technologies Used

| Technology | Description |
| --- | --- |
| <b>Node.js / Express framework</b> | Backend web application framework for Node.js to build web applications |
| <b>Express Handlebars (HBS)</b> | <p>A templating engine to render web pages to the client side from data on the server-side, used with express as the hbs module.</p><p>It ensures minimum templating and is a logicless engine that keeps the view and the code separated.</p>
| <b>Caolan form</b> | To create, parse and validate forms in Node.js |
| <b>Cloudinary</b> | Ror end-to-end image- and video-management solution from image and video uploads, storage, manipulations, optimizations to delivery. |
| <b>Heroku</b> | For deployment of the application and host database. |

## Future Development

* Implement "<b>add new</b>" consignment (to support the business flow after the staff evaluate the product during virtual appointment with customer)
* Implement the automated pay-out to consignor after order has completed based on pay-out scheme.

## Deployment Instructions

Refer to [DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.
