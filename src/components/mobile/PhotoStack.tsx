import { PhotoCard, type PhotoCardProps } from './PhotoCard';
import styles from './mobile.module.css';
/** One whole group is presented as a single stack, never individual selection. */
export function PhotoStack(props: PhotoCardProps & { count?: number }) {
  const { count, ...photo } = props;
  return <div className={styles.photoStack}><PhotoCard {...photo} />{count !== undefined && <span className={styles.stackCount}>{count} 张 / 一整组</span>}</div>;
}
