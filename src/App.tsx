// src/App.tsx
import { useState, useEffect } from 'react';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { HeaderBanner } from './components/HeaderBanner'; 
import { DeliveryInfo } from './components/DeliveryInfo';
import { Footer } from './components/Footer';
import { useCart } from './components/contexts/CartContext';
import './components/responsive.css';
import type { ItemMenu } from './types/menu';
import { motion } from 'framer-motion';
import { menuData } from './utils/menuData';
import { Cake, Coffee, Croissant, CupSoda, BadgePercent, Truck, CheckCircle, ShieldCheck, Star, Plus, LayoutGrid } from 'lucide-react';

// --- COMPONENTES AUXILIARES ---
const ElementoFlutuante = ({ icon: Icon, top, left, delay }: any) => (
  <motion.div
    style={{ position: 'absolute', top, left, zIndex: 0, minWidth: '80px', transform: 'scale(1)', opacity: 0.3 }}
    animate={{ y: [0, -20, 0] }} 
    transition={{ duration: 4, repeat: Infinity, delay }}
  >
    <Icon size={80} color="#a67c52" />
  </motion.div>
);

const CardSkeleton = () => (
  <div className="card-skeleton">
    <div className="skeleton-img" />
    <div className="skeleton-info">
      <div className="skeleton-title" />
      <div className="skeleton-text" />
      <div className="skeleton-footer" />
    </div>
  </div>
);

