import axiosInstance from "./axiosinstance";

export const addToCart = async (product: any, quantity: number = 1, size: string = "", customization: { name: string, number: string } | null = null) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
        // Authenticated: Use API
        try {
            await axiosInstance.post("/api/users/cart/add", {
                productId: product._id,
                quantity,
                size,
                customization
            });
            return { success: true, message: "Added to cart!" };
        } catch (error: any) {
            console.error("Add to cart API error:", error);
            return {
                success: false,
                message: error.response?.data?.msg || "Failed to add to cart"
            };
        }
    } else {
        // Guest: Use LocalStorage
        try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            // Find item by ID AND Size AND Customization
            const existingItem = cart.find((item: any) =>
                item.productId === product._id &&
                item.size === size &&
                (item.customization?.name === customization?.name && item.customization?.number === customization?.number)
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                let mainImage = "/placeholder.png";
                if (Array.isArray(product.images) && product.images.length > 0) {
                    mainImage = product.images[0];
                } else if (typeof product.image === 'string') {
                    mainImage = product.image;
                }

                cart.push({
                    productId: product._id,
                    title: product.title || product.name,
                    price: product.price,
                    quantity,
                    size,
                    customization,
                    image: mainImage
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            return { success: true, message: "Added to local cart!" };
        } catch (error) {
            console.error("Local cart error:", error);
            return { success: false, message: "Failed to add to local cart" };
        }
    }
};
