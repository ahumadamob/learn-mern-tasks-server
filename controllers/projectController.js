const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.doPost = async (req, res) => {

    //Revisión de errores de entrada
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const project = new Project(req.body);
        project.owner = req.user.id;
        project.save();
        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.satus(500).send('Hubo un error');
    }
}

exports.doGet = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user.id }).sort({ registerDate: -1 });
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.doPut = async (req, res) => {
    //Revisión de errores de entrada
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const newProject = {};

    if(name){
        newProject.name = name;
    }

    try {
        // Revisar el ID que se envía
        let project = await Project.findById(req.params.id);

        // Verificar la existencia del proyecto
        if(!project){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar el creador del proyecto
        if(project.owner.toString() !== req.user.id){
            return res.status(401).json({ msg: 'No autorizado'});
        }

        // Actualizar
        project = await Project.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: newProject },
            { new: true }
        );

        res.json({project});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
        
    }
}

exports.doDelete = async (req, res) => {
    //Revisión de errores de entrada
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const newProject = {};

    if(name){
        newProject.name = name;
    }

    try {
        // Revisar el ID que se envía
        let project = await Project.findById(req.params.id);

        // Verificar la existencia del proyecto
        if(!project){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar el creador del proyecto
        if(project.owner.toString() !== req.user.id){
            return res.status(401).json({ msg: 'No autorizado'});
        }

        // Eliminar
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
        
    }    
}