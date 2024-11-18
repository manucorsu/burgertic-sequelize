import Router from "express";
import PlatosController from "../controllers/platos.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import { verifyId } from "../middlewares/verifyId.middleware.js";

const router = Router();

router.get("/", PlatosController.getPlatos);
router.get("/:id", verifyId, PlatosController.getPlatoById);
router.get("/tipo/:tipo", PlatosController.getPlatosByTipo);
router.post("/", verifyToken, verifyAdmin, PlatosController.createPlato);
router.put("/:id", verifyId, verifyToken, verifyAdmin, PlatosController.updatePlato);
router.delete("/:id", verifyId, verifyToken, verifyAdmin, PlatosController.deletePlato);

export default router;
