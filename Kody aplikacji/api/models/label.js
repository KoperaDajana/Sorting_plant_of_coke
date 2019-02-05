// MODEL Etykiety, które są wejściem do systemu (każdy wagon posiada własną etykietę)
const mongoose = require('mongoose');

// powie o tym jak powinna wyglądać etykieta
const labelSchema = mongoose.Schema({
    type_of_wagon: {type: Number, default: 1},
    number_of_squad: {type: Number, default: 10000000000000},
    // labelImage: { type: String, required: false }
});

module.exports = mongoose.model('Label', labelSchema);