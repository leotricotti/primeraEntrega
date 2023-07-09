import { Router } from "express";
import utils from "../utils.js";
// Array de productos
let products = [];
// Crear un router para la gestión de productos
const router = Router();
// Ruta del archivo JSON
const dataJson = "/data/products.json";
// Método asyncrono para obtener todos los productos
router.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    // Obtener los productos del archivo
    const response = await utils.readFile(dataJson);
    // Si se proporciona un parámetro limit en la consulta, devuelve solo los produntos especificados
    if (limit) {
      let tempArray = response.slice(0, limit);
      res.json({ data: tempArray, limit: limit, quantity: tempArray.length });
    } else {
      // Si no se proporciona un parámetro limit, devuelve la lista completa de productos
      res.json({ data: response, limit: false, quantity: response.length });
    }
  } catch (err) {
    // Manejar el error
    console.log(err);
  }
});
// Método asyncrono para obtener un producto por ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    // Leer el archivo JSON
    const data = await utils.readFile(dataJson);
    // Buscar el producto por su id en el array de productos
    const product = data.find((dato) => dato.id === parseInt(pid));
    // Si se encuentra el producto, devuelve un mensaje de éxito y los datos del producto
    if (product) {
      res.json({ message: "Operación realizada con exito", data: product });
    } else {
      // Si no se encuentra el producto, devuelve un mensaje de error
      res.status(404).json({
        message: "Producto no encontrado",
      });
    }
  } catch (error) {
    // Manejar el error
    console.log(error);
  }
});
// Metodo asyncrono para agregar un producto y validar que los datos sean correctos
router.post("/", async (req, res) => {
  // Obtener los datos del body
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  // Validar que todos los datos estén presentes
  if (!title || !description || !price || !code || !stock) {
    // Si falta algún dato, lanzar un error
    res.status(400).json({ message: "Faltan datos" });
  }
  try {
    // Leer el archivo JSON existente
    const data = await utils.readFile(dataJson);
    // Agregar los productos del archivo al array de productos
    products.push(...data);
  } catch (error) {
    // Manejar el error
    console.log(error);
  }
  // Obtener el último id del array de productos
  const lastId = products.reduce((max, product) => {
    return product.id > max ? product.id : max;
  }, 0);
  // Generar un nuevo id autoincremental
  const newId = lastId + 1;
  // Verificar si el código ya existe en algún producto existente
  const codeExist = products.find((product) => product.code === code);
  if (codeExist) {
    // Si el código ya existe, lanzar un error
    res.status(400).json({ message: "El código ya existe" });
  } else {
    // Si todo está bien, crear el producto y agregarlo al array
    let product = {
      id: newId,
      title: title,
      description: description,
      code: code,
      price: price,
      status: !status || typeof status !== "boolean" ? true : status,
      stock: stock,
      category: category,
      thumbnails: !thumbnails ? "" : thumbnails,
    };
    // Agregar el producto al array
    products.push(product);
    try {
      // Escribir el archivo JSON actualizado
      await utils.writeFile(dataJson, products);
      // Devolver un mensaje de éxito
      res.json({ message: "Producto creado con éxito", data: product });
    } catch (err) {
      // Manejar el error
      console.log(err);
    }
  }
});
// Método asyncrono para actualizar un producto
router.put("/:pid", async (req, res) => {
  // Obtener el id del producto a actualizar
  const { pid } = req.params;
  // Obtener los datos del body
  const {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  try {
    // Leer el archivo JSON existente
    const data = await utils.readFile(dataJson);
    // Agregar los productos del archivo al array de productos
    products.push(...data);
  } catch (error) {
    // Manejar el error
    console.log(error);
  }
  // Crear un objeto temporal para almacenar los datos del producto
  const productTemp = {};
  // Buscar el producto por su id en el array de productos
  const product = products.find((dato) => dato.id === parseInt(pid));
  // Si el producto existe, actualizarlo
  if (product) {
    // Si se proporciona ID en el body, lanzar un error
    if (id) {
      res.status(400).json({ message: "No se puede modificar el ID" });
    }
    // Si se proporciona un título, actualizarlo
    if (title) {
      productTemp.title = title;
    }
    // Si se proporciona una descripción, actualizarlo
    if (description) {
      productTemp.description = description;
    }
    // Si se proporciona un código, actualizarlo
    if (code) {
      productTemp.code = code;
    }
    // Si se proporciona un precio, actualizarlo
    if (price) {
      productTemp.price = price;
    }
    // Si se proporciona un estado, actualizarlo
    if (status) {
      productTemp.status = status;
    }
    // Si se proporciona un stock, actualizarlo
    if (stock) {
      productTemp.stock = stock;
    }
    // Si se proporciona una categoría, actualizarlo
    if (category) {
      productTemp.category = category;
    }
    // Si se proporciona una imagen, actualizarlo
    if (thumbnails) {
      productTemp.thumbnails = thumbnails;
    }
    // Actualizar el producto
    let productIndex = products.findIndex((dato) => dato.id === parseInt(pid));
    products[productIndex] = {
      ...products[productIndex],
      ...productTemp,
    };
    // Escribir los productos actualizados en el archivo JSON
    await utils.writeFile(dataJson, products);
    // Devolver un mensaje de éxito
    res.json({
      message: "Producto modificado con éxito",
      data: products[productIndex],
    });
  } else {
    // Si el producto no existe, lanzar un error
    res.status(404).json({
      message: "Producto no encontrado",
    });
  }
});
//Metodo asyncrono para eliminar un producto
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  console.log(products);
  try {
    // Leer el archivo JSON
    let data = await utils.readFile(dataJson);
    // Agregar los productos del archivo al array de productos
    products.push(...data);
    // Encontrar el índice del producto en el array de productos
    let productIndex = products.findIndex((dato) => dato.id === parseInt(pid));
    // Si se encuentra el producto, eliminarlo del array
    if (productIndex !== -1) {
      // Obtener el producto a eliminar
      let product = products[productIndex];
      // Eliminar el producto del array
      products.splice(productIndex, 1);
      // Escribir el archivo JSON actualizado
      await utils.writeFile(dataJson, products);
      // Devolver el producto eliminado
      res.json({ mensaje: "Producto eliminado con éxito", producto: product });
    } else {
      // Si no se encuentra el producto, devolver un mensaje indicando que no existe
      res.status(404).json({ mensaje: "Producto inexistente" });
    }
  } catch (error) {
    // Manejar el error
    console.log(error);
  }
});

export default router;
