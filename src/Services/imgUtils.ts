const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || "http://localhost:5001";

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "https://placehold.co/400x400?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;

  // Ensure leading slash for local paths
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${path}`;
};
