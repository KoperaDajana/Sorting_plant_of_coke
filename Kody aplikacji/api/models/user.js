// MODEL operatora sortowni koksu (może być to zarówno pracownik administracyjny, jak i z laboratorium/produkcji)
const mongoose = require('mongoose');

// powie o tym jak powinien wyglądać użytkownik
const userSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,                    // nadawać to id? raczej nie, bo Mongo nadaje sam
    email: {
        type: String,
        required: true,
        unique: true,
        // zapewnia, żeby nie wpisać niczego innego jak adress email
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},
    report: {type: String, required: false}     // raport, ale nie wymagany, może być dodany na końcu ale nie musi
});

module.exports = mongoose.model('User', userSchema);