import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;
import { Pedido } from "../models/pedido.model.js";
import { Plato } from "../models/plato.model.js";
import { PlatosPedido } from "../models/platospedido.model.js";

const getPlatosByPedido = async (idPedido) => {
  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query(
      "SELECT * FROM pedidos_platos WHERE id_pedido = $1",
      [idPedido]
    );

    if (rows.length < 1) throw new Error("Pedido no encontrado");

    const result = await Promise.all(
      rows.map(async (plato) => {
        const { rows } = await client.query(
          "SELECT * FROM platos WHERE id = $1",
          [plato.id_plato]
        );

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

const getPedidos = async () => {
  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query("SELECT * FROM pedidos");

    if (rows.length < 1) return [];

    const result = await Promise.all(
      rows.map(async (pedido) => {
        const platos = await getPlatosByPedido(pedido.id);
        return {
          ...pedido,
          platos,
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

const getPedidoById = async (id) => {
  const p = await Pedido.findAll({
    where: {
      id: id,
    },
  });
  return p[0];
};

const getPedidosByUser = async (idUsuario) => {
  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query(
      "SELECT * FROM pedidos WHERE id_usuario = $1",
      [idUsuario]
    );

    if (rows.length < 1) return [];

    const result = await Promise.all(
      rows.map(async (pedido) => {
        const platos = await getPlatosByPedido(pedido.id);
        return {
          ...pedido,
          platos,
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

const createPedido = async (idUsuario, platos) => {
  const pedido = await Pedido.create({
    fecha: new Date(),
    estado: "pendiente",
    userId: id,
  });

  for (const plato of platos) {
    if (!plato.id || !plato.cantidad) {
      await pedido.destroy();
      throw new Error("Todos los platos deben tener id y cantidad");
    }
    const platosdb = await Plato.findAll({
      where: { id: plato.id },
    });
    const platodb = platosdb[0];

    if (platodb === null) {
      await pedido.destroy();
      throw new Error("Uno de los platos pasados es inválido");
    } else
      await PlatosPedido.create({ id: plato.id, cantidad: plato.cantidad });
  }
};

const updatePedido = async (id, estado) => {
  if (estado !== "aceptado" && estado !== "en camino" && estado !== "entregado")
    throw new Error("Estado inválido");

  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query(
      "UPDATE pedidos SET estado = $1 WHERE id = $2",
      [estado, id]
    );

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
    const { rows } = await client.query("DELETE FROM pedidos WHERE id = $1", [
      id,
    ]);

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
