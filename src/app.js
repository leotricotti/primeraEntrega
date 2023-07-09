import express from "express";
import productsRouter from "./router/products.router.js";
import cartsRouter from "./router/carts.router.js";

// Crea una instancia de la aplicación Express
const app = express();
// Puerto en el que escucha el servidor
const PORT = 8080;
// Indica que todos los formatos de datos enviados al servidor se interpretan como JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Mensaje de bienvenida
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Leonardo!");
});
// Ruta para la gestión de productos
app.use("/api/products/", productsRouter);
// Ruta para la gestión de carritos
app.use("/api/carts/", cartsRouter);
// Inicia el servidor en el puerto especificado y registra un mensaje en la consola
app.listen(PORT, () => {
  console.log(`Servidor escuchando peticiones desde el puerto ${PORT}`);
});
