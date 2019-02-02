// zamówienia określające kto zamawia, ile koksu zamawia oraz datę złożenia zamówienia, zamówienie jest wykonywane
// w zależności od tego jaki jest aktualny status na magazynie
// (GET, GET PO ID, POST, DELETE),
// użytkownik wybiera zamówienia do realizacji
// autoryzacja dla post, patch oraz delete

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order');   //import z modelowanego ordera
const Client = require('../models/client');

// GET ORDER
router.get('/', (req, res, next) => {
    Order.find()
        .select('_id client_name weight date_of_order')
        .populate('client')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        client: doc.client,
                        weight: doc.weight,
                        date_of_order: doc.date_of_order,
                    }
                }),
            });
        }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});


// POST ORDER
router.post('/', checkAuth, (req, res, next) => {
    Client.findById(req.body.clientId)
        .then(client => {
            if (!client) {
                return res.status(404).json({
                    message: "Client not found"
                });
            }
            const order = new Order({
                //_id: mongoose.Types.ObjectId(),
                client: req.body.client,
                weight: req.body.weight,
                date_of_order: req.body.date_of_order
            });
            return order.save()
        })
        .then(result => {         // daje to do DB
            console.log(result);
            res.status(201).json({              // to pozwala na wysłanie od razu
                message: 'Create order successfully',
                createdOrder: {
                    _id: result._id,
                    client: result.client,
                    weight: result.weight,
                    date_of_order: result.date_of_order,
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

// PATCH - aktualizacje w momencie np. błędnego wprowadzenia do bazy
router.patch("/:orderId", checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    const updateOperations = {};             // pusty obiekt JS
    for (const operations of req.body) {     // by była możliwość uzupełniania po pojedynczych wartościach elementu
        updateOperations[operations.propertyName] = operations.value;
    }
    Order.update({_id: id}, {$set: updateOperations})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

// GET zamówienie po Id
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id client_name weight date_of_order')
        .populate('client')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found!'
                });
            }
            res.status(200).json({
                order: order
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});


router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;