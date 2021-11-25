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
