## Local Development Environment Setup

### Pre-requisites

* Create a `.env` file in the same directory as `index.js` with the below-contents.

```
APP_PORT=3000
```

* In the `.env` file, add in 2 new environmental variable named `SESSION_SECRET`. From https://randomkeygen.com/, use the _CodeIgniter Encryption Keys_ as the value. For example:

```
SESSION_SECRET=0jmCItizXE4lbn0zKVAeLDAjAbCS33Qx
```

* Sign-up for a free [Cloudinary](https://cloudinary.com/) account. In the `.env` file, add the following for your Cloudinary account.
  * Your Cloudinary cloud name is available under Settings > Account.
  * Your Cloudinary API Key and API Secret are available under Settings > Security > Access Keys.

```
CLOUDINARY_NAME=<your cloudinary name>
CLOUDINARY_API_KEY=<your cloudinary api key>
CLOUDINARY_API_SECRET=<your cloudinary api secret> 
CLOUDINARY_UPLOAD_PRESET=uploads
```

* Install the required packages

```
npm install
npm install -g nodemon
```

### Start Application

* Execute the following command to start the application

```
nodemon
```
