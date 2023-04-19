

## About This Application

This is a solution to the assessment by Fenex


## Setup
This application requires Nodejs version 18 and NPM and Mongodb.  
To set up the node server, execute the following:
- run 'npm install'
- rename the .env.example file to .env and edit the database url and credentials


To set up the vue frontend, navigate to the /frontend folder and execute:
- run 'npm install'
- rename the .env.example file to .env It doesn't need to be edited.
- run 'npm run build'

## Run
You many want to create an admin user account first since you need it to create some entities. To do that,  run the application with:
- npm run start-admin
- visit the url printed on the console
- create an account. Any account you create while the server is running will be an admin account
 To run the application normally, :
- run 'npm start' instead. 
- any account you create will be a regular user account without admin privileges. You can still log in with your admin account you created in the other mode.

## Test
NO TESTS

## Inquiries
Please feel free to contact me for any clarifications.