function App() {
  // 1. ESTADOS
  const [telaAtual, setTelaAtual] = useState<'home' | 'cardapio' | 'sobre' | 'contato'>('home');
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [iniciarSaida, setIniciarSaida] = useState(false);
  const [prontoParaAnimar, setProntoParaAnimar] = useState(false); 
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Todos');
  const [carregando, setCarregando] = useState(true);
  const [produtos, setProdutos] = useState<ItemMenu[]>([]);
  
  // Usando o contexto para a Home (Destaques)
  const { adicionarAoCarrinho } = useCart();

  // 2. CARREGAMENTO DOS DADOS LOCAIS (Substituindo a API)
  useEffect(() => {
    // Simulando um tempo de rede de 1 segundo para mostrar a animação de carregamento
  const timer = setTimeout(() => {
      // Adicionamos "as ItemMenu[]" para garantir o tipo correto
      setProdutos(menuData.produtos as ItemMenu[]); 
      setCarregando(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 3. EFEITOS (useEffect)
  useEffect(() => {
    const timerSaida = setTimeout(() => setIniciarSaida(true), 1500);
    const timerRemover = setTimeout(() => {
      setMostrarSplash(false);
      setProntoParaAnimar(true); // Libera animações depois que a splash sai
    }, 2000);
    return () => {
      clearTimeout(timerSaida);
      clearTimeout(timerRemover);
    };
  }, []);

  useEffect(() => {
    const titulos: Record<string, string> = {
      'home': 'Início',
      'cardapio': 'Nosso Cardápio',
      'sobre': 'Sobre Nós',
      'contato': 'Contato'
    };
    document.title = `Café Borvoa | ${titulos[telaAtual]}`;
  }, [telaAtual]);

  // 4. VARIANTES DE ANIMAÇÃO
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // 5. RENDERIZAÇÃO DA PÁGINA
  return (
    <>
      <div className="app-container" style={{ position: 'relative' }}> 
        <ElementoFlutuante icon={Coffee} top="5%" left="-30%" delay={0} />
        <ElementoFlutuante icon={Croissant} top="18%" left="120%" delay={1} />
        <ElementoFlutuante icon={Croissant} top="40%" left="-20%" delay={2} />
        <ElementoFlutuante icon={Coffee} top="58%" left="120%" delay={1} />
      
        {mostrarSplash && (
          <div className={`splash-screen ${iniciarSaida ? 'splash-fade-out' : ''}`}>
            <div className="splash-content">
              <Coffee size={60} />
              <h1>Café Borvoa</h1>
            </div>
          </div>
        )}

        <div className="content-wrapper"> 
          <motion.div
            key={telaAtual}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <HeaderBanner  
              telaAtual={telaAtual} 
              mudarTela={setTelaAtual} 
              carrinhoAberto={carrinhoAberto}
              setCarrinhoAberto={setCarrinhoAberto}
            />

            {/* --- HOME --- */}
            {telaAtual === 'home' && (
              <div className="home-vitrine">
                
                {/* 1. Categorias */}
                <div className="categorias-bar">
                  {['Todos', 'Cafés', 'Bolos', 'Salgados', 'Bebidas', 'Combos'].map((cat) => (
                    <button 
                      key={cat}
                      className={`categoria-btn ${categoriaAtiva === cat ? 'ativo' : ''}`}
                      onClick={() => {
                        if (cat === 'Combos') {
                          alert("Combos estarão disponíveis em breve!");
                        } else {
                          setCategoriaAtiva(cat);
                        }
                      }}
                    >
                      {cat === 'Todos' && <LayoutGrid size={30}/>}
                      {cat === 'Cafés' && <Coffee size={30}/>}
                      {cat === 'Bolos' && <Cake size={30}/>}
                      {cat === 'Salgados' && <Croissant size={30}/>}
                      {cat === 'Bebidas' && <CupSoda size={30}/>}
                      {cat === 'Combos' && <BadgePercent size={30}/>}
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 2. Mais Pedidos da Semana */}
                <section className="secao-vitrine">
                  <div className="secao-header">
                    <h2>Mais pedidos da semana</h2>
                    <button className="btn-text" onClick={() => setTelaAtual('cardapio')}>
                      Ver todos ➔
                    </button>
                  </div>
                  
                  <div className="grid-destaques">
                    {carregando ? (
                      Array(3).fill(0).map((_, i) => <CardSkeleton key={`skeleton-${i}`} />)
                    ) : (
                      produtos.slice(0, 3).map((item) => (
                        <div key={item.id} className="card-grande">
                          <div className="img-container">
                            <span className="badge-nota"><Star size={12} fill="#eab308" color="#eab308"/> 4.9</span>
                            <img src={item.imagem} alt={item.nome} />
                          </div>
                          <div className="card-info">
                            <h4>{item.nome}</h4>
                            <p>{item.descricao}</p>
                            <div className="card-footer">
                              <span className="preco">R$ {item.preco.toFixed(2)}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="btn-add-circle"
                                onClick={() => adicionarAoCarrinho(item)}
                              >
                                <Plus size={18} />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* 3. Nosso Cardápio */}
                <section className="secao-vitrine">
                  <div className="secao-header">
                    <h2>Nosso Cardápio</h2>
                    <button className="btn-text" onClick={() => setTelaAtual('cardapio')}>
                      Ver cardápio completo ➔
                    </button>
                  </div>

                  <div className="grid-horizontal cardapio-home-celular">
                    {produtos.filter(item => {
                      if (categoriaAtiva === 'Todos') return true;
                      const normalizar = (texto: string) => 
                        texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      return normalizar(item.categoria) === normalizar(categoriaAtiva);
                    }).map((item) => (
                      <div key={`mini-${item.id}`} className="card-mini">
                        <img src={item.imagem} alt={item.nome} />
                        <div className="mini-info">
                          <h4>{item.nome}</h4>
                          <p>{item.descricao}</p>
                          <span className="preco">R$ {item.preco.toFixed(2)}</span>
                        </div>
                        <button 
                          className="btn-add-circle"
                          onClick={() => adicionarAoCarrinho(item)}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. Banner de Vantagens (Com atraso condicionado a prontoParaAnimar) */}
                {prontoParaAnimar && (
                  <motion.div
                    className="banner-vantagens"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    {[
                      { icon: Coffee, title: "Grãos selecionados", text: "Qualidade premium em cada xícara." },
                      { icon: Truck, title: "Entrega rápida", text: "Receba seu pedido com agilidade." },
                      { icon: CheckCircle, title: "Feito com carinho", text: "Receitas artesanais feitas na hora." },
                      { icon: ShieldCheck, title: "Pagamento seguro", text: "Seus dados sempre protegidos." }
                    ].map((item, index) => (
                      <motion.div key={index} className="vantagem-item" variants={itemVariants}>
                        <item.icon className="vantagem-icon" size={32} />
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

              </div> 
            )}
            {/* --- FIM DA HOME --- */}

            {/* --- TELAS SECUNDÁRIAS --- */}
            {telaAtual === 'cardapio' && (
              <div className="main-container">
                <Menu produtos={produtos} />
                <div className="coluna-carrinho">
                  <Cart />
                  <DeliveryInfo />
                </div>
              </div>
            )}

            {telaAtual === 'sobre' && (
              <div className="secao-container-sobre">
                <div className="conteudo-sobre">
                  <div className="texto-sobre">
                    <h2>Conectando Tecnologia e Café</h2>
                    <p>O <strong>Café Borvoa</strong> nasceu como um desafio criativo. Mais do que um simples cardápio digital, este projeto é uma vitrine das minhas habilidades como desenvolvedor em constante evolução.</p>
                    <p>Acredito que a tecnologia deve ser intuitiva, funcional e, acima de tudo, elegante. Desenvolvi cada detalhe desta plataforma para unir minha paixão pela programação com a arte de servir um bom café.</p>
                    <div className="call-to-action-sobre" style={{ marginTop: '30px', padding: '20px', borderLeft: '4px solid #a67c52', backgroundColor: '#fdf6f0' }}>
                      <h4 style={{ color: '#a67c52', marginBottom: '10px' }}>Gostou do que viu?</h4>
                      <p style={{ margin: 0 }}>Este projeto é um reflexo do que posso criar. Se você está buscando um desenvolvedor dedicado, apaixonado por desafios ou quer bater um papo sobre código, <strong>vamos nos conectar!</strong></p>
                      <p style={{ marginTop: '10px' }}>📧 <strong>rayaneic7@gmail.com</strong></p>
                    </div>
                  </div>
                  <div className="imagem-sobre">
                    <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" alt="Sobre o Café" />    
                  </div>
                </div>
              </div>
            )}

            {telaAtual === 'contato' && (
              <div className="secao-container-contato">
                <div className="contato-grid">
                  <div className="info-contato">
                    <h3>Vamos conversar?</h3>
                    <p>Estou sempre aberto a novas oportunidades, trocas de conhecimento ou apenas um bom papo sobre tecnologia.</p>
                    <div className="lista-contato">
                      <div className="item-contato"><strong>Email:</strong><p>rayaneic7@gmail.com</p></div>
                      <div className="item-contato"><strong>LinkedIn:</strong><p>https://www.linkedin.com/in/rayaneic7/</p></div>
                      <div className="item-contato"><strong>GitHub:</strong><p>https://github.com/AnnieRyder</p></div>
                    </div>
                  </div>
                  <div className="form-contato">
                    <form action="https://formspree.io/f/mlgknrny" method="POST" className="form-contato">
                      <h3>Envie uma mensagem</h3>
                      <input type="text" name="nome" placeholder="Seu nome" required />
                      <input type="email" name="email" placeholder="Seu melhor e-mail" required />
                      <textarea name="mensagem" placeholder="Como posso te ajudar?" rows={4} required></textarea>
                      <button type="submit" className="btn-enviar">Enviar mensagem</button>
                    </form>
                  </div>
                </div>
              </div>
            )}
            
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default App;