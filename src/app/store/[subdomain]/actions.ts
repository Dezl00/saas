"use server";

import { prisma } from "@/lib/prisma";

export async function placeOrderAction(formData: FormData) {
  try {
    const storeId = formData.get("storeId") as string;
    const deliveryType = formData.get("deliveryType") as "DELIVERY" | "PICKUP";
    const selectedArea = formData.get("selectedArea") as string;
    const selectedBranch = formData.get("selectedBranch") as string;
    
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerAddress = formData.get("customerAddress") as string;
    const notes = formData.get("notes") as string;
    
    const cartItemsStr = formData.get("cartItems") as string;
    const items = JSON.parse(cartItemsStr);

    const subtotal = Number(formData.get("subtotal"));
    const deliveryFee = Number(formData.get("deliveryFee"));
    const total = Number(formData.get("total"));

    if (!storeId || !customerName || !customerPhone || !items.length) {
      return { error: "بيانات غير مكتملة" };
    }

    // Generate a simple sequential order number
    const lastOrder = await prisma.order.findFirst({
      where: { storeId },
      orderBy: { orderNumber: 'desc' }
    });
    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1000;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        storeId,
        customerName,
        customerPhone,
        customerAddress: deliveryType === "DELIVERY" ? customerAddress : null,
        notes,
        deliveryType,
        deliveryAreaId: deliveryType === "DELIVERY" && selectedArea ? selectedArea : null,
        branchId: deliveryType === "PICKUP" && selectedBranch ? selectedBranch : null,
        subtotal,
        deliveryFee,
        total,
        status: "PENDING",
        paymentMethod: "CASH",
        items: {
          create: items.map((item: any) => {
            // Note: In a real app, you should verify prices from the database here to prevent tampering.
            return {
              menuItemId: item.id.split('-')[0], // Extract actual product ID if we used composite ID in cart
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            };
          })
        }
      }
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Place Order Error:", error);
    return { error: "حدث خطأ غير متوقع أثناء معالجة الطلب" };
  }
}
