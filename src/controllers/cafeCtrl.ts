import { Request, Response } from "express";
import { db } from "../db";
import { cafeSchema } from "../validator";

export async function createCafe(req: Request, res: Response) {
  const { name, description, location } = req.body;
  const logo = req.file;

  const result = cafeSchema.safeParse({ name, description, location, logo });

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten().fieldErrors });
  }

  try {
    const data = await db.cafe.create({
      data: {
        name,
        description,
        logo: logo?.path,
        location,
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

export async function updateCafe(req: Request, res: Response) {
  const { name, description, location } = req.body;
  const { id } = req.params;
  const logo = req.file;

  const result = cafeSchema.safeParse({ name, description, location, logo });

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten().fieldErrors });
  }

  try {
    await db.cafe.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        logo: logo?.path,
        location,
      },
    });

    return res.status(200).json({ data: { id } });
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteCafe(req: Request, res: Response) {
  const { id } = req.params;

  try {
    // Delete all employees associated with the cafe
    await db.employee.deleteMany({
      where: {
        cafeId: id,
      },
    });

    await db.cafe.delete({
      where: {
        id,
      },
    });

    return res.status(204).end();
  } catch (error) {
    handleError(error, res);
  }
}

export async function getCafes(req: Request, res: Response) {
  const location = req.query.location;

  const fields = {
    name: true,
    description: true,
    logo: true,
    employees: true,
    location: true,
    id: true,
  };

  // This is to get all cafes if no location is provided
  if (!location) {
    const cafes = await db.cafe.findMany({
      orderBy: {
        employees: {
          _count: "desc",
        },
      },
      select: {
        ...fields,
      },
    });

    const transformedCafes = cafes.map((cafe) => ({
      ...cafe,
      employees: cafe.employees.length,
    }));

    return res.json({ data: transformedCafes });
  }

  // This is to get cafes by location, if location is invalid, it will return an empty array
  const cafes = await db.cafe.findMany({
    where: {
      location: location as string,
    },

    orderBy: {
      employees: {
        _count: "desc",
      },
    },
    select: {
      ...fields,
    },
  });

  const transformedCafes = cafes.map((cafe) => ({
    ...cafe,
    employees: cafe.employees.length,
  }));

  return res.json({ data: transformedCafes });
}

export async function getCafe(req: Request, res: Response) {
  const { id } = req.params;

  const cafe = await db.cafe.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      description: true,
      logo: true,
      employees: true,
      location: true,
      id: true,
    },
  });

  if (!cafe) {
    return res.status(404).json({ error: "Cafe not found" });
  }

  return res.json({ data: cafe });
}

function handleError(error: any, res: Response) {
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(400).json({ error: "An error occurred" });
}
