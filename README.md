# Bulb

## Deployment
`sudo cp sample-deploy.sh deploy.sh`
<br>
`sudo chmod +x deploy.sh`
<br>
`sudo ./deploy.sh`

## Creators
* Pravin Sivabalan
* Mihir Tiwari
* Ashwin Gokhale

## Frontend Components
* Login/create account
* feed (3 different filters)
* specific idea component (contains description)
* create idea component
* settings (name, email)
* navbar
* logout

## Backend Routes
* POST /auth/signup
* POST /auth/login
* GET /feed (global) || /feed?type=0 (friends) || /feed?type=1 (personal)
* GET /idea/:id
* POST /idea
* DELETE /idea/:id
* READ /idea/:id

* GET /user/:id
* PUT /user
* DELETE /user


## Stretch Goal
* Tags on ideas
* Profile page
* Edit idea


####
Code adapted from:
* [https://github.com/rwieruch/react-redux-firebase-authentication](react-redux-firebase-authentication)
