/* eslint-disable @typescript-eslint/ban-ts-comment */
import { connect } from 'react-redux';
import { useLocation } from 'react-router';
import { NavPageContainer } from 'react-windows-ui';
import Breadcrumbs from 'renderer/components/Breadcrumbs';
import { State } from 'renderer/store/types';
import FirewallRuleEditor, {
  defaultRule,
} from '../components/FirewallRuleEditor';

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const FirewallRule: React.FC<Props> = ({ rules }) => {
  const location = useLocation();
  const { DisplayName, ...Rest } = location.state;
  let rule = rules.find((r) => r.DisplayName === DisplayName);
  let isNew = false;
  if (rule === undefined) {
    isNew = true;
    rule = {
      DisplayName,
      ...Rest,
      ...defaultRule,
    };
  }
  // const currentRule = useState(rule);
  return (
    <NavPageContainer animateTransition>
      <div className="page">
        <Breadcrumbs
          title={DisplayName}
          history={[{ title: 'Firewall', to: '/firewall' }]}
        />
        {/* <p>{rule?.Description}</p> */}
        {/* {currentRule === undefined ? (
          <div>New</div>
        ) : ( */}
        <FirewallRuleEditor rule={rule!} isNew={isNew} />
        {/* )} */}
      </div>
    </NavPageContainer>
  );
};

const mapDispatchToProps = {};
const mapStateToProps = (state: State) => {
  return { rules: state.app.firewall.rules };
};
export default connect(mapStateToProps, mapDispatchToProps)(FirewallRule);
