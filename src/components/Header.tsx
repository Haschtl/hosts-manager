import * as React from "react";
import { useNavigate } from "react-router";
import "./Header.scss";
import BackIcon from "../drawable/baseline_arrow_left.svg";

type Props = {
  children?: React.ReactNode;
  backPage?: string;
};
export let Header: React.FC<Props> = ({ children, backPage = "start" }) => {
  let navigate = useNavigate();
  let goBack = () => {
    navigate(backPage);
  };
  return (
    <div className="page-header">
      <div onClick={goBack} className="button back-button">
        <BackIcon />
      </div>
      {children}
    </div>
  );
};
