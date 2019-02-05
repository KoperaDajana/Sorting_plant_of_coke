// PRÓBKA pobierana z wagonu w randomowej chwili, zarządzana również przez użytkownika, przechowuje informacje o badaniach
// wykonywanych na niej, zawiera szczegółowe informacje o badanym koksie (GET, GET/ID, POST, PATCH/ID, DELETE/ID)
// GET & GET/ID nie wymagana autoryzacja

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');
const Sample = require('../models/sample');             // import modelu próbki
const Order = require("../models/order");               // - || - zamówienia
const Composition = require("../models/composition");   // - || - kompozycji
const Granulation = require("../models/granulation");   // - || - ziarnistości


// GET ---> pobieranie informacji o wszystkich próbkach w jednym momencie
router.get("/", (req, res, next) => {
    Sample.find()
        //.select("sample_weight date_sample composition granulation research _id")
        .populate('order composition granulation')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                samples: docs.map(doc => {
                    return {
                        _id: doc._id,
                        sample_weight: doc.sample_weight,
                        date_sample: doc.date_sample,
                        order: doc.order,
                        composition: doc.composition,
                        granulation: doc.granulation,
                        energy: doc.energy,
                        stiffness: doc.stiffness,
                        CRI: doc.CRI,
                        CSR: doc.CSR
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


// POST ---> dodawanie próbki do systemu
router.post("/", checkAuth, (req, res, next) => {
    Order.findById(req.body.orderId)
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            const sample = new Sample({
                sample_weight: req.body.sample_weight,
                date_sample: req.body.date_sample,
                order: req.body.orderId,
                composition: req.body.compositionId,
                granulation: req.body.granulationId,
                energy: req.body.energy,
                stiffness: req.body.stiffness,
                CRI: req.body.CRI,
                CSR: req.body.CSR
            });
            return sample.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Sample stored",
                createdSample: {
                    _id: result._id,
                    sample_weight: result.sample_weight,
                    date_sample: result.date_sample,
                    order: result.order,
                    composition: result.composition,
                    granulation: result.granulation,
                    energy: result.energy,
                    stiffness: result.stiffness,
                    CRI: result.CRI,
                    CSR: result.CSR
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

// PATCH ---> aktualizacje próbki
router.patch("/:sampleId", checkAuth, (req, res, next) => {
    const id = req.params.sampleId;
    const updateOperations = {};             // pusty obiekt JS
    for (const operations of req.body) {     // by była możliwość uzupełniania po pojedynczych wartościach elementu
        updateOperations[operations.propertyName] = operations.value;
    }
    Sample.update({_id: id}, {$set: updateOperations})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Sample updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

// GET/ID ---> pobieranie informacji o konkretnej próbce
router.get("/:sampleId", (req, res, next) => {
    Sample.findById(req.params.sampleId)
        .populate('order composition granulation')
        .exec()
        .then(sample => {
            if (!sample) {
                return res.status(404).json({
                    message: "Sample not found"
                });
            }
            res.status(200).json({
                sample: sample
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


// DELETE ---> usuwanie próbki z systemu
router.delete("/:sampleId", checkAuth, (req, res, next) => {
    Sample.remove({_id: req.params.sampleId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Sample deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;