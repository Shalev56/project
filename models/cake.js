const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cals: { type: Number, required: true },
    price: { type: Number, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Cake', cakeSchema);

exports.validateCake = (_reqBody) => {
    let schemaJoi = Joi.object({
      name:Joi.string().min(2).max(99).required(),
      cals:Joi.string().min(1).max(99).required(),
      price:Joi.number().min(1).max(3000000000).required(),
    })
    return schemaJoi.validate(_reqBody)
  }
