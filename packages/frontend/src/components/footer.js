import styles from '../styles/footer.module.css';
import React, { useEffect } from 'react';

export default function Footer() {
  return (
    // <footer className={`${styles.footer} visible`}>Copyright © Rocketship 2023</footer>
    // <footer>Copyright © Rocketship 2023</footer>

    <div className={styles.pageContainer}>
      <footer className={styles.footer}>Copyright © Rocketship 2023</footer>
    </div>
  );
}
