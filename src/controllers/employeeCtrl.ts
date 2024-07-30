import { differenceInDays } from "date-fns";
import { Request, Response } from "express";
import { db } from "../db";
import { generateCustomId } from "../utils";
import { employeeSchema } from "../validator";

export async function getEmployees(req: Request, res: Response) {
  const cafe = req.query.cafe;

  // if cafe is not provided, return all employees
  if (!cafe) {
    try {
      const data = await db.employee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          startDate: true,
          employeeId: true,
          gender: true,
          cafe: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          startDate: "asc",
        },
      });

      const dataWithDays = data.map((employee) => {
        const days = differenceInDays(new Date(), employee.startDate);
        return { ...employee, daysWorked: days };
      });

      return res.json({ data: dataWithDays });
    } catch (error) {
      handleError(error, res);
    }
  }

  // if cafe is provided, return employees of that cafe
  try {
    const data = await db.employee.findMany({
      where: {
        cafeId: cafe as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        startDate: true,
        employeeId: true,
        gender: true,
        cafe: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    const dataWithDays = data.map((employee) => {
      const days = differenceInDays(new Date(), employee.startDate);
      return { ...employee, daysWorked: days };
    });

    return res.json({ data: dataWithDays });
  } catch (error) {
    handleError(error, res);
  }
}

export async function createEmployee(req: Request, res: Response) {
  const { name, email, phone, gender, startDate, cafeId } = req.body;

  const result = employeeSchema.safeParse({
    name,
    email,
    phone,
    gender,
    cafeId,
    startDate,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten().fieldErrors });
  }

  try {
    const data = await db.employee.create({
      data: {
        name,
        email,
        phone,
        gender,
        cafeId,
        startDate: new Date(startDate),
        employeeId: generateCustomId(),
      },
    });

    return res.status(201).json({
      data: {
        id: data.id,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
}

export async function updateEmployee(req: Request, res: Response) {
  const { name, email, phone, gender, startDate, cafeId } = req.body;

  const result = employeeSchema.safeParse({
    name,
    email,
    phone,
    gender,
    cafeId,
    startDate,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten().fieldErrors });
  }

  const { id } = req.params;

  try {
    await db.employee.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        phone,
        gender,
        cafeId,
        startDate: new Date(startDate),
      },
    });

    return res.status(200).json({ data: { id } });
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteEmployee(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await db.employee.delete({
      where: {
        id,
      },
    });

    return res.status(204).end();
  } catch (error) {
    handleError(error, res);
  }
}

export async function getEmployee(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const employee = await db.employee.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        startDate: true,
        employeeId: true,
        gender: true,
        cafe: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.json({ data: employee });
  } catch (error) {
    handleError(error, res);
  }
}

function handleError(error: any, res: Response) {
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(400).json({ error: "An error occurred" });
}
