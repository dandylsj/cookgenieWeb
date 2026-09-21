import '../styles/forms.css'

export default function Button({ variant = 'primary', block = false, type = 'button', className = '', ...rest }) {
  const classes = ['btn', `btn-${variant}`, block && 'btn-block', className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}
