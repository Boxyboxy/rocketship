import Link from "next/link";
import styles from "../styles/category.module.css";

export default function Category() {
  return (
    <div className={styles.categoryHead}>
      <ul className={styles.categoryUL}>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/projects">
            All
          </Link>
          <p className={styles.dash}>|</p>
        </li>

        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/fintech">
            Fintech
          </Link>
          <p className={styles.dash}>|</p>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/healthtech">
            Health Tech
          </Link>
          <p className={styles.dash}>|</p>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/fnb">
            F&B
          </Link>
          <p className={styles.dash}>|</p>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/socialmedia">
            Social media
          </Link>
          <p className={styles.dash}>|</p>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/games">
            Games
          </Link>
          <p className={styles.dash}>|</p>
        </li>
        <li className={styles.categoryLI}>
          <Link className={styles.linkName} href="/agritech">
            Agritech
          </Link>
        </li>
      </ul>
    </div>
  );
}
