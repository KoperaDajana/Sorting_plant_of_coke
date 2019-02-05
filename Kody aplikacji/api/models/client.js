// MODEL Klient, informacje o kliencie, który złożył zamówienie (id oraz nazwa klienta)
const mongoose = require('mongoose');

// powie jak powinien wyglądać klient
const clientSchema = mongoose.Schema({
    client_name: {type: String, required: true}
});

module.exports = mongoose.model('Client', clientSchema);