import React from 'react';

export function CardPDVSelect({
  label,
  placeholder = 'Selecione',
  options = [],
  optionLabel = (option) => option.text ?? option.value,
  selectProps,
}) {
  const { onChange: onSelectChangeProp, value: selectValueProp, defaultValue, ...restSelectProps } =
    selectProps || {};
  const isControlled = selectValueProp !== undefined;

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const selectValue = isControlled ? selectValueProp : internalValue;

  const handleSelectChange = (event) => {
    if (!isControlled) setInternalValue(event.target.value);
    if (onSelectChangeProp) onSelectChangeProp(event);
  };

  const selectClassName = [
    'form-select',
    'card-pdv-select',
    selectValue ? 'card-pdv-select--value' : 'card-pdv-select--placeholder',
    restSelectProps.className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className='card-pdv-form text-start'>
      {label && (
        <label className='card-pdv-label form-label mb-2'>
          {label}
        </label>
      )}

      <select
        {...restSelectProps}
        value={selectValue}
        onChange={handleSelectChange}
        className={selectClassName}
      >
        <option value='' disabled hidden>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CardPDVInput({
    label,
    placeholder = '',
    prefix,
    inputProps,
  }) {
    const { className, ...restInputProps } = inputProps || {};
  
    const inputClassName = ['card-pdv-input', className]
      .filter(Boolean)
      .join(' ');
  
    return (
      <div className='card-pdv-form text-start'>
        {label && (
          <label className='card-pdv-label form-label mb-2'>
            {label}
          </label>
        )}
  
        <div className='card-pdv-input-wrapper'>
          {prefix && <span className='card-pdv-input-prefix'>{prefix}</span>}
          <input
            type='text'
            placeholder={placeholder}
            className={inputClassName}
            {...restInputProps}
          />
        </div>
      </div>
    );
  }

function CardPDV({
  icone,
  titulo,
  subtitulo,
  label,
  selectOptions = [],
  selectPlaceholder = 'Selecione o funcionário',
  selectOptionLabel = (option) => option.text ?? option.value,
  selectProps,
  children,
}) {
  return (
    <div className='card card-pdv text-center'>
      <div className='card-body card-pdv-body d-flex flex-column align-items-center justify-content-center'>
        {icone && (
          <div className='card-pdv-icon mb-3'>
            <img src={icone} alt='' width='24' height='24' />
          </div>
        )}

        <h3 className='card-pdv-title mb-1'>{titulo}</h3>

        {subtitulo && (
          <p className='card-pdv-subtitle mb-0'>{subtitulo}</p>
        )}

        {(label || selectOptions.length > 0) && (
          <CardPDVSelect
            label={label}
            placeholder={selectPlaceholder}
            options={selectOptions}
            optionLabel={selectOptionLabel}
            selectProps={selectProps}
          />
        )}

        {children}
      </div>
    </div>
  );
}

export default CardPDV;