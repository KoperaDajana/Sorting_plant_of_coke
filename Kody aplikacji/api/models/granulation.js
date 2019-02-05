// MODEL Ziarnistości stworzonej na rzecz próbki, opisuje ziarnistość max & min oraz średnią wysokość oraz szerokość ziaren
const mongoose = require('mongoose');

const granulationSchema = mongoose.Schema({
    granulation_min: {type: Number, default: 0.0001},      // wyniki z badań dotyczących granulacji
    granulation_max: {type: Number, default: 10},
    high_of_grain: {type: Number, default: 5},
    width_of_grain: {type: Number, default: 5}
});

module.exports = mongoose.model('Granulation', granulationSchema);