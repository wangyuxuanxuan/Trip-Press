import styles from './mobile.module.css';
export function Tape({ tone = 'yellow', className = '' }: { tone?: 'yellow' | 'blue'; className?: string }) {
  return <span className={`${styles.tape} ${className}`} data-tone={tone} aria-hidden="true" />;
}
