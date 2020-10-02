const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.doGet = async(req, res) => {

    try {

        //Extraer el proyecto y revisar si existe
        const { project } = req.query;

        // Verificar si existe el proyecto
        const projectInDB = await Project.findById(project);
        if(!projectInDB){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Verificar el creador del proyecto
        if(projectInDB.owner.toString() !== req.user.id){
            return res.status(401).json({ msg: 'No autorizado'});
        }

        // Obtener las tareas por proyecto
        const tasks = await Task.find({ project }).sort({ registerDate: -1 });
        res.json({ tasks });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
   
}


exports.doPost = async(req, res) => {
    //Revisión de errores de entrada
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        //Extraer el proyecto y revisar si existe
        const { project } = req.body;

        // Verificar si existe el proyecto
        const projectInDB = await Project.findById(project);
        if(!projectInDB){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Verificar el creador del proyecto
        if(projectInDB.owner.toString() !== req.user.id){
            return res.status(401).json({ msg: 'No autorizado'});
        }

        // Crear la nueva tarea
        const task = new Task(req.body);
        await task.save();
        res.json({ task });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.doPut = async (req, res) => {

   try {

       //Extraer el proyecto y revisar si existe
       const { project, name, completed } = req.body;

       // Verificar si existe la tarea
       let task = await Task.findById(req.params.id);
       if(!task){
           return res.status(404).json({msg: 'Tarea no encontrada'});
       }

       // Verificar el creador del proyecto
       const projectInDB = await Project.findById(project);
       if(projectInDB.owner.toString() !== req.user.id){
           return res.status(401).json({ msg: 'No autorizado'});
       }
       const newTask = {};
       newTask.name = name;
       newTask.completed = completed;
       
       task = await Task.findOneAndUpdate( { _id: req.params.id } , newTask, { new: true });
       res.json({ task });

   } catch (error) {
       console.log(error);
       res.status(500).send('Hubo un error');
   }

}

exports.doDelete = async (req, res) => {
    try {
 
        //Extraer el proyecto y revisar si existe
        const { project } = req.query;
 
        // Verificar si existe la tarea
        let task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }
 
        // Verificar el creador del proyecto
        const projectInDB = await Project.findById(project);
        if(projectInDB.owner.toString() !== req.user.id){
            return res.status(401).json({ msg: 'No autorizado'});
        }

        await Task.findByIdAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada correctamente'});

 
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
 
 }