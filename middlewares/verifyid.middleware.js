const MAX_INT = 2147483647; //El valor más grande posible para INTEGER/SERIAL de PostgreSQL. Fuente https://www.postgresql.org/docs/current/datatype-numeric.html

/**
 * Verifica que se haya pasado un id en los params y que este sea un número entero mayor o igual a 1.
 */
export const verifyId = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "No se envió un id." });
    }

    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id > MAX_INT || id < 1) {
      return res.status(400).json({ message: `El id debe ser un número entero entre 1 y ${MAX_INT}.` });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json;
  }
};
