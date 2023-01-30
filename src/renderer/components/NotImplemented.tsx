import * as React from 'react';

import './NotImplemented.scss';
import Popup from './Popup';

type Props = { isOpen?: boolean; onDismiss(): void };

export const NotImplemented: React.FC<Props> = ({ isOpen, onDismiss }) => {
  const dismiss = React.useCallback(() => {
    onDismiss();
  }, [onDismiss]);
  return (
    <Popup isOpen={isOpen} onDismiss={dismiss}>
      <div className="not-implemented">
        <div>This feature is not implemented</div>
        <button
          type="button"
          className="button"
          onClick={dismiss}
          style={{
            width: 80,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            marginTop: 50,
          }}
        >
          <div>Close</div>
        </button>
      </div>
    </Popup>
  );
};

export default NotImplemented;
