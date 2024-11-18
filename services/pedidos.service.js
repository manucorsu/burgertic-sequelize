import { Pedido } from "../models/pedido.model.js";
import PlatosService from "./platos.service.js";
import NotFoundError from "../errors/notfound.error.js";
import UsuariosService from "./usuarios.service.js";
import { PlatosPedido } from "../models/platospedido.model.js";

const getPlatosByPedido = async (idPedido) => {
  const pedido = await Pedido.findByPk(idPedido);
  if (!pedido) throw new NotFoundError(`No se encontró un pedido con el id ${id}`);

  const platosPedido = await PlatosPedido.findAll({ where: { pedidoId: idPedido } });
  const result = [];
  for (const pp of platosPedido) {
    const plato = await PlatosService.getPlatoById(pp.platoId);
    if (!plato) throw new Error(`El pedido tenía un plato que no existe (plato con id ${resultItem.id})`);

    const resultItem = {
      id: plato.id,
      cantidad: pp.cantidad,
    };
    result.push(resultItem);
  }

  return result;
};

const getPedidos = async () => {
  const pedidos = await Pedido.findAll();

  const result = [];
  for (const pedido of pedidos) {
    result.push({
      id: pedido.id,
      idUsuario: pedido.userId,
      fecha: pedido.fecha,
      estado: pedido.estado,
      platos: await getPlatosByPedido(pedido.id),
    });
  }

  return result;
};

const getPedidoById = async (id) => {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) throw new NotFoundError(`No existe un pedido con id ${id}`);

  return {
    id: pedido.id,
    idUsuario: pedido.userId,
    fecha: pedido.fecha,
    estado: pedido.estado,
    platos: await getPlatosByPedido(pedido.id),
  };
};

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

  const pedido = await Pedido.findByPk(id);
  if(!pedido) throw new NotFoundError(`No se encontró un pedido con id ${id}`);

  pedido.estado = estado;
  await pedido.save();
};

const deletePedido = async (id) => {
  const pedido = await Pedido.findByPk(id);
  if(!pedido) throw new NotFoundError(`No se encontró un pedido con id ${id}`);

  await pedido.destroy();
};

export default {
  getPedidos,
  getPedidoById,
  getPedidosByUser,
  createPedido,
  updatePedido,
  deletePedido,
};
