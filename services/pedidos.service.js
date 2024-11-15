import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;
import { Pedido } from "../models/pedido.model.js";
import { Plato } from "../models/plato.model.js";
import { PlatosPedido } from "../models/platospedido.model.js";
import { Usuario } from "../models/usuario.model.js";

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
  if(Number.isNaN(id)) throw new TypeError("El id debe ser un número.");
  else return await Pedido.findByPk(id);
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
  if(Number.isNaN(idUsuario)) throw new TypeError("idUsuario debe ser un número.");
  if(!Usuario.findByPk(idUsuario)) throw new Error(`No se encontró un usuario con el id ${id}`);

  const platosdb = []
  for(const p of platos){
    const platodb = await Plato.findByPk(p.id);
    if(!platodb) throw new Error("Por lo menos de uno los platos no existe en la base de datos.");
    else platosdb.push(platodb);
  }

//todo
  // await Pedido.create(
  //   {
  //     fecha: new Date(),
  //     estado: "pendiente",
  //     userId: idUsuario
  //   },
  //   { include: [Plato, Usuario] }
  // );
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
