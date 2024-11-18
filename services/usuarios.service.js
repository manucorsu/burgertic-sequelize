import { Usuario } from "../models/usuario.model.js";

const getUsuarioByEmail = async (email) => {
  return await Usuario.findOne({ where: { email: email } });
};

const getUsuarioById = async (id) => {
  return await Usuario.findByPk(id);
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
