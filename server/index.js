"use strict";

const PORT        = 8080;
const express     = require("express");
const app         = express();

var sassMiddleWare = require('node-sass-middleware');
const path = require('path');

app.use(sassMiddleWare({
  src: path.join(__dirname, '..', 'sass'),
  dest: path.join(__dirname, '..', 'public'),
  debug: true,
  outputStyle: 'compressed',
  prefix: 'http://localhost:8080/styles'
}))
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/:userName', (req, res) => {
  const fullRecommend = require('../database_api/fullRecommend.js').namedRecommendation
  fullRecommend(req.params.userName)
  .then((outputRecommendation) => {
    res.json(outputRecommendation)
  })
})

app.get('/u', (req, res) => {
  res.send('sorry')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});