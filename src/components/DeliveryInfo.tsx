// src/components/DeliveryInfo.tsx
import { Coffee } from 'lucide-react';
import styles from './DeliveryInfo.module.css';

export const DeliveryInfo = () => (
  <div className={styles.container}>
    <div className={styles.iconBox}>
      <Coffee size={24} />
    </div>
    <div className={styles.textos}>
      <h4>Entrega ou Retirada</h4>
      <p>Você escolhe! Entregamos para você ou retire em nossa loja.</p>
      <a href="#" className={styles.link}>Saiba mais →</a>
    </div>
  </div>
);