// etykiety, które są wejściem do systemu, wjeżdżający wagon, który ma zostać zasypany jest etykietowany.
// etykieta posiada informacje o wagonie, jego typie, numerze oraz informacje o właścicielu

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');       // do autoryzacji nie działa patch i post
const Label = require("../models/label");           //importowanie z modelu

// pobieranie zdjęcia etykiety, w celu odczytania informacji
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './labels/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


// GET pierwszy argument to url, handler
router.get('/', (req, res, next) => {
    Label.find()
        .select('type_of_wagon number_of_squad')  // wybiera które z atrybutów mają być wyświetlane
        .exec()
        .then(docs => {
            const response = {
                // informajce o etykiecie
                count: docs.length,     //ilość jako długość
                labels: docs.map(doc => {
                    return {
                        _id: doc._id,
                        type_of_wagon: doc.type_of_wagon,
                        number_of_squad: doc.number_of_squad,
                        // labelImage: doc.labelImage,
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


// POST -- do ładowania zdjęcia dać w drugim argumencie: upload.single('labelImage')
router.post("/", checkAuth, (req, res, next) => {
    const label = new Label({
       // _id: new mongoose.Types.ObjectId(),
        type_of_wagon: req.body.type_of_wagon,
        number_of_squad: req.body.number_of_squad,
        //labelImage: req.file.path
    });
    label
        .save()
        .then(result => {         // daje to do DB
            console.log(result);
            res.status(201).json({              // to pozwala na wysłanie od razu
                message: 'Create label successfully',
                createdLabel: {
                    _id: result._id,
                    type_of_wagon: result.type_of_wagon,
                    number_of_squad: result.number_of_squad
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


// GET SZCZEGÓLNE intormacje o konkretnej etykiecie
router.get('/:labelId', (req, res, next) => {
    const id = req.params.labelId;
    Label.findById(id)
        .select('type_of_wagon number_of_squad')
        .exec()
        .then(doc => {
            console.log("From DB", doc);
            if (doc) {
                res.status(200).json({
                    label: doc
                });
            } else {
                res.status(404).json({message: 'Valid entry'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});


// PATCH - aktualizacje
router.patch("/:labelId", checkAuth, (req, res, next) => {
    const id = req.params.labelId;
    const updateOperations = {};             // pusty obiekt JS
    for (const operations of req.body) {     // by była możliwość uzupełniania po pojedynczych wartościach elementu
        updateOperations[operations.propertyName] = operations.value;
    }
    Label.update({_id: id}, {$set: updateOperations})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Label updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});


// DELETE (do autoryzacji - checkAuth,)
router.delete("/:labelId", checkAuth, (req, res, next) => {
    const id = req.params.labelId;
    Label.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Label deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;