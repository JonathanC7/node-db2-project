const express = require('express');
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
    db('cars')
        .then(cars => {
            res.json(cars);
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to retrieve cars.', error: err})
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;

    db('cars').where({id}).first()
        .then(car => {
            if(car){
                res.json(car)
            }else{
                res.status(404).json({message: 'The car with the specific ID does not exist'})
            }
        })
        .catch(err => {
            res.status(500).json({message: 'Failed to retrieve car.', error: err})
        })
})

router.post('/', (req, res) => {
    const carData = req.body;

    db('cars').insert(carData)
        .then(ids => {
            db('cars').where({id: ids[0]})
                .then(newCarEntry => {
                    res.status(201).json(newCarEntry);
                })
        })
        .catch(err => {
            res.status(500).json({message: 'Failed to store data.'})
        })
})

module.exports = router;