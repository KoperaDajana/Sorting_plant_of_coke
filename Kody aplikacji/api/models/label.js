// MODEL: etykiety, które są wejściem do systemu, wjeżdżający wagon, który ma zostać zasypany jest etykietowany.
// etykieta posiada informacje o wagonie, jego typie, numerze oraz informacje o właścicielu
const mongoose = require('mongoose');

// powie o tym jak powinna wyglądać etykieta
const labelSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    type_of_wagon: {type: Number, default: 1},
    number_of_squad: {type: Number, default: 10000000000000},
    // labelImage: { type: String, required: true }
});

module.exports = mongoose.model('Label', labelSchema);