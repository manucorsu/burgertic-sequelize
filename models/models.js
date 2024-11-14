import { sequelize } from "../db.js";
import { Pedido } from "./pedido.model.js";
import { Plato } from "./plato.model.js";
import { PlatosPedido } from "./platospedido.model.js";
import { Usuario } from "./usuario.model.js";

export const defineModels = async () => {
  Pedido.belongsToMany(Plato, {through: PlatosPedido})
  Plato.belongsToMany(Pedido, { through: PlatosPedido });
  Usuario.hasMany(Pedido);
  Pedido.belongsTo(Usuario);
  await sequelize.sync({ force: true, alter: true });
};
