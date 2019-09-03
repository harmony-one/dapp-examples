import React from 'react';
import Link from 'umi/link';
import { getAddress } from '@harmony-js/crypto';
import { Icon, Menu, Dropdown } from 'antd';

interface IAccountCard {
  address: string;
  index: number;
  imported: boolean;
  remove: Function;
}

const menu = (onClick: any) => (
  <Menu>
    <Menu.Item key="0">
      <div onClick={onClick}>remove</div>
    </Menu.Item>
  </Menu>
);

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
          // border: '1px solid #dddddd',
          boxShadow: '0px 1px 20px 6px #f1f2f3',
          borderRadius: '0.4rem',
          padding: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Dropdown
            // tslint:disable-next-line: jsx-no-lambda
            overlay={() =>
              menu(() => {
                this.props.remove({ address: getAddress(this.props.address).basicHex });
              })
            }
            trigger={['click']}
          >
            <Icon
              type="more"
              // tslint:disable-next-line: jsx-no-lambda
            />
          </Dropdown>
          <Link to={`/wallet/${formatedAddress}`}>
            <div style={{ fontSize: '1.4rem', color: '#333333', marginLeft: 12 }}>
              {displayAddress}
            </div>
          </Link>
        </div>
        <div style={{ fontSize: '1.0rem', color: '#8c8c8c' }}>
          {this.props.imported ? 'imported' : ''}
        </div>
      </div>
    );
  }
}

export default AccountCard;
