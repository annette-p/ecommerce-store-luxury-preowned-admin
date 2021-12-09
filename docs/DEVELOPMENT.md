## Local Development Environment Setup

### Pre-requisites

* A functional backend REST API service of Luxury Preowned.
* Sign-up for a free [Cloudinary](https://cloudinary.com/) account.
* Create a `.env` file in the same directory as `index.js` with the below-contents.

```
# desired port the app will run on
PORT=3000

# For using session with NodeJS Exppress
# - from https://randomkeygen.com/, use the _CodeIgniter Encryption Keys_ as the value.
SESSION_SECRET=0jmCItizXE4lbn0zKVAeLDAjAbCS33Qx

# For Cloudinary
# - Your Cloudinary cloud name is available under Settings > Account.
# - Your Cloudinary API Key and API Secret are available under Settings > Security > Access Keys.
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
