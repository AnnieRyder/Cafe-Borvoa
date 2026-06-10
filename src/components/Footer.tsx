// src/components/Footer.tsx
import { Heart, Coffee, CheckCircle } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => (
  <footer className={styles.footerContainer}>
    <div className={styles.diferencial}>
      <Heart size={24} />
      <div>
        <h4>Feito com carinho</h4>
        <p>Receitas artesanais e ingredientes selecionados.</p>
      </div>
    </div>
    <div className={styles.diferencial}>
      <Coffee size={24} />
      <div>
        <h4>Ambiente acolhedor</h4>
        <p>Um espaço feito para você relaxar e aproveitar.</p>
      </div>
    </div>
    <div className={styles.diferencial}>
      <CheckCircle size={24} />
      <div>
        <h4>Atendimento rápido</h4>
        <p>Seu pedido preparado com agilidade e cuidado.</p>
      </div>
    </div>
  </footer>
);