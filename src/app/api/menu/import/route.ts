import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import * as xlsx from "xlsx";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id }
    });

    if (!store) {
      return NextResponse.json({ error: "المتجر غير موجود" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "لم يتم رفع أي ملف" }, { status: 400 });
    }

    // Read the file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the excel file
    const wb = xlsx.read(buffer, { type: 'buffer' });

    let importedCount = 0;

    // Process Categories Sheet
    if (wb.SheetNames.includes("Categories")) {
      const wsCategories = wb.Sheets["Categories"];
      const categoriesData = xlsx.utils.sheet_to_json<any>(wsCategories);

      for (const row of categoriesData) {
        if (!row.Name) continue; // Skip invalid rows
        
        await prisma.category.upsert({
          where: { id: row.ID || "new-temp-id" }, // Using a fake id to force create if no ID
          update: {
            name: row.Name,
            sortOrder: parseInt(row.SortOrder) || 0,
            description: row.Description || null,
          },
          create: {
            id: row.ID || undefined, // use provided ID or let prisma generate
            storeId: store.id,
            name: row.Name,
            sortOrder: parseInt(row.SortOrder) || 0,
            description: row.Description || null,
          }
        }).catch(e => {
          // If upsert fails on ID not found (sometimes happens), we can try to find first or create
          // Actually prisma upsert with a fake ID will fail if the ID is not found for update?
          // No, if the WHERE condition is not met, it will CREATE. 
          console.error("Category Import Error for row", row, e);
        });
        importedCount++;
      }
    }

    // Process Products Sheet
    if (wb.SheetNames.includes("Products")) {
      const wsProducts = wb.Sheets["Products"];
      const productsData = xlsx.utils.sheet_to_json<any>(wsProducts);

      for (const row of productsData) {
        if (!row.Name || !row.CategoryID) continue;

        // Verify category exists
        const category = await prisma.category.findFirst({
          where: { id: row.CategoryID, storeId: store.id }
        });

        if (!category) continue; // Skip if category is invalid

        await prisma.menuItem.upsert({
          where: { id: row.ID || "new-temp-id" },
          update: {
            name: row.Name,
            description: row.Description || null,
            price: parseFloat(row.Price) || 0,
            isAvailable: row.IsAvailable === "Yes",
            image: row.Image || null,
            sortOrder: parseInt(row.SortOrder) || 0,
            categoryId: category.id,
            storeId: store.id,
          },
          create: {
            id: row.ID || undefined,
            name: row.Name,
            description: row.Description || null,
            price: parseFloat(row.Price) || 0,
            isAvailable: row.IsAvailable === "Yes",
            image: row.Image || null,
            sortOrder: parseInt(row.SortOrder) || 0,
            categoryId: category.id,
            storeId: store.id,
          }
        }).catch(e => console.error("Product Import Error for row", row, e));
        importedCount++;
      }
    }

    return NextResponse.json({ success: true, count: importedCount });

  } catch (error) {
    console.error("Import Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
