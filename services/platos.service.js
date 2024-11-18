import NotFoundError from "../errors/notfound.error.js";
import { Plato } from "../models/plato.model.js";

const getPlatos = async () => await Plato.findAll();

const getPlatoById = async (id) => await Plato.findByPk(id);
// await Plato.findAll({
//     where: {
//         id: id,
//     },
// });

const createPlato = async (plato) => {
  await Plato.create({
    tipo: plato.tipo,
    nombre: plato.nombre,
    precio: plato.precio,
    descripcion: plato.descripcion,
  });
};
//faltaba el await creo
// Plato.create({
//     tipo: plato.tipo,
//     nombre: plato.nombre,
//     precio: plato.precio,
//     descripcion: plato.descripcion,
// });

const updatePlato = async (id, newData) => {
  //   const plato = await Plato.findByPk(id);
  const plato = await getPlatoById(id);
  //   if (!plato) throw new Error("Plato no encontrado");
  if (!plato) throw new NotFoundError(`No se encontró un plato con el id ${id}`); //para que el controller tire 404 en vez de 500

  plato.tipo = newData.tipo;
  plato.nombre = newData.nombre;
  plato.precio = newData.precio;
  plato.descripcion = newData.descripcion;

  await plato.save();
};

const deletePlato = async (id) => {
  //   const plato = await Plato.findByPk(id);
  const plato = await getPlatoById(id);
  //   if (!plato) throw new Error("Plato no encontrado");
  if (!plato) throw new NotFoundError(`No se encontró un plato con el id ${id}`); //para que el controller tire 404 en vez de 500

  await plato.destroy();
};

const getPlatosByTipo = async (tipo) => Plato.findAll({ where: { tipo: tipo } });

export default {
  getPlatos,
  getPlatoById,
  createPlato,
  updatePlato,
  deletePlato,
  getPlatosByTipo,
};
