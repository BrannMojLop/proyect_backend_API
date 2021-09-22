const connect = require('../config/database');
const Product = require('../models/Product');
const User = require('../models/User');


async function showProducts(req, res) {
    await connect();
    if (req.query.name) {
        await Product.find({ name: { $regex: req.query.name, $options: "$i" } }, function (err, products) {
            if (err) {
                res.status(401).send(err);
            } else if (products.length > 0) {
                res.status(200).send(products);
            } else {
                res.status(404).send("No se han encontrado registros");
            }
        })
    } else if (req.query.id_lessor) {
        await Product.find({ id_lessor: req.query.id_lessor }, function (err, products) {
            if (err) {
                res.status(401).send(err);
            } else if (products.length > 0) {
                res.status(200).send(products);
            } else {
                res.status(404).send("No se han encontrado registros");
            }
        })
    } else if (req.query.id_category) {
        await Product.find({ id_category: req.query.id_category }, function (err, products) {
            if (err) {
                res.status(401).send(err);
            } else if (products.length > 0) {
                res.status(200).send(products);
            } else {
                res.status(404).send("No se han encontrado registros");
            }
        })
    } else {
        const products = await Product.find();
        if (products.length === 0) {
            res.send("No se han encontrado registros");
        } else {
            res.status(200).send(products);
        }
    }
}

async function createProduct(req, res) {
    const product = new Product(req.body)

    await connect();

    const user = await User.findById(req.usuario.id);
    const type = await user.typeUser(user.id_type);

    if (type === 2) {
        await product.save(function (err) {
            if (err) {
                res.status(400).json({
                    success: false,
                    type: err.title,
                    error: err.message
                });
            } else {
                res.status(201).json({
                    success: "Producto creado con Exito",
                    Product: product
                });
            }
        });
    } else {
        res.status(401).send("Permisos insuficientes")
    }
}

async function getProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(204).send("No se han encontrado registros");
        } else {
            res.status(200).send(product);
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

async function updateProduct(req, res) {
    await connect();

    const user = await User.findById(req.usuario.id);
    const type = await user.typeUser(user.id_type);

    if (type === 2) {
        const product = await Product.findById(req.params.id, function (err) {
            if (err) {
                res.status(400).json({
                    error: err.name,
                    message: err.message
                })
            }
        });
        if (!product) {
            res.status(204).send("No se han encontrado el registro");
        } else if (product.id_lessor != user.id) {
            res.status(401).send("Permisos insuficientes");
        } else {
            await Product.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).send({
                message: 'Producto Actualizado con Exito'
            });
        }
    } else {
        res.status(401).send("Permisos insuficientes")
    }
}

async function disableProduct(req, res) {
    await connect();

    const user = await User.findById(req.usuario.id);
    const type = await user.typeUser(user.id_type);

    if (type === 2) {
        const product = await Product.findById(req.params.id, function (err) {
            if (err) {
                res.status(400).json({
                    error: err.name,
                    message: err.message
                })
            }
        });
        if (!product) {
            res.status(204).send("No se han encontrado el registro");
        } else if (product.id_lessor != user.id) {
            res.status(401).send("Permisos insuficientes");
        } else {
            await Product.findByIdAndUpdate(req.params.id, {
                "status": false
            });
            res.status(200).send({
                message: 'Producto Deshabilitado con Exito'
            });
        }
    } else {
        res.status(401).send("Permisos insuficientes")
    }
}

async function disableProducts(req, res) {
    await connect();

    const user = await User.findById(req.usuario.id);
    const type = await user.typeUser(user.id_type);

    if (type === 1) {
        await Product.updateMany({ "status": false }, function (err, products) {
            if (err) {
                res.status(401).send("No se han encontrado el registros");
            } else {
                res.status(200).send({
                    message: 'Productos Deshabilitados con Exito'
                });
            }
        });
    } else {
        res.status(401).send("Permisos insuficientes")
    }
}

// exportamos las funciones definidas
module.exports = {
    createProduct,
    showProducts,
    getProduct,
    disableProduct,
    updateProduct,
    disableProducts
}
