// MODEL: wagonu, do niego zostają usypywane kopy koksu, posiada dwa atrybuty - id i etykietę,
// etykieta posiada informacje o wagonie, jego typie, numerze oraz informacje o właścicielu
const mongoose = require('mongoose');

const wagonSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    label: {type: mongoose.Schema.Types.ObjectId, ref: 'Label', required: true},
});

module.exports = mongoose.model('Wagon', wagonSchema);