import * as React from 'react';

import './Inputs.scss';

type IProps = {
  label?: string;
  value?: string;
  onChange?: (text: string) => void;
};
export const TextInputStyled: React.FC<IProps> = ({
  label,
  value,
  onChange,
}) => {
  const onChangeText = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange]
  );
  return (
    <div className="text-input">
      <div className="label">{label}</div>
      <input
        type="text"
        className="input"
        onChange={onChangeText}
        value={value}
      />
    </div>
  );
};

type SProps = {
  label?: string;
  value?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  onChange?: (value: boolean) => void;
};
export const SwitchStyled: React.FC<SProps> = ({
  label,
  value,
  trueLabel,
  falseLabel,
  onChange,
}) => {
  const setTrue = React.useCallback(
    () => onChange && onChange(true),
    [onChange]
  );
  const setFalse = React.useCallback(
    () => onChange && onChange(false),
    [onChange]
  );
  return (
    <div className="switch-input">
      <div className="label">{label}</div>
      <div className="buttons">
        <button
          type="button"
          onClick={setTrue}
          className={`button buttonLeft ${
            value ? 'buttonActive' : 'buttonInactive'
          }`}
        >
          <div>{trueLabel}</div>
        </button>
        <button
          type="button"
          className={`button buttonRight ${
            value ? 'buttonInactive' : 'buttonActive'
          }`}
          onClick={setFalse}
        >
          <div>{falseLabel}</div>
        </button>
      </div>
    </div>
  );
};

type CProps = {
  value?: boolean;
  onChange?: (value: boolean) => void;
};
export const CheckBox: React.FC<CProps> = ({ value = false, onChange }) => {
  const onChangeValue = React.useCallback(
    (e: React.ChangeEvent) => {
      e.stopPropagation();
      if (onChange) {
        onChange(!value);
      }
    },
    [onChange, value]
  );
  return (
    <input type="checkbox" onChange={onChangeValue} checked={value} />
    // <div className={"checkbox"+(value?" active":" inactive")} onClick={onChangeValue}>
    // </div>
  );
};
