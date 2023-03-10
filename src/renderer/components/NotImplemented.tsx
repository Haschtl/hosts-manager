/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';

import { Button, Alert } from 'react-windows-ui';
import './NotImplemented.scss';

type Props = { isOpen?: boolean; onDismiss(): void };

export const NotImplemented: React.FC<Props> = ({ isOpen, onDismiss }) => {
  const dismiss = React.useCallback(() => {
    onDismiss();
  }, [onDismiss]);
  return (
    <Alert
      isVisible={isOpen}
      // @ts-ignore
      style={{ padding: 20 }}
      onBackdropPress={dismiss}
      title="Not implemented"
      message="This feature is currently not implemented"
    >
      {/* @ts-ignore */}
      <Alert.Footer>
        <Button
          style={{ flex: 'auto' }}
          value="Confirm"
          type="primary"
          onClick={dismiss}
        />
        {/* @ts-ignore */}
      </Alert.Footer>
    </Alert>
  );
};

export default NotImplemented;
