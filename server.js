const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const textJustification = require('./services/justifierText'); //methode de la justification
var email=''
var expiration = {}

//fonction de validation de l'email avec une expression régulière
function validateEmail(email) {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(String(email).toLowerCase());
}


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "front-test-app/build")))

const port = process.env.PORT 

//express ne suporte pas le content-type text/plain par défaut
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
    res.sendFile(path.join(__dirname, "front-test-app", "build", "index.html"));
});

//starting the server
app.listen(port,() =>{
    console.log('server started on port '+port);
});

//creation du token utilisant l'email envoyé
app.post('/api/token',(req,res)=>{
    if(validateEmail(req.body.email)){
        var token = jwt.sign(req.body, req.body.email, {expiresIn: 60*60*24 });
        expiration[token]=80000
        email=req.body.email;
        res.status(200).send({ token: token });
    }else{
        res.sendStatus(500)
    }

})

//authentification avec token,vérification du nombre de mots testant et justification du contenu type plain/text envoyé
app.post('/api/justify',(req,res)=>{
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token,email , function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      var array = req.text.split(" ");
      var length = array.length
      console.log(expiration[token])
      if(expiration[token]-length<0) return res.sendStatus(402)
      res.status(200).send(textJustification(array));
      expiration[token]=expiration[token]-length
    });
})