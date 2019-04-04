// KOMPOZYCJA stworzona na rzecz próbki, opisuje skład mineralny badanej próbki
// GET & GET/ID bez autoryzacji

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');
const Composition = require('../models/composition');


// GET ---> pobranie wszystkich kompozycji
router.get("/", (req, res, next) => {
    Composition.find()
        .select("sulfur_content carbon_content hydrogen_content oxygen_content nitrogen_content _id")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                compositions: docs.map(doc => {
                    return {
                        _id: doc._id,
                        sulfur_content: doc.sulfur_content,
                        carbon_content: doc.carbon_content,
                        hydrogen_content: doc.hydrogen_content,
                        oxygen_content: doc.oxygen_content,
                        nitrogen_content: doc.nitrogen_content
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


// POST ---> dodawanie kompozycji próbki do systemu
router.post("/", checkAuth, (req, res, next) => {
    const composition = new Composition({
        sulfur_content: req.body.sulfur_content,
        carbon_content: req.body.carbon_content,
        hydrogen_content: req.body.hydrogen_content,
        oxygen_content: req.body.oxygen_content,
        nitrogen_content: req.body.nitrogen_content
    });
    composition.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Composition stored",
            createdComposition: {
                _id: result._id,
                sulfur_content: result.sulfur_content,
                carbon_content: result.carbon_content,
                hydrogen_content: result.hydrogen_content,
                oxygen_content: result.oxygen_content,
                nitrogen_content: result.nitrogen_content
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

// GET/ID ---> pobranie szczegółowych informacji o konkretnej kompozycji mineralnej
router.get('/:compositionId', (req, res, next) => {
    const id = req.params.compositionId;
    Composition.findById(id)
        .select("sulfur_content carbon_content hydrogen_content oxygen_content nitrogen_content _id")
        .exec()
        .then(doc => {
            console.log("From DB", doc);
            if (doc) {
                res.status(200).json({
                    composition: doc
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
router.patch("/:compositionId", checkAuth, (req, res, next) => {
    const id = req.params.compositionId;
    const updateOperations = {};             // pusty obiekt JS
    for (const operations of req.body) {     // by była możliwość uzupełniania po pojedynczych wartościach elementu
        updateOperations[operations.propertyName] = operations.value;
    }
    Composition.update({_id: id}, {$set: updateOperations})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Composition updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});


// DELETE ---> usuwanie kompozycji z systemu
router.delete("/:compositionId", checkAuth, (req, res, next) => {
    const id = req.params.compositionId;
    Composition.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Composition deleted'
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