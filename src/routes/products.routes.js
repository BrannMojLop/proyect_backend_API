import { Router } from "express";
const { check, validationResult } = require('express-validator');

const router = Router();

// Controllers
import { createProduct, showProducts, getProduct, disableProduct, updateProduct, disableProducts } from "../controllers/products";

/* Routes = {
    (post '/') => createProduct: "Crear un nuevo producto"
    (get '/') => showProducts: "Mostrar todos los productos existentes"
    (post '/:id') => getProduct: "Mostrar un producto por ID"
    (put '/:id') => updateProduct: "Editar un producto por ID"
    (delete '/:id') => deleteProduct: "Deshabilitar un producto por ID"
    (delete '/') => deleteProducts: "Deshabilitar todos los productos existentes"
}
 */

router.get('/', showProducts);

router.get('/:id', getProduct);

router.post('/', function (req, res) {
    createProduct(req, res);
})

router.put('/:id', updateProduct);

router.delete('/:id', disableProduct);

router.delete('/', disableProducts);


export default router;