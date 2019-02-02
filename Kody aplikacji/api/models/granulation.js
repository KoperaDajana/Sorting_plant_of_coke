// MODEL: kompozycji próbki, skład mineralny wyrażony w procentach
const mongoose = require('mongoose');

// powie o tym jak powinna wyglądać badana kompozycja próbki
const granulationSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    granulation_min: {type: Number, default: 0.0001},      // wyniki z badań dotyczących granulacji
    granulation_max: {type: Number, default: 10},
    high_of_grain: {type: Number, default: 5},
    width_of_grain: {type: Number, default: 5}
});

module.exports = mongoose.model('Granulation', granulationSchema);