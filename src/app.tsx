import React, { useEffect } from "react";
import "./App.scss";
import "./styles/styles.scss";
// import Routes from "./Routes";
import { connect } from "react-redux";
// import {systray} from './utils/systray';
import { loadState } from "./store/reducer";
import * as actions from "./store/actions";
import { State } from "./store/types";
import Routes from "./Routes";
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

let App: React.FC<Props> = ({ setState, darkMode }) => {
  useEffect(() => {
    loadState().then((state) => {
      setState(state);
    });
  }, [setState]);
  return (
    <div className={"root " + (darkMode ? " dark-mode" : " light-mode")}>
      <Routes />
    </div>
  );
};

const mapDispatchToProps = {
  setState: actions.setState,
  setElevated: actions.setElevated,
};
// export default App;
const mapStateToProps = (state: State) => {
  return { active: state.app.active, darkMode: state.app.settings.darkMode };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
