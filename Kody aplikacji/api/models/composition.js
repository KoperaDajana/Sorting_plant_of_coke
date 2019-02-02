// MODEL: kompozycji próbki, skład mineralny wyrażony w procentach
const mongoose = require('mongoose');

// powie o tym jak powinna wyglądać badana kompozycja próbki
const compositionSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    sulfur_content: {type: Number, default: 2},              // zawartość mineralna siarki
    carbon_content: {type: Number, default: 95},             // zawartość mineralna węgla
    hydrogen_content: {type: Number, default: 1},            // zawartość mineralna wodoru
    oxygen_content: {type: Number, default: 1.5},            // zawartość mineralna tlenu
    nitrogen_content: {type: Number, default: 1.3},          // zawartość mineralna azotu
});

module.exports = mongoose.model('Composition', compositionSchema);