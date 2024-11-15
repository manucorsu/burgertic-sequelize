import { sequelize } from "../db.js";
import { Pedido } from "./pedido.model.js";
import { Plato } from "./plato.model.js";
import { PlatosPedido } from "./platospedido.model.js";
import { Usuario } from "./usuario.model.js";

export const defineModels = async (forceAndAlter = false) => {
  if (typeof forceAndAlter !== "boolean") {
    throw new Error("forceAndAlter must be a boolean");
  }

  Pedido.belongsToMany(Plato, { through: PlatosPedido });
  Plato.belongsToMany(Pedido, { through: PlatosPedido });
  Usuario.hasMany(Pedido);
  Pedido.belongsTo(Usuario);

  await sequelize.sync({ force: forceAndAlter, alter: forceAndAlter });
};
