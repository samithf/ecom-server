const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const cafes = [
    {
      name: "Cafe Mocha",
      description: "A cozy place with great coffee and snacks.",
      location: "123 Coffee St, Coffeeville",
    },
    {
      name: "Java House",
      description: "The best place for Java lovers.",
      location: "456 Java Rd, Javaville",
    },
    {
      name: "Espresso Bar",
      description: "Your daily dose of espresso and more.",
      location: "789 Espresso Ave, Expressotown",
    },
    {
      name: "Brewed Awakenings",
      description: "Awaken your senses with our freshly brewed coffee.",
      location: "321 Brew Blvd, Brewcity",
    },
    {
      name: "Caffeine Fix",
      description: "Fix your caffeine cravings here.",
      location: "654 Caffeine Ln, Caffeinetown",
    },
  ];

  for (const cafe of cafes) {
    await prisma.cafe.create({
      data: cafe,
    });
  }

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
