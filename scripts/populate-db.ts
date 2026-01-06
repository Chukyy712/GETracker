import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ApiItem {
  id: number;
  name: string;
  examine?: string;
  members?: boolean;
  limit?: number;
  value?: number;
  lowalch?: number;
  highalch?: number;
  icon?: string;
}

async function main() {
  console.log("Fetching item mapping from OSRS Wiki API...");
  const response = await fetch(
    "https://prices.runescape.wiki/api/v1/osrs/mapping"
  );
  if (!response.ok) {
    console.error("Failed to fetch item mapping.");
    return;
  }

  const items: ApiItem[] = await response.json();
  console.log(`Fetched ${items.length} items. Populating database...`);

  let count = 0;
  for (const item of items) {
    // Skip items without a name or icon, as they are likely not real items
    if (!item.name || !item.icon) {
      continue;
    }

    await prisma.item.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        examine: item.examine,
        members: item.members === true, // Ensure boolean
        limit: item.limit,
        value: item.value,
        lowalch: item.lowalch,
        highalch: item.highalch,
        icon: item.icon,
      },
      create: {
        id: item.id,
        name: item.name,
        examine: item.examine,
        members: item.members === true, // Ensure boolean
        limit: item.limit,
        value: item.value ?? 0, // Default to 0 if null/undefined
        lowalch: item.lowalch,
        highalch: item.highalch,
        icon: item.icon,
      },
    });
    count++;
    if (count % 1000 === 0) {
      console.log(`Processed ${count} of ${items.length} items...`);
    }
  }

  console.log(`Database populated with ${count} items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
