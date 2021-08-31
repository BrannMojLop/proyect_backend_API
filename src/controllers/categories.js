import { connect } from "../config/database";
import { ObjectId } from "mongodb";
const Category = require('../models/categories');


async function showCategories(req, res) {
    const db = await connect();
    const result = await db.collection('categories').find({}).toArray();
    if (result.length == 0) {
        res.status(404).send({
            "message": "No se encontraron registros",
        });
    } else {
        res.json(result);
    }
}

async function createCategory(req, res) {
    const { title, description, sector, status } = req.body;
    const category = new Category(title, description, sector, status);
    const db = await connect();
    await db.collection('categories').insertOne(category);
    res.send({
        message: "Categoria Creada con Exito",
    });
}

async function getCategory(req, res) {
    try {
        const db = await connect();
        const result = await db.collection('categories').find({
            _id: ObjectId(req.params.id)
        }).toArray();
        res.json(result);
    } catch (err) {
        res.status(404).send({
            "message": "Categoria no encontrada",
        })
    }
}

async function updateCategory(req, res) {
    const dataUpdate = {};
    Object.keys(req.body).forEach(atributo => {
        dataUpdate[atributo] = req.body[atributo];
        if (atributo === "create_at" || atributo === "update_at") {
            res.status(400);
        }
    });
    const db = await connect();

    await db.collection("categories").updateOne({
        _id: ObjectId(req.params.id)
    }, {
        $set: dataUpdate
    });
    res.send({
        message: 'Categoria Actualizada con Exito'
    });
}

async function deleteCategory(req, res) {
    const db = await connect();
    try {
        const result = await db.collection('categories').findOneAndDelete({
            _id: ObjectId(req.params.id)
        });
        res.send({
            "message": `Categoria Eliminada con Exito`
        });
    } catch (err) {
        res.status(404).send({
            "message": "Categoria no encontrada",
        })
    }
}

async function deleteCategories(req, res) {
    const db = await connect();
    try {
        await db.collection('categories').remove({});
        res.send({
            "message": `Categorias Eliminados con Exito`
        });
    } catch (err) {
        res.status(404).send({
            "message": "Categorias no Eliminados",
        })
    }
}

// exportamos las funciones definidas
module.exports = {
    createCategory,
    showCategories,
    getCategory,
    deleteCategory,
    updateCategory,
    deleteCategories
}