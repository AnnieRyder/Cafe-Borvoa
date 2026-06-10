import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ItemMenu } from '../../types/menu';

interface CartContextType {
  carrinho: (ItemMenu & { quantidade: number })[];
  adicionarAoCarrinho: (produto: ItemMenu) => void;
  removerItemDoCarrinho: (id: number) => void;
  diminuirQuantidade: (id: number) => void; // <-- NOVO: Adicionado aqui!
  totalItens: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

// 2. Criamos o Provedor (quem vai envolver sua aplicação)
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrinho, setCarrinho] = useState<(ItemMenu & { quantidade: number })[]>(() => {
    const salvo = localStorage.getItem('carrinhoBorvoa');
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrinhoBorvoa', JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = (produto: ItemMenu) => {
    setCarrinho((carrinhoAtual) => {
      const itemJaExiste = carrinhoAtual.find(item => item.id === produto.id);
      return itemJaExiste 
        ? carrinhoAtual.map(item => item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item)
        : [...carrinhoAtual, { ...produto, quantidade: 1 }];
    });
  };

  // <-- NOVO: Função que o botão de MENOS (-) vai usar
  const diminuirQuantidade = (id: number) => {
  setCarrinho((carrinhoAtual) => 
    carrinhoAtual.reduce((acc, item) => {
      // Se for o item que queremos diminuir
      if (item.id === id) {
        // Se a quantidade for 1, nós simplesmente não o adicionamos ao novo array (removemos)
        if (item.quantidade === 1) {
          return acc;
        }
        // Caso contrário, apenas reduzimos a quantidade
        return [...acc, { ...item, quantidade: item.quantidade - 1 }];
      }
      // Se não for o item que estamos mexendo, mantemos como está
      return [...acc, item];
    }, [] as (ItemMenu & { quantidade: number })[])
  );
};

  const removerItemDoCarrinho = (id: number) => {
    setCarrinho((carrinhoAtual) => 
      carrinhoAtual.filter((item) => item.id !== id) // Isso remove o item todo!
    );
  };

  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider value={{ 
      carrinho, 
      adicionarAoCarrinho, 
      removerItemDoCarrinho, 
      diminuirQuantidade, // <-- NOVO: Exportado aqui!
      totalItens 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Hook customizado para facilitar o uso
export const useCart = () => useContext(CartContext);