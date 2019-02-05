// ZIARNISTOŚĆ stworzona na rzecz próbki, opisuje ziarnistość badanej próbki
// GET & GET/ID bez autoryzacji

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');
const Granulation = require('../models/granulation');


// GET ---> pobranie wszystkich ziarnistości
router.get("/", (req, res, next) => {
    Granulation.find()
        .select("granulation_min granulation_max high_of_grain width_of_grain _id")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                granulations: docs.map(doc => {
                    return {
                        _id: doc._id,
                        granulation_min: doc.granulation_min,
                        granulation_max: doc.granulation_max,
                        high_of_grain: doc.high_of_grain,
                        width_of_grain: doc.width_of_grain
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


// POST  ---> dodawanie ziarnistości próbki do systemu
router.post("/", checkAuth, (req, res, next) => {
    const granulation = new Granulation({
        granulation_min: req.body.granulation_min,
        granulation_max: req.body.granulation_max,
        high_of_grain: req.body.high_of_grain,
        width_of_grain: req.body.width_of_grain
    });
    granulation.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Granulation stored",
                createdGranulation: {
                    _id: result._id,
                    granulation_min: result.granulation_min,
                    granulation_max: result.granulation_max,
                    high_of_grain: result.high_of_grain,
                    width_of_grain: result.width_of_grain
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

// GET/ID ---> pobranie szczegółowych informacji o konkretnej ziarnistości
router.get('/:granulationId', (req, res, next) => {
    const id = req.params.granulationId;
    Granulation.findById(id)
        .select("granulation_min granulation_max high_of_grain width_of_grain _id")
        .exec()
        .then(doc => {
            console.log("From DB", doc);
            if (doc) {
                res.status(200).json({
                    granulation: doc
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


// PATCH ---> aktualizacje
router.patch("/:granulationId", checkAuth, (req, res, next) => {
    const id = req.params.granulationId;
    const updateOperations = {};             // pusty obiekt JS
    for (const operations of req.body) {     // by była możliwość uzupełniania po pojedynczych wartościach elementu
        updateOperations[operations.propertyName] = operations.value;
    }
    Granulation.update({_id: id}, {$set: updateOperations})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Granulation updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});


// DELETE ---> usuwanie ziarnistości z systemu
router.delete("/:granulationId", checkAuth, (req, res, next) => {
    const id = req.params.granulationId;
    Granulation.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Granulation deleted'
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