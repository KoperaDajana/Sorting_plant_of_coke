// Użytkownik sortowni koksu, może być to zarówno pracownik administracyjny, jak i z laboratorium,
// produkcja tylko odczyt - nie potrzebują kont
// Rejestracja, logowanie (POST/SIGNUP, POST/LOGIN, GET)

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');        //token, https://jwt.io/
const User = require('../models/user');     //importowanie z modelu

// SIGN UP ---> rejestracja użytkownika, email + password
// w założeniu pracownicy posiadają maile na platformie przedsiębiorstwa i na ich podstawie zakładane są im konta
// żeby stworzyć, administrator musi być zalogowany na MongoDB https://cloud.mongodb.com/v2/5c13a9bf79358e3195fdd74f#clusters
router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {                 // jeżeli email istnieje (długość jest większa od 1)
                return res.status(409).json({       // 409 - oznacza konflikt
                    message: 'Email exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {     // haszowanie hasła
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()                 // zapisanie użytkownika w DB
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});


// LOGIN ---> logowanie użytkownika (również z obsługą, jeśli poda złe hasło)
// dla tokenów -> instalacja jsonwebtoken --save
router.post("/login", (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {           // jeżeli użytkownik nie istnieje
                return res.status(401).json({
                    message: 'Authorization failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {                  // w przypadku błędnego wpisania hasła
                    return res.status(401).json({
                        message: 'Autorization failed'
                    });
                }
                if (result) {                   // jeśli poprawne to ustawia token
                    const token = jwt.sign(     // ustawienie tokena dla użytkownika
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                            report: user[0].report
                        },
                        process.env.JWT_KEY,    // ustawione w nodemoon.json
                        {
                            expiresIn: "5h"     // wygasa za 5h od ustawienia
                        }
                    );
                    return res.status(200).json({
                        message: 'Autorization successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Autorization failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


// GET ---> pokazuje wszystkich użytkowników, którzy zostali zarejestrowani w systemie
router.get('/', (req, res, next) => {
    User.find()
        .select('email _id')            // wybiera które z atrybutów mają być wyświetlane
        .exec()
        .then(docs => {
            const response = {          // informajce o użytkowniku
                count: docs.length,     // ilość wszystkich użytkowników jako długość
                users: docs.map(doc => {
                    return {
                        email: doc.email,
                        _id: doc._id
                    }
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


// DELETE - (użytkownik nie może usunąć użytkownika, robi to tylko administrator)
// router.delete('/:userId', (req, res, next) => {
//     User.remove({_id: req.params.userId})
//         .exec()
//         .then(result => {
//             res.status(500).json({
//                 message: 'You cant delete other user'
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

module.exports = router;