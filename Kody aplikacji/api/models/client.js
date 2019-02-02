// MODEL: client, informacje o kliencie, który złożył zamówienie
const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    client_name: {type: String, required: true}
});

module.exports = mongoose.model('Client', clientSchema);