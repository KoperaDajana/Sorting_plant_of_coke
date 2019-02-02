// WAGON, do niego zostają usypywane kopy koksu, posiada dwa atrybuty - id i etykietę,
// z niego również w swoim czasie zostaje pobrana próbka, która zostaje poddana badaniom
// PATCH w tym miejscu zbędne, ewentualnie poprawa etykiety
// zalogowany użytkownik wybiera wagony

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');
const Wagon = require("../models/wagon");
const Label = require("../models/label");
//const User = require('../models/user');


// GET z handlerem
router.get("/", (req, res, next) => {
    Wagon.find()
        .select("label _id")
        .populate('label')      // wyciąga info z etykiety
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                wagons: docs.map(doc => {
                    return {
                        _id: doc._id,
                        label: doc.label
                    };
                })
            });
        })
        .catch(err => {
            res.status(409).json({
                error: err
            });
        });
});


// POST - dodawanie wagonu, potrzebna autoryzacja użytkownika
router.post("/", checkAuth, (req, res, next) => {
    Label.findById(req.body.labelId)
        .then(label => {
            if (!label) {
                return res.status(404).json({
                    message: "Label not found"
                });
            }
            const wagon = new Wagon({
                //_id: mongoose.Types.ObjectId(),
                label: req.body.labelId
            });
            return wagon.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Wagon stored",
                createdWagon: {
                    _id: result._id,
                    label: result.label
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({
                error: err
            });
        });
});


// GET po id
router.get("/:wagonId", (req, res, next) => {
    Wagon.findById(req.params.wagonId)
        .populate('label')
        .exec()
        .then(wagon => {
            if (!wagon) {
                return res.status(404).json({
                    message: "Wagon not found"
                });
            }
            res.status(200).json({
                wagon: wagon
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


// DELETE --> usuwanie wagonu, również potrzebna autoryzacja
router.delete("/:wagonId", checkAuth, (req, res, next) => {
    Wagon.remove({_id: req.params.wagonId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Wagon deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
