import * as React from 'react';
import "./NotImplemented.scss";
import Popup from './Popup';

type Props = {isOpen?: boolean; onDismiss(): void};
export let NotImplemented: React.FC<Props> = ({isOpen, onDismiss}) => {
  return (
    <Popup
      isOpen={isOpen}
      onDismiss={() => {
        onDismiss();
      }}>
      <div
        style={{
          backgroundColor: '#322',
          flex: 1,
          padding: 50,
          paddingBottom: 0,
          borderRadius: 20,
          display: 'flex',
          justifyContent: 'space-evenly',
          alignContent: 'space-between',
          alignItems: 'center',
        }}>
        <div>This feature is not implemented</div>
        <div className="button"
          onClick={() => {
            onDismiss();
          }}
          style={{
            width: 80,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <div>Close</div>
        </div>
      </div>
    </Popup>
  );
};