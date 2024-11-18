import { sequelize } from "../db.js";
import { Pedido } from "./pedido.model.js";
import { Plato } from "./plato.model.js";
import { PlatosPedido } from "./platospedido.model.js";
import { Usuario } from "./usuario.model.js";

export const defineModels = async (forceAndAlter = false) => {
  if (typeof forceAndAlter !== "boolean") {
    throw new Error("forceAndAlter debe ser un bool");
  }

  if(forceAndAlter){
    console.warn("Se eliminarán todos los registros de la base de datos (también se van a insertar todos los platos que estaban en burgertic.sql)");
  }

  Pedido.belongsToMany(Plato, { through: PlatosPedido });
  Plato.belongsToMany(Pedido, { through: PlatosPedido });
  Usuario.hasMany(Pedido);
  Pedido.belongsTo(Usuario);

  await sequelize.sync({ force: forceAndAlter, alter: forceAndAlter });

  if (forceAndAlter) {
    await Plato.bulkCreate([
      //https://chatgpt.com/share/673a6800-fee0-8010-a64d-77027d8e81ce
      {
        tipo: "combo",
        nombre: "Combo Ivo",
        precio: 3000,
        descripcion: "Un sandwich de gallina, con papas y gaseosa. Si venis con 12 amigos te cobramos la mitad + 1",
      },
      {
        tipo: "combo",
        nombre: "Combo Chona",
        precio: 3100,
        descripcion:
          "Una FigmaBurger, con papas y gaseosa. Si queres una hamburguesa estética para subir a Instagram, esta es la tuya",
      },
      {
        tipo: "combo",
        nombre: "Combo Aro y Ranzo",
        precio: 4500,
        descripcion:
          "Una P.H.P. y un Em-Paty-Zando con 2 gaseosas y 2 porciones de papas. Ideal para compartir con tu pareja",
      },
      {
        tipo: "combo",
        nombre: "Combo M.E.P.",
        precio: 5000,
        descripcion:
          "Milanesa gigante, 3 empanadas y papas. Laburar? No, veni a compartir este combo con tus amigos y disfruta del tiempo libre",
      },
      {
        tipo: "combo",
        nombre: "Combo Nacho",
        precio: 3500,
        descripcion:
          "Un SQL, nachos con guacamole, gaseosa y de postre un vigilante. Si haces bien la request, te llega al instante",
      },
      {
        tipo: "combo",
        nombre: "Combo Jero",
        precio: 3100,
        descripcion:
          "Una milanesa Blender, bolsa de 3Ds y gaseosa. No se juega con la comida, pero podes jugar videojuegos mientras comes este combo",
      },
      {
        tipo: "combo",
        nombre: "Combo Daro",
        precio: 2900,
        descripcion:
          "Una hamburguesa eléctrica con pocas papas y un vaso de gaseosa, el dólar está muy alto y no nos aceptan más presupuesto. Nosotros los preparamos pero vos andá a buscarlo. Si no lo encontras, no hay reembolso",
      },
      {
        tipo: "combo",
        nombre: "Menu Infantil Luca",
        precio: 3500,
        descripcion:
          "Una caja de 10 nuggets y gaseosa. Para los más chicos de la casa, o para los que tengan muchos rulos",
      },
      {
        tipo: "principal",
        nombre: "FigmaBurger",
        precio: 2000,
        descripcion:
          "Hamburguesa de carne, con lechuga, tomate, cebolla, queso y salsa de la casa. Está separada en componentes, así que podes editarla a tu gusto",
      },
      {
        tipo: "principal",
        nombre: "P.H.P.",
        precio: 2500,
        descripcion:
          "Pan, hamburguesa, pan. La hamburguesa más simple, pero la más rica. No te dejes engañar por su simplicidad, es una de las mejores hamburguesas que vas a probar",
      },
      {
        tipo: "principal",
        nombre: "Milanesa Blender",
        precio: 3000,
        descripcion:
          "Milanesa de carne, con queso provolone y cebolla. Combina formas y texturas de manera increible, una foto con la iluminación correcta y esta milanesa parece un render",
      },
      {
        tipo: "principal",
        nombre: "Em-Paty-Zando",
        precio: 2500,
        descripcion: "Pedila como vos quieras, nosotros vamos a atender tus pedidos y armarla como necesites",
      },
      {
        tipo: "principal",
        nombre: "Sandwich de gallina",
        precio: 1500,
        descripcion:
          "Sandwich de gallina, con lechuga, tomate, cebolla y salsa de la casa. Sale siempre fría, nada como una de estas después de ganar algún partido por penales.",
      },
      {
        tipo: "principal",
        nombre: "SQL",
        precio: 2500,
        descripcion:
          'Salsa, Queso y Lomito. No vas a encontrar un lomito más rico que este, ni aunque hagas un "select * from lomitos"',
      },
      {
        tipo: "postre",
        nombre: "Vigilante",
        precio: 1000,
        descripcion:
          "Queso y dulce de BATATA, no vendemos de membrillo. Un clásico de los postres, no puede faltar en tu pedido",
      },
      {
        tipo: "postre",
        nombre: "Pau-stre de chocolate",
        precio: 1500,
        descripcion:
          "Postre de chocolate, con dulce de leche y crema. Muy dulce, te va a hacer acordar al postre que te hacía tu mamá",
      },
      {
        tipo: "postre",
        nombre: "Helado",
        precio: 1000,
        descripcion: "Helado de crema, con dulce de leche y chocolate. Es helado, acá no se me ocurre nada",
      },
      {
        tipo: "postre",
        nombre: "TIC",
        precio: 1500,
        descripcion: "Torta Irresistible de Chocolate. Es la mejor elección sobre todo si estás en 2do.",
      },
    
    ]);
  }
};
