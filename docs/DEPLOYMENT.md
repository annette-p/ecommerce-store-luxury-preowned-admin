## Deployment Instructions

### Pre-requisites

* A functional backend REST API service of Luxury Preowned.
* Sign-up for a free [Heroku](https://heroku.com/) account.
  * Install Heroku CLI ([instructions](https://devcenter.heroku.com/articles/heroku-cli#download-and-install))
* Sign-up for a free [Cloudinary](https://cloudinary.com/) account.

### Create an Heroku Application

* Log in to Heroku

From the terminal, run the following command to login to Heroku.

```
heroku login -i
```

* Create Heroku Application

Once you have logged in, create a new Heroku app with the following commands at the terminal:

```
heroku create <app-name>
```

Replace `<app-name>` with a name of your choice. Do not use underscore. As the app name has to be unique, make sure the name you use is distinctive. You can use your initials as part of the app name, for instance.

### Setup Environment Variables on Heroku

  * Open a web browser and go to [Heroku Dashboard](https://dashboard.heroku.com/apps)
  * Click on the name of your app.
  * Under <b>Settings | Config Vars</b>, click <b>Reveal Config Vars</b>.
  * Enter the list of environments variables required to be in `.env` file for local development - refer to [DEVELOPMENT.md](DEVELOPMENT.md).

### Deploy Application to Heroku

From the terminal, run the following command:

```
git push heroku main
```
