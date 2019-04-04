// MODEL Próbki, które są pobierane z wagonów
const mongoose = require('mongoose');

// powie o tym jak powinna wyglądać próbka
const sampleSchema = mongoose.Schema({
    sample_weight: {type: Number, default: 1},
    date_sample: {type: String, required: true},
    order: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
    // pozostałe niewymagane ze względu na to, że uzupełniane różnie w czasie
    composition: {type: mongoose.Schema.Types.ObjectId, ref: 'Composition', required: false}, //skład mineralny
    granulation: {type: mongoose.Schema.Types.ObjectId, ref: 'Granulation', required: false},  //odpowiada za info o ziarnie
    energy: {type: Number, default: 1},         // kaloryczność
    stiffness: {type: Number, default: 1},      // twardość
    CRI: {type: Number, default: 1},            // wskaźnik reakcyjności koksu
    CSR: {type: Number, default: 1}             // wytrzymałości koksu po reakcji
});

module.exports = mongoose.model('Sample', sampleSchema);