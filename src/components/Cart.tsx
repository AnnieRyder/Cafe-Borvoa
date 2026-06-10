import { X, ShoppingBag, Lock } from 'lucide-react';
import styles from './Cart.module.css';
import { useCart } from './contexts/CartContext'; 

export const Cart = () => {
  const { carrinho, adicionarAoCarrinho, removerItemDoCarrinho, diminuirQuantidade } = useCart();

  const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const taxa = subtotal * 0.1;
  const total = subtotal + taxa;

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <ShoppingBag size={20} className={styles.headerIcon} />
        <h2 className={styles.cartTitle}>Seu pedido</h2>
      </div>
      
      <div className={styles.itensList}>
        {carrinho.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img src={item.imagem} alt={item.nome} className={styles.miniImg} />
            
            <div className={styles.itemInfo}>
              <h4 className={styles.itemName}>{item.nome}</h4>
              
              <div className={styles.controls}>
                {/* Botão de Menos - AGORA CHAMA diminuirQuantidade */}
                <button 
                  className={styles.controlBtn} 
                  onClick={() => diminuirQuantidade(item.id)} 
                >
                  -
                </button>
                <span className={styles.qtd}>{item.quantidade}</span>
                {/* Botão de Mais */}
                <button 
                  className={styles.controlBtn} 
                  onClick={() => adicionarAoCarrinho(item)} 
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.priceAndRemove}>
              {/* O X remove o item de vez - AQUI SIM É removerItemDoCarrinho */}
              <button onClick={() => removerItemDoCarrinho(item.id)} className={styles.removeBtn}>
                <X size={16} />
              </button>
              <span className={styles.price}>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.resumo}>
        <div className={styles.linha}>
          <span>Subtotal</span> 
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.linha}>
          <span>Taxa de serviço</span> 
          <span>R$ {taxa.toFixed(2)}</span>
        </div>
      </div>
      
      <div className={styles.totalSection}>
        <span>Total</span> 
        <span>R$ {total.toFixed(2)}</span>
      </div>

      <button className={styles.checkoutBtn}>Finalizar pedido ➔</button>
      
      <div className={styles.seguranca}>
        <Lock size={12} />
        <p>Ambiente seguro e protegido</p>
      </div>
    </div>
  );
};