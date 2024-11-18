import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;
import { Pedido } from "../models/pedido.model.js";
import PlatosService from "./platos.service.js";
import NotFoundError from "../errors/notfound.error.js";
import UsuariosService from "./usuarios.service.js";
import { PlatosPedido } from "../models/platospedido.model.js";

const getPlatosByPedido = async (idPedido) => {
  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query("SELECT * FROM pedidos_platos WHERE id_pedido = $1", [idPedido]);

    if (rows.length < 1) throw new Error("Pedido no encontrado");

    const result = await Promise.all(
      rows.map(async (plato) => {
        const { rows } = await client.query("SELECT * FROM platos WHERE id = $1", [plato.id_plato]);

        if (rows.length < 1) throw new Error("Plato no encontrado");

        return {
          ...rows[0],
          cantidad: plato.cantidad,
        };
      })
    );

    await client.end();
    return result;
  } catch (error) {
    await client.end();
    throw error;
  }
};

const getPedidos = async () => await Pedido.findAll();

const getPedidoById = async (id) => await Pedido.findByPk(id);

const getPedidosByUser = async (idUsuario) => {
  return await Pedido.findAll({ where: { userId: idUsuario } });
};

const createPedido = async (idUsuario, platos) => {
  const usuario = await UsuariosService.getUsuarioById(idUsuario);
  if (!usuario) throw new NotFoundError(`No se encontró ningún usuario con el id ${id}. El pedido no se generó.`);

  const pedido = await Pedido.create({
    userId: usuario.id,
    fecha: new Date(),
    estado: "pendiente",
  });

  const ppCreados = [];
  try {
    for (const plato of platos) {
      const platodb = await PlatosService.getPlatoById(plato.id);
      if (!platodb) throw new NotFoundError(`No se encontró ningún plato con id ${plato.id}. El pedido no se generó.`);

      const pp = await PlatosPedido.create({
        platoId: plato.id,
        pedidoId: pedido.id,
        cantidad: plato.cantidad,
      });
      ppCreados.push(pp);
    }
  } catch (error) {
    await pedido.destroy();
    for (const pp of ppCreados) await pp.destroy();
    throw error;
  }
};

const updatePedido = async (id, estado) => {
  if (estado !== "aceptado" && estado !== "en camino" && estado !== "entregado") throw new Error("Estado inválido");

  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query("UPDATE pedidos SET estado = $1 WHERE id = $2", [estado, id]);

    await client.end();
    return rows;
  } catch (error) {
    await client.end();
    throw error;
  }
};

const deletePedido = async (id) => {
  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query("DELETE FROM pedidos WHERE id = $1", [id]);

    await client.end();
    return rows;
  } catch (error) {
    await client.end();
    throw error;
  }
};

export default {
  getPedidos,
  getPedidoById,
  getPedidosByUser,
  createPedido,
  updatePedido,
  deletePedido,
};
