const express = require("express");
const cors = require('cors')
const app = express();
const { validate, ValidationError, Joi } = require('express-validation')

app.use(cors())
app.use(express.urlencoded());
app.use(express.json());

const infoValidation = {
  body: Joi.object({
    number: Joi.string()
      .regex(/[0-9]{16}/)
      .required(),
    name: Joi.string()
      .regex(/[a-zA-z]{5,30}/)
      .required(),
    date: Joi.string()
      .regex(/^(((0)[0-9])|((1)[0-2]))(\/)\d{2}$/)
      .required(),
    cvv: Joi.string()
      .regex(/[0-9]{3,4}/)
      .required(),
  }),
}

app.post('/', validate(infoValidation, {}, {}), (req, res) => {
  res.json(200)
});

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }
 
  return res.status(500).json(err)
})

app.listen(5000, () => {
 console.log("Server running on port 5000");
});
