// src/components/HeaderBanner.tsx
import { useEffect, useState } from 'react';
import { ShoppingCart, Coffee, ArrowRight, X, Menu } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './HeaderBanner.module.css';
import { useCart } from './contexts/CartContext';

interface HeaderBannerProps {
  telaAtual: 'home' | 'cardapio' | 'sobre' | 'contato';
  mudarTela: (tela: 'home' | 'cardapio' | 'sobre' | 'contato') => void;
  carrinhoAberto: boolean;
  setCarrinhoAberto: (aberto: boolean) => void;
}

export const HeaderBanner = ({ 
  telaAtual, 
  mudarTela,
  carrinhoAberto,
  setCarrinhoAberto
}: HeaderBannerProps) => {

  const { carrinho, totalItens } = useCart();
  const valorTotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const ehPaginaInterna = telaAtual !== 'home';

  // NOVO: Estado para abrir/fechar o menu suspenso do celular
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setCarrinhoAberto(false);
    setMenuAberto(false); // Fecha o menu automaticamente quando mudar de tela
  }, [telaAtual, setCarrinhoAberto]);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  // Função auxiliar para mudar a tela limpando estados abertos
  const navegarPara = (tela: 'home' | 'cardapio' | 'sobre' | 'contato') => {
    mudarTela(tela);
    setMenuAberto(false);
  };

  return (
    <div 
      className={ehPaginaInterna ? styles.headerCompacto : styles.heroContainer}
      style={{ position: 'relative' }} 
    >
      
      {/* CAMADA 0: Fundo com Parallax */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        <motion.div 
          style={{ 
            y, 
            position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%',
            backgroundSize: 'cover', backgroundPosition: 'center',
            backgroundImage: `linear-gradient(rgba(15, 10, 8, 0.7), rgba(15, 10, 8, 0.9)), url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop')` 
          }} 
        />
      </div>

      {/* CAMADA 1: Layout */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        <nav className={ehPaginaInterna ? styles.navCardapio : styles.navbar}>
          {/* ALTERADO: Clique na logo redireciona para a Home */}
          <div 
            className={`${styles.logo} logo-mobile`} 
            onClick={() => navegarPara('home')} 
            style={{ cursor: 'pointer' }}
          >
            <Coffee className={styles.logoIcon} size={28} />
            <span>Café Borvoa</span>
          </div>

          <div className={styles.navRight}>
            
            <div className={`${styles.navLinks} menu-desktop`}>
              <a href="#" className={telaAtual === 'home' ? styles.active : ''} onClick={(e) => { e.preventDefault(); navegarPara('home'); }}>Início</a>
              <a href="#" className={telaAtual === 'cardapio' ? styles.active : ''} onClick={(e) => { e.preventDefault(); navegarPara('cardapio'); }}>Cardápio</a>
              <a href="#" className={telaAtual === 'sobre' ? styles.active : ''} onClick={(e) => { e.preventDefault(); navegarPara('sobre'); }}>Sobre Nós</a>
              <a href="#" className={telaAtual === 'contato' ? styles.active : ''} onClick={(e) => { e.preventDefault(); navegarPara('contato'); }}>Contato</a>
            </div>

            <div className={styles.cartContainer}>
              <button 
                className={styles.cartBtnTop} 
                onClick={() => {
                  if (telaAtual === 'cardapio') {
                    document.querySelector('.coluna-carrinho')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setCarrinhoAberto(!carrinhoAberto);
                  }
                }}
              >
                <ShoppingCart size={18} />
                {totalItens > 0 && <span className={styles.badge}>{totalItens}</span>}
              </button>
              
              {/* MODIFICADO: Botão hambúrguer dinâmico */}
              <button 
                className="menu-hamburguer-btn" 
                onClick={() => setMenuAberto(!menuAberto)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '15px' }}
              >
                {menuAberto ? <X size={24} /> : <Menu size={24} />}
              </button>

              {carrinhoAberto && telaAtual !== 'cardapio' && (
                <div 
                  className={styles.miniCartDropdown} 
                  style={{ 
                    position: 'absolute', top: '120%', right: 0, zIndex: 99999 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>Seu Pedido</h4>
                    <X size={18} style={{ cursor: 'pointer', color: '#888' }} onClick={() => setCarrinhoAberto(false)} />
                  </div>

                  {carrinho.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Sua sacola está vazia.</p>
                  ) : (
                    <>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {carrinho.map((item, index) => (
                          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#333' }}>
                            <span>{item.quantidade}x {item.nome}</span>
                            <strong>R$ {(item.preco * item.quantidade).toFixed(2)}</strong>
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', color: '#333' }}>
                        <strong>Total:</strong>
                        <strong style={{ color: '#a67c52' }}>R$ {valorTotal.toFixed(2)}</strong>
                      </div>

                      <button 
                        style={{ width: '100%', marginTop: '15px', padding: '12px', backgroundColor: '#a67c52', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => alert('Em breve: Redirecionar para o pagamento!')}
                      >
                        Finalizar Compra
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* MODIFICADO: Lista suspensa de opções do menu mobile */}
        {menuAberto && (
          <div className="dropdown-menu-mobile">
            <button className={telaAtual === 'home' ? 'item-ativo-mobile' : ''} onClick={() => navegarPara('home')}>Início</button>
            <button className={telaAtual === 'cardapio' ? 'item-ativo-mobile' : ''} onClick={() => navegarPara('cardapio')}>Cardápio</button>
            <button className={telaAtual === 'sobre' ? 'item-ativo-mobile' : ''} onClick={() => navegarPara('sobre')}>Sobre Nós</button>
            <button className={telaAtual === 'contato' ? 'item-ativo-mobile' : ''} onClick={() => navegarPara('contato')}>Contato</button>
          </div>
        )}

        {ehPaginaInterna && !menuAberto && (
          <div style={{ textAlign: 'center', color: 'white', marginTop: 'auto', marginBottom: 'auto' }}>
            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>
              {telaAtual === 'cardapio' ? 'Nosso Cardápio' : 
               telaAtual === 'sobre' ? 'Sobre Nós' : 'Contato'}
            </h1>
          </div>
        )}

        {telaAtual === 'home' && !menuAberto && (
          <div className={`${styles.heroContent} hero-content-mobile`}>
            <p className={styles.welcomeText}>Bem-vindo ao</p>
            <h1 className={styles.mainTitle}>Café Borvoa</h1>
            <p className={styles.subtitle}>Sabores que acolhem, momentos que ficam.</p>
            
            <button 
              className={styles.ctaButton}
              onClick={() => navegarPara('cardapio')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Ver cardápio
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};