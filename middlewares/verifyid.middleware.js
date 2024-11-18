/**
 * Verifica que se haya pasado un id en los params y que este sea un número entero mayor o igual a 1.
 */
export const verifyId = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No se envió un id." });
  }

  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    //con esto mato dos pájaros de un tiro: Si el id no era un número, hacer
    //Number(req.params.id) hace que id sea NaN, y hacer Number.isSafeInteger de NaN
    //te da false.
    return res.status(400).json({ message: "El id debe ser un número entero mayor o igual a 1." });
  }

  next();
};
