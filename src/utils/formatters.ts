// Você pode criar uma função utilitária para gerar links do Unsplash
// src/utils/formatters.ts (ou onde você criou)
export const getUnsplashUrl = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=400&auto=format&fit=crop`;

// E no seu array ficaria muito mais limpo:
imagem: getUnsplashUrl("1578985545062-69928b1d9587")