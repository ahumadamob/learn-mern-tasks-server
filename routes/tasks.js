const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.get('/',
    auth,
    taskController.doGet
)

router.post('/',
    auth,
    [
       check('name', 'El nombre de la tarea es obligatorio').not().isEmpty(),
       check('project', 'El proyecto es obligatorio').not().isEmpty()  
    ],
    taskController.doPost
);

router.put('/:id',
    auth,
    taskController.doPut
);

router.delete('/:id',
    auth,
    taskController.doDelete
);

module.exports = router;