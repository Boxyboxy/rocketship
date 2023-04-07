import styles from '../styles/footer.module.css';
import React, { useEffect } from 'react';

export default function Footer() {
  useEffect(() => {
    // Add a scroll event listener to the window object
    window.addEventListener('scroll', handleScroll);
    return () => {
      // Remove the event listener when the component is unmounted
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function handleScroll() {
    var footer = document.querySelector(`.${styles.footer_footer__E_Uzl}`);
    var top = window.scrollY;
    if (footer !== null) {
      if (top > 100) {
        footer.classList.add('visible');
        console.log('see footer');
        console.log(footer);
      } else {
        footer.classList.remove('visible');
        console.log('cannot see footer');
      }
    }
  }

  return (
    <footer className={`${styles.footer} visible`}>Copyright © Rocketship 2023</footer>
    // <footer>Copyright © Rocketship 2023</footer>
  );
}
