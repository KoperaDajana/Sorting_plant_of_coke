// MODEL Zamówienia
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
    weight: {type: Number, default: 1},
    date_of_order: {type: String, required: true}
});

module.exports = mongoose.model('Order', orderSchema);