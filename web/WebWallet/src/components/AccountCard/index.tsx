import React from 'react';
import Link from 'umi/link';
import { getAddress } from '@harmony-js/crypto';

interface IAccountCard {
  address: string;
  index: number;
  imported: boolean;
}

class AccountCard extends React.Component<IAccountCard> {
  formatAddress(address: string, display: boolean = false, max: number = 16, start: number = 10) {
    const bech32 = getAddress(address).bech32;
    if (display) {
      const head = bech32.substring(0, start - 1);
      const tail = bech32.substring(address.length - max + start - 1);
      return `${head}...${tail}`;
    }
    return bech32;
  }

  render() {
    const formatedAddress = this.formatAddress(this.props.address, false);
    const displayAddress = this.formatAddress(this.props.address, true);
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          height: '6rem',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #dddddd',
          borderRadius: '0.4rem',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        <Link to={`/wallet/${formatedAddress}`}>
          <div style={{ fontSize: '1.4rem', color: '#333333' }}>{displayAddress}</div>
        </Link>
        <div style={{ fontSize: '1.4rem', color: '#8c8c8c' }}>
          {this.props.imported ? 'imported' : ''}
        </div>
      </div>
    );
  }
}

export default AccountCard;
