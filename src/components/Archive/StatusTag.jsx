import styles from './StatusTag.module.css'

const STATUS_CONFIG = {
  resolved:  { icon: '●', label: 'Resolved' },
  contested: { icon: '◐', label: 'Contested' },
  landmark:  { icon: '◆', label: 'Landmark' },
  pending:   { icon: '○', label: 'Pending' },
  sealed:    { icon: '◈', label: 'Sealed' },
}

export default function StatusTag({ status }) {
  const { icon, label } = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  return (
    <span className={`${styles.tag} ${styles[status]}`}>
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  )
}
