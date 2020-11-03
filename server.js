const express = require('express');
const bodyParser = require('body-parser');
const storage = require('./modules/storage');


const credentials = process.env.DATABASE_URL || require('./localenv').DATABASE_URL;
const db = new storage(credentials);

const server = express();
const crypto = require('crypto');
const secret = process.env.hashSecret || require('./localenv').hashSecret;
//const test_router = require('./modules/test_router');

server.use(bodyParser.json());
server.use(express.static('public'));
/* ************************************************************** */

class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
}

/* ************************************************************** */

//Authenticator middleware
const auth = (req, res, next)=>{
    
    console.log(req.headers.authorization.split(' '));
    if(!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Basic'){
        return res.append("WWW-Authenticate", 'Basic realm="User Visible Realm", charset="UTF-8"').status(401).end()
    }
    
    console.log('OK 1');
    const authString = req.headers.authorization.split(' ')[1];
    const [username, password] = Buffer.from(authString, 'base64').toString('utf-8').split(':');
    
    //Hash password 
    const phashword = crypto.createHmac('sha256', secret).update(password).digest('hex');

    //Send info on
    req.u = username;
    req.p = phashword;
    
    next();
}


/* ************************************************************** */

//server.use('/test_router', test_router);

server.post('/login', auth, async (req, res)=>{
    console.log(req.u);
    console.log(req.p);

    //Get user from database
    

});


server.post('/createUser', auth, async (req,res)=>{
    
    const newUser = new User(req.u, req.p);

    //Add user to database
    let result = await db.createUser(req.u, req.p);
    console.log(result);

    console.log(newUser);
    res.status(200).json({"msg": "New user created", "usr": newUser}).end();


});

/* ************************************************************** */
server.set('port', (process.env.PORT || 8080));
server.listen(server.get('port'), function() {
    console.log('server running', server.get('port'));
});
