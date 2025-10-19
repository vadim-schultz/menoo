interface InputProps {
  type?: string;
  name: string;
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Input({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  className = '',
}: InputProps) {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onChange(target.value);
  };

  const classes = ['input', error && 'input--error', className].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={name} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onInput={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={classes}
      />
      {error && <span className="input__error">{error}</span>}
    </div>
  );
}

interface TextareaProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function Textarea({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
}: TextareaProps) {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    onChange(target.value);
  };

  const classes = ['textarea', error && 'textarea--error', className].filter(Boolean).join(' ');

  return (
    <div className="textarea-wrapper">
      {label && (
        <label htmlFor={name} className="textarea__label">
          {label}
          {required && <span className="textarea__required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onInput={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={classes}
      />
      {error && <span className="textarea__error">{error}</span>}
    </div>
  );
}

interface SelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: { value: string; label: string }[];
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function Select({
  name,
  value,
  onChange,
  onBlur,
  options,
  label,
  error,
  required = false,
  disabled = false,
  placeholder,
  className = '',
}: SelectProps) {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    onChange(target.value);
  };

  const classes = ['select', error && 'select--error', className].filter(Boolean).join(' ');

  return (
    <div className="select-wrapper">
      {label && (
        <label htmlFor={name} className="select__label">
          {label}
          {required && <span className="select__required">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        className={classes}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select__error">{error}</span>}
    </div>
  );
}
