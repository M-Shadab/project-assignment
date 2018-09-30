# Project Assignment Nodejs

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

What things you need to install for running the project.

install Nodejs
```
https://nodejs.org/en/
```
install MongoDb
```
https://www.mongodb.org
```

#### How to Import Data sets to MongoDb?
```
mongoimport --db newsary --collection customers --type csv --file DataFilePath\Data.csv --headerline
```
### How to run?
```
git clone https://github.com/M-Shadab/project-assignment.git
```
Change directory to project directory
```
cd project-assignment
```
Use npm install to download all the required dependencies into current directory .
```
npm install
```
run the project using command
```
node app.js
```
Go to url
```
http://localhost:3000/
```
Enter the one of the Month "january" "february" "March" "April" in any form to get result.

### Notes
```
Make sure field name in the Data.csv file does not contain any blank space. 
```
