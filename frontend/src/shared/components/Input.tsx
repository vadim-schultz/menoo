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

  // Pico CSS uses native input styling, add error class if needed
  const inputClasses = error ? ['[aria-invalid="true"]', className] : [className];
  const inputClassString = inputClasses.filter(Boolean).join(' ');

  return (
    <div>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span style={{ color: 'var(--pico-del-color, #c62828)' }}> *</span>}
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
        className={inputClassString || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <small id={`${name}-error`} style={{ color: 'var(--pico-del-color, #c62828)' }}>
          {error}
        </small>
      )}
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

  // Pico CSS uses native textarea styling
  const textareaClasses = error ? ['[aria-invalid="true"]', className] : [className];
  const textareaClassString = textareaClasses.filter(Boolean).join(' ');

  return (
    <div>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span style={{ color: 'var(--pico-del-color, #c62828)' }}> *</span>}
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
        className={textareaClassString || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <small id={`${name}-error`} style={{ color: 'var(--pico-del-color, #c62828)' }}>
          {error}
        </small>
      )}
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

  // Pico CSS uses native select styling
  const selectClasses = error ? ['[aria-invalid="true"]', className] : [className];
  const selectClassString = selectClasses.filter(Boolean).join(' ');

  return (
    <div>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span style={{ color: 'var(--pico-del-color, #c62828)' }}> *</span>}
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
        className={selectClassString || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <small id={`${name}-error`} style={{ color: 'var(--pico-del-color, #c62828)' }}>
          {error}
        </small>
      )}
    </div>
  );
}
