import { db } from "../db.js";

// GET continua igual
export const getGatos = (_, res) => {
    const q = "SELECT * FROM gatos";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

// POST com imagem
export const addGato = (req, res) => {
    const q = `
        INSERT INTO gatos 
        (nome, sexo, data_nascimento, fiv_felv, peso, observacoes, foto)
        VALUES (?)
    `;

    const values = [
    req.body.nome,
    req.body.sexo,
    null,
    req.body.fiv_felv || "Nao testado",
    req.body.peso,
    null,
    req.file ? req.file.filename : null
];

    db.query(q, [values], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Gato criado");
    });
};

export const deleteGato = (req, res) => {
    const q = "DELETE FROM gatos WHERE id = ?";

    db.query(q, [req.params.id], (err) => {
        if (err) {
            console.log("ERRO DELETE:", err); // 👈 importante
            return res.status(500).json(err);
        }
        return res.status(200).json("Gato deletado");
    });
};
export const updateGato = (req, res) => {
    let q = `
        UPDATE gatos 
        SET nome = ?, sexo = ?, peso = ?, fiv_felv = ?
    `;

    const values = [
        req.body.nome,
        req.body.sexo,
        req.body.peso,
        req.body.fiv_felv
    ];

    if (req.file) {
        q += `, foto = ?`;
        values.push(req.file.filename);
    }

    q += ` WHERE id = ?`;
    values.push(req.params.id);

    db.query(q, values, (err) => {
        if (err) {
            console.log("ERRO UPDATE:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Gato atualizado");
    });
};