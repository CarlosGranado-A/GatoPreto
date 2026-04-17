import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// 🔥 FILTRO REAL
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = ["image/png", "image/jpeg"];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Arquivo inválido! Apenas PNG ou JPG."));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});