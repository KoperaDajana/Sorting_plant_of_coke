// Klient (na rzecz zamówienia)
// Pobieranie, dodanie, aktualizacja i usunięcie (GET, POST, GET/ID, PATCH/ID, DELETE/ID)
// GET & GET/ID bez autoryzacji

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const Client = require("../models/client");                  //importowanie z modelu

// GET --->  pobranie klienta(pierwszy argument to url, handler =>)
router.get('/', (req, res, next) => {
    Client.find()
        .select('client_name')  // wybiera które z atrybutów mają być wyświetlane
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
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


// POST ---> dodawanie klienta do systemu
router.post("/", checkAuth, (req, res, next) => {
    const client = new Client({
        client_name: req.body.client_name
    });
    client
        .save()
        .then(result => {                       // daje to do DB
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


// GET/ID ---> pobieranie o konkretnym kliencie
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


// PATCH ---> aktualizacje
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


// DELETE ---> usuwanie klienta
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