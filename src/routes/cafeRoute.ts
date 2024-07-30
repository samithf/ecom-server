import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import * as cafeCtrl from "../controllers/cafeCtrl";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const newFilename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return cafeCtrl.getCafes(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  return cafeCtrl.getCafe(req, res);
});

router.post("/", upload.single("logo"), (req: Request, res: Response) => {
  return cafeCtrl.createCafe(req, res);
});

router.put("/:id", upload.single("logo"), (req: Request, res: Response) => {
  return cafeCtrl.updateCafe(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
  return cafeCtrl.deleteCafe(req, res);
});

export const cafeRouter = router;
