import express from "express";
import { employeeRouter } from "./employeeRoute";
import { cafeRouter } from "./cafeRoute";

const router = express.Router();

router.use("/employee", employeeRouter);
router.use("/cafe", cafeRouter);

export default router;
