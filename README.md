# Node with Express MySQL BoilerPlate

A simple  boilerplate for Node with MySQL using Sequelize, MVC pattern , equipped with AdminLTE3 ,DataTable and some CRUD example using Modal Bootstrap 4 

# Used Packages 

### 1. Sequelize
```
 npm install sequelize 
```
* Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.

---
### 2. MYSQL2
```
 npm install mysql 2
```
* MySQL client for Node.js with focus on performance
* Why mysql2 because Sequelize required mysql2 for mysql

---

### 2. Express
```
npm install express 
```
* Platform it built over it 

---

### 3. Passport
```
npm install passport 
```
* Passport is Express-compatible authentication middleware for Node.js

---

### 4. Passport Local
```
npm install passport-local 
```
* Local username and password authentication strategy for Passport.

---

### 5. Nodemon
```
npm install nodemon 
```
* Nodemon will watch the files in the directory and if file changes automatically restart application 

---

### 6. bcrypt
```
npm install bcrypt  
```
* bcrypt will encrypt your password throughing hashing so your password won't store as plain text .

---
### 7. Body Parser
```
npm install body-parser
```
* body-parser extract the entire body portion of an incoming request stream and exposes it on req.body
---
### 8. express-handlebars
```
npm install express-handlebars
```
* A Handlebars view engine for Express which doesn't suck
---
### 9. connect-flash
```
npm install connect-flash
```
* Package for set Flash Message
---
### 10. method-override
```
npm install method-override
```
* Package for override post method to put ,delete etc
---


# Get Started

1. `$ git clone https://github.com/arsipbona/node-boiler.git`
2. `$ npm install`
3. Setting Database in `.env` file
4. Import Sample Database `learn.sql`
5. Launch Enviornment:
    * `$ node app.js or npm run dev`
6. Open in browser:
    * open `http://localhost:5000`
