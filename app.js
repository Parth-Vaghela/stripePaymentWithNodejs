const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

app.get('/', (req, res)=> {
  res.render('index', {
    stripePublishableKey : keys.stripePublishableKey
  })
})

app.post('/charge', (req, res)=> {
  const amount = 5000;
    stripe.customers.create({
      email : req.body.stripeEmail,
      source : req.body.stripeToken,
    })
    .then(customer => stripe.charges.create({
      amount,
      description : 'First product',
      currency : 'INR',
      customer : customer.id
    }))
    .then(charge => res.render('success'))
})

app.listen(port, ()=> {
  console.log(`server starts on port * ${port}`)
})