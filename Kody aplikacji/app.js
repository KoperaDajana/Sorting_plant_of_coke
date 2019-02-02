// obsługa zapytań
const express = require('express');
const app = express();
const morgan = require('morgan');                       // Database
const bodyParser = require('body-parser');
const mongoose = require('mongoose');                   // dostarczanie DB z mongobongo
// validation - uprawnienie

const labelsRoutes = require('./api/routes/label');
const ordersRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');
const wagonRoutes = require('./api/routes/wagon');
const sampleRoutes = require('./api/routes/sample');
const compositionRoutes = require('./api/routes/composition');
const granulationRoutes = require('./api/routes/granulation');
const clientRoutes = require('./api/routes/client');


// kopia do połączenia bazy mogno z aplikacją
mongoose.connect('mongodb+srv://Dajana:' +
    process.env.MONGO_PASSWORD +
    '@cluster0-paziv.mongodb.net/test?retryWrites=true',
    {
    useMongoClient: true
    });
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));      // które części na początku zanalizować
app.use(bodyParser.json());                             // metoda bez argumentów

app.use((req, res, next) => {                       // nie wysyła tylko dostosowuje odpowiedzi
    res.header('Access-Control-Allow-Origin','*');      // gwiazda --> bo dla każdego
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/label', labelsRoutes);
app.use('/orders', ordersRoutes);
app.use("/user", userRoutes);
app.use("/wagon", wagonRoutes);
app.use("/sample", sampleRoutes);
app.use("/composition", compositionRoutes);
app.use("/granulation", granulationRoutes);
app.use("/client", clientRoutes);

// obsługa błędów
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
// restartuje server kiedy coś się zmienia --save-dev nodemon

app.use((error, req, res, next) => {
    //trzyma wszystkie errory
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;