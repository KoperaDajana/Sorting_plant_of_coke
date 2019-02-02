// MODEL zamówienia
const mongoose = require('mongoose');

// powie o tym jak powinien wyglądać produkt
const orderSchema = mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId,
    client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
    weight: {type: Number, default: 1},
    date_of_order: {type: String, required: true}
});

module.exports = mongoose.model('Order', orderSchema);