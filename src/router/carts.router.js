import { Router } from "express";
import utils from "../utils.js";

// Crear un router para la gestión de productos
const router = Router();
// Ruta del archivo JSON
const dataJson = "/data/carts.json";
// Ruta del archivo JSON de productos
const productsJson = "/data/products.json";
// Array de carritos
const carts = [];
// Array de productos
const products = [];
// Metodo asyncrono para agregar un carrito y validar que los datos sean correctos
router.post("/", async (req, res) => {
  try {
    // Leer el archivo JSON existente
    const data = await utils.readFile(dataJson);
    // Agregar los productos del archivo al array de carritos
    carts.push(...data);
  } catch (error) {
    // Manejar el error
    console.log(error);
  }
  // Obtener el último id del array de productos
  const lastId = carts.reduce((max, cart) => {
    return cart.id > max ? cart.id : max;
  }, 0);
  // Generar un nuevo id autoincremental
  const newId = lastId + 1;
  // Crear un nuevo carrito
  const newCart = {
    id: newId,
    products: [],
  };
  // Agregar el carrito al array
  carts.push(newCart);
  try {
    // Escribir el archivo JSON actualizado
    await utils.writeFile(dataJson, carts);
    // Devolver un mensaje de éxito
    res.json({ message: "Carrito creado con éxito", data: newCart });
  } catch (err) {
    // Manejar el error
    console.log(err);
    res.status(500).json({ message: "Error al crear el carrito" });
  }
});
// Método asyncrono para obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    // Leer el archivo JSON
    const data = await utils.readFile(dataJson);
    // Buscar el carrito por su id en el array de carritos
    const carrito = data.find((dato) => dato.id === parseInt(cid));
    // Si se encuentra el carrito, devuelve un mensaje de éxito y los datos del carrito
    if (carrito) {
      res.json({ message: "Operación realizada con exito", data: carrito });
    } else {
      // Si no se encuentra el producto, devuelve un mensaje de error
      res.status(404).json({
        message: "Carrito no encontrado",
      });
    }
  } catch (error) {
    // Manejar el error
    console.log(error);
  }
});
// Método asyncrono para agregar productos al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  // Obtener el id del carrito y del producto
  const { cid, pid } = req.params;
  // Obtener los datos del producto y la cantidad
  const { quantity } = req.body;
  // Validar que los datos sean correctos
  if (!quantity) {
    res.status(400).json({ message: "Faltan datos" });
  }
  try {
    // Leer el archivo JSON
    const data = await utils.readFile(dataJson);
    // Agregar los productos del archivo al array de carritos
    carts.push(...data);
  } catch (error) {
    // Manejar el error
    console.log(error);
  }
  // Buscar el carrito por su id en el array de carritos
  const cartExist = carts.find((dato) => dato.id === parseInt(cid));
  try {
    // Leer el archivo JSON de productos
    const data = await utils.readFile(productsJson);
    // Agregar los productos del archivo al array de productos
    products.push(...data);
  } catch (error) {
    // Manejar el error
    console.log(error);
  }
  // Si se encuentra el carrito, devuelve un mensaje de éxito y los datos del carrito
  if (cartExist) {
    // Buscar el producto por su id en el array de productos
    const productIdExist = products.find((dato) => dato.id === parseInt(pid));
    // Buscar el producto por su id en el array
    const productExist = cartExist.products.find(
      (dato) => dato.id === parseInt(pid)
    );
    // Si se encuentra el producto, actualiza la cantidad del producto
    if (productExist && productIdExist) {
      productExist.quantity = productExist.quantity + quantity;
    } else if (!productIdExist) {
      // Si no se encuentra el producto, devuelve un mensaje de error
      res.status(404).json({
        message: "Producto no encontrado",
      });
    } else {
      // Si no se encuentra el producto, lo agrega al carrito y le asigna la cantidad
      const newProduct = { id: parseInt(pid), quantity: quantity };
      cartExist.products.push(newProduct);
    }
    try {
      // Escribir el archivo JSON actualizado
      await utils.writeFile(dataJson, carts);
      // Devolver un mensaje de éxito
      res.json({
        message: "Producto actualizado con éxito",
        data: cartExist,
      });
    } catch (err) {
      // Manejar el error
      console.log(err);
      res.status(500).json({ message: "Error al actualizar el producto" });
    }
  } else {
    // Si no se encuentra el carrito, devuelve un mensaje de error
    res.status(404).json({
      message: "Carrito no encontrado",
    });
  }
});

export default router;
