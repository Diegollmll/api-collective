import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res) => {
    console.error("Error:", err);
    res.status(500).json({ success: false, error: "Ocurrió un error en el servidor" });
};
