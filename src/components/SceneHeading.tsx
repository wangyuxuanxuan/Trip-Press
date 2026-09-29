import styles from './shared.module.css';
export function SceneHeading({ index, title, description }: { index: string; title: string; description: string }) {
  return <div className={styles.heading}><div className={styles.eyebrow}><span className={styles.editionDash} />TRIP PRESS <span>/ {index}</span></div><h1 tabIndex={-1} data-scene-heading>{title}</h1><p>{description}</p></div>;
}
