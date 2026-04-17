import express from "express";
import { upload } from "../upload.js";
import { getGatos, addGato, deleteGato, updateGato } from "../controllers/gatos.js";

const router = express.Router();

router.get("/", getGatos);
router.delete("/:id", deleteGato);
router.put("/:id", upload.single("foto"), updateGato);

router.post("/", upload.single("foto"), addGato);

router.delete("/:id", (req, res) => {
    const q = "DELETE FROM gatos WHERE id = ?";

    db.query(q, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Gato deletado");
    });
});

export default router;