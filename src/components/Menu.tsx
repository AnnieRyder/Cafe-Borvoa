import { useState } from 'react';
import { Plus, LayoutGrid, Cake, Coffee, Croissant, CupSoda, Heart } from 'lucide-react';
import styles from './Menu.module.css';
import { useCart } from './contexts/CartContext';
import './responsive.css';
import type { ItemMenu } from '../types/menu';

// 2. Criamos um array de objetos para representar cada filtro
const categorias = [
  { id: 'todos', nome: 'Todos', icon: LayoutGrid },
  { id: 'bolos', nome: 'Bolos', icon: Cake },
  { id: 'cafes', nome: 'Cafés', icon: Coffee },
  { id: 'salgados', nome: 'Salgados', icon: Croissant },
  { id: 'bebidas', nome: 'Bebidas', icon: CupSoda },
];

interface MenuProps {
  produtos: ItemMenu[];
  // Removido o onAdicionar daqui, pois ele vem do useCart agora!
}

export const Menu = ({ produtos }: MenuProps) => {
  const { adicionarAoCarrinho } = useCart();
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  const produtosFiltrados = filtroAtivo === 'todos' 
    ? produtos 
    : produtos.filter(p => p.categoria === filtroAtivo);

  return (
    <main className={styles.menuBox}>
      <div className={styles.filterBar}>
        {categorias.map((cat) => {
          const Icon = cat.icon;
          const ehAtivo = filtroAtivo === cat.id;
          
          return (
            <button 
              key={cat.id} 
              className={`${styles.filterBtn} ${ehAtivo ? styles.active : ''}`}
              onClick={() => setFiltroAtivo(cat.id)}
            >
              <Icon size={18} />
              {cat.nome}
            </button>
          );
        })}
      </div>

 <div id="cardapio-vertical" className={`${styles.gridProdutos} lista-vertical`}>
  {produtosFiltrados.map((item) => (
    <div key={item.id} className={`${styles.cardProduto} card-vertical`}>
      <img src={item.imagem} alt={item.nome} className={styles.imgProduto} />
      
      <div className={styles.conteudoCard}>
        <div className={styles.infoProduto}>
          <h3>{item.nome}</h3>
          <p className="descricao-para-esconder">{item.descricao}</p> {/* Adicionamos esta classe aqui */}
        </div>
        
        <div className={styles.precoEBotao}>
          <span className={styles.preco}>R$ {item.preco.toFixed(2)}</span>
          <button onClick={() => adicionarAoCarrinho(item)} className={styles.addBtn}>
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* RODAPÉ CARINHOSO */}
      <footer className={styles.footerMenu}>
        <p> <Heart size={16} className={styles.iconHeart} /> 
    Todos os produtos são feitos com ingredientes selecionados e muito carinho.
  </p>
      </footer>
    </main>
  );
};