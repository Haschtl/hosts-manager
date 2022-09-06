import * as React from "react";
import "./Inputs.scss";

type IProps = {
  label?: string;
  value?: string;
  onChange?: (text: string) => void;
};
export let TextInputStyled: React.FC<IProps> = ({ label, value, onChange }) => {
  let onChangeText = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.target.value);
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
export let SwitchStyled: React.FC<SProps> = ({
  label,
  value,
  trueLabel,
  falseLabel,
  onChange,
}) => {
  return (
    <div className="switch-input">
      <div className="label">{label}</div>
      <div className="buttons">
        <div
          onClick={() => onChange && onChange(true)}
          className={
            "button buttonLeft " + value ? "buttonActive" : "buttonInactive"
          }
        >
          <div>{trueLabel}</div>
        </div>
        <div
          className={
            "button buttonRight " + value ? "buttonInactive" : "buttonActive"
          }
          onClick={() => onChange && onChange(false)}
        >
          <div>{falseLabel}</div>
        </div>
      </div>
    </div>
  );
};
