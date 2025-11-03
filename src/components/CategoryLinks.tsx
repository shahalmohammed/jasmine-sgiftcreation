export const handleCategoryClick = (category: string) => {
    const keywords = category.trim();
    window.location.href = `/products?search=${encodeURIComponent(keywords)}`;
};