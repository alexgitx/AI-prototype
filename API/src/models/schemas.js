const Joi = require('joi');

const Course = Joi.object({
    nombre: Joi.string().required(),
    codigo: Joi.string().required(),
    curso: Joi.string().required()
}).required();

const Person = Joi.object({
    nombre: Joi.string().required(),
    apellido_1: Joi.string().required(),
    apellido_2: Joi.string().required(),
    nombre_completo: Joi.string().required(),
    telefono: Joi.string().required(),
    cod_tipo_documento: Joi.string().required(),
    numero_documento:Joi.string().required(),
    email: Joi.string().required()
}).required();

const Qualification = Joi.object({
    id_modulo: Joi.string().required(),
    nombre_modulo: Joi.string().required(),
    id_asignatura: Joi.string().required(),
    nombre_asignatura: Joi.string().required(),
    creditos: Joi.string().required(),
    cod_calificacion: Joi.string().required(),
    calificacion: Joi.string().required()
}).required();

const Procedings = Joi.object({
    datos_expediente: Joi.object({
        curso: Course,
        director: Person,
        alumno: Person,
        calificaciones: Joi.array().items(Qualification).required(),
        id_expediente: Joi.number().required(),
        calificacion_media: Joi.string().required(),
        pdf: Joi.binary().required()
    }).required(),
    hash: Joi.string().required()
}).required()

const Proceding = Joi.number();

const Hash = Joi.object({
    hash: Joi.string().required()
});

const Act = Joi.object({
    datos_acta: Joi.object({
        curso: Course,
        director: Person,
        fecha_cierre: Joi.string().required(),
        pdf: Joi.binary().required(),
        expedientes: Joi.array().items(Procedings).required()        
    }).required(),
    hash: Joi.string().required()
});


module.exports = { Act, Hash, Person, Course, Proceding };