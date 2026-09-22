import '../styles/forms.css'

export default function Button({ variant = 'primary', size = 'md', block = false, type = 'button', className = '', ...rest }) {
  const classes = ['btn', `btn-${variant}`, size !== 'md' && `btn-${size}`, block && 'btn-block', className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}
