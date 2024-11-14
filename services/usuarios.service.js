import { Usuario } from "../models/usuario.model.js";

const getUsuarioByEmail = async (email) => {
  const usersWithEmail = await Usuario.findAll({ where: { email: email } });
  return usersWithEmail[0];
};

const getUsuarioById = async (id) => {
  const usersWithId = await Usuario.findAll({ where: { id: id } });
  return usersWithId[0];
};

const createUsuario = async (usuario) => {
  return await Usuario.create({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    password: usuario.password,
    admin: false,
  });
};

export default { getUsuarioByEmail, getUsuarioById, createUsuario };
