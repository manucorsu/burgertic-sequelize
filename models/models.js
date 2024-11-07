import { sequelize } from "../db";
import { Pedido } from "./pedidos.model";
import { Plato } from "./platos.model";
import { PlatosPedido } from "./platospedido.model";
import { Usuario } from "./usuarios.model";

Pedido.hasMany(Plato);
Plato.belongsToMany(Pedido, { through: PlatosPedido });
Usuario.hasMany(Pedido);
Pedido.belongsTo(Usuario);

await sequelize.sync({ force: true });
