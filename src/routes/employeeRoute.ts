import express, { Request, Response } from "express";
import * as employeeCtrl from "../controllers/employeeCtrl";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return employeeCtrl.getEmployees(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  return employeeCtrl.getEmployee(req, res);
});

router.post("/", (req: Request, res: Response) => {
  return employeeCtrl.createEmployee(req, res);
});

router.put("/:id", (req: Request, res: Response) => {
  return employeeCtrl.updateEmployee(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
  return employeeCtrl.deleteEmployee(req, res);
});

export const employeeRouter = router;
