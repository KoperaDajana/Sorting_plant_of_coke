// MODEL Wagonu, do niego zostają usypywane kopy koksu, posiada dwa atrybuty - id i etykietę,
// etykieta posiada informacje o wagonie
const mongoose = require('mongoose');

const wagonSchema = mongoose.Schema({
    label: {type: mongoose.Schema.Types.ObjectId, ref: 'Label', required: true}
});

module.exports = mongoose.model('Wagon', wagonSchema);