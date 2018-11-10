const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const textJustification = require('./services/justifierText'); //methode de la justification
var expiration = {}

//fonction de validation de l'email avec une expression régulière
function validateEmail(email) {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(String(email).toLowerCase());
}


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "justify-front/build")))

const port = process.env.PORT 
app.listen(port,() =>{
    console.log('server started on port '+port);
});
//express ne supporte pas le content-type text/plain par défaut
app.use(function(req, res, next){
    if (req.is('text/*')) {
      req.text = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk){ req.text += chunk });
      req.on('end', next);
    } else {
      next();
    }
  });
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "justify-front", "build", "index.html"));
});

//starting the server


//creation du token utilisant l'email envoyé
app.post('/api/token',(req,res)=>{
    if(validateEmail(req.body.email)){
        var token = jwt.sign(req.body, req.body.email, {expiresIn: 60*60*24 });
        expiration[token]=[80000,req.body.email]
        res.status(200).send({ token: token });
    }else{
        res.sendStatus(500)
    }

})

//authentification avec token,vérification du nombre de mots testant et justification du contenu type plain/text envoyé
app.post('/api/justify',(req,res)=>{
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token,expiration[token][1] , function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      var array = req.text.split(" ");
      var length = array.length
      
      if(expiration[token][0]-length<0) return res.sendStatus(402)
      res.status(200).send(textJustification(array));
      expiration[token]=expiration[token]-length
    });
})