# Luxury Preowned Platform - Admin Portal

## Demo

A live website for the API service is hosted on Heroku - https://annette-p-luxury-preowned-adm.herokuapp.com/

Refer [here](docs/DEVELOPMENT.md) for the setup instructions.

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
|<b>Order</b>|<ul><li>Due to business requirement, admins are unable to delete the order (or auditing trail purpose). Admin can only change status to either cancelled or refund (whichever appropriate)</ul>|
|<b>Product</b>|<ul><li>Due to business requirement, admins are unable to delete product from DB (for auditing trail purpose). Admin can click on deactivate the product to remove from listing on the website <li>Admin can perform editing of the product</ul>|
|<b>User management</b>|<ul><li>Admin is able to view and perform deactivation of the user account (admin users, customers)<li>Admin can create new admin user (new admin is unable to self-created admin account, this task needs to be performed by an existing admin)<li>New created admin account will be given a password. Upon first login, they are forced to change password immediately.<li>Admin is unable to create new account for customer user. Customer must self-created account via frontend portal (react).<li>Admin is unable to delete user account (both customer and admin account), they can perform deactivation of account.<li>Customers (user) must self-perform account deletion via frontend portal and the existing info in the account will be remove except the order history which will be re-assigned to random (fake) user data for auditing trail purpose.</ul>|