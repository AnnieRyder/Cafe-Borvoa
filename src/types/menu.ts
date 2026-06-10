// src/types/menu.ts
export interface ItemMenu {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: 'bolos' | 'cafes' | 'salgados' | 'bebidas';
  imagem: string; // Vamos usar o link da imagem aqui
}