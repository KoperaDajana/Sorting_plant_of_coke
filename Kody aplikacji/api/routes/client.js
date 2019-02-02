const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');       // do autoryzacji nie działa patch i post
const Client = require("../models/client");                  //importowanie z modelu


// GET pierwszy argument to url, handler
router.get('/', (req, res, next) => {
    Client.find()
        .select('client_name')  // wybiera które z atrybutów mają być wyświetlane
        .exec()
        .then(docs => {
            const response = {
                // informajce o kliencie
                count: docs.length,     //ilość jako długość
                clients: docs.map(doc => {
                    return {
                        _id: doc._id,
                        client_name: doc.client_name
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


// POST --
router.post("/", checkAuth, (req, res, next) => {
    const client = new Client({
        // _id: new mongoose.Types.ObjectId(),
        client_name: req.body.client_name
    });
    client
        .save()
        .then(result => {         // daje to do DB
            console.log(result);
            res.status(201).json({              // to pozwala na wysłanie od razu
                message: 'Create client successfully',
                createdClient: {
                    _id: result._id,
                    client_name: result.client_name
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
router.get('/:clientId', (req, res, next) => {
    const id = req.params.clientId;
    Client.findById(id)
        .select('client_name')
        .exec()
        .then(doc => {
            console.log("From DB", doc);
            if (doc) {
                res.status(200).json({
                    client: doc
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
router.patch("/:clientId", checkAuth, (req, res, next) => {
    const id = req.params.clientId;
    const updateOperations = {};             // pusty obiekt JS
    for (const operations of req.body) {     // by była możliwość uzupełniania po pojedynczych wartościach elementu
        updateOperations[operations.propertyName] = operations.value;
    }
    Client.update({_id: id}, {$set: updateOperations})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Client updated'
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
router.delete("/:clientId", checkAuth, (req, res, next) => {
    const id = req.params.clientId;
    Client.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Client deleted'
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