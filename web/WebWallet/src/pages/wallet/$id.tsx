import React from 'react';
import { Spin, Button, Popover, Modal, Divider, Input, Icon } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import FileSaver from 'file-saver';
import { Unit } from '@harmony-js/utils';
import { QRCode } from 'react-qrcode-logo';

import { createAction, connect, router } from '@/utils';
import styles from './index.css';
import { getAddress, decrypt } from '@harmony-js/crypto';
import TextArea from 'antd/lib/input/TextArea';

interface IAccount {
  address: string;
  balance: string;
  accountFile: string;
  nonce: number;
  loading: boolean;
  getBalance: Function;
  getAccountFile: Function;
  symbol: string;
}

const PopContent = <span>Address Copied</span>;

class Account extends React.Component<IAccount> {
  state = {
    popVisible: false,
    showBech: true,
    modalVisible: false,
    modalPopVisible: false,
    revealVisible: false,
    passPhrase: '',
    revealLoading: false,
    decrypted: false,
    decryptedError: false,
    decryptedKey: '',
    exportModalVisible: false,
  };
  displayAddress(rawAddress: string, showBech: boolean) {
    const address = showBech ? getAddress(rawAddress).bech32 : getAddress(rawAddress).checksum;
    const dot = `...`;
    const start = address.substring(0, 8);
    const tail = address.substring(address.length - 4, address.length);
    return `${start}${dot}${tail}`;
  }
  displayBalance(balance: string) {
    return new Unit(balance)
      .asWei()
      .toEther()
      .substring(0, 22);
  }
  toSend(from: string) {
    router.push(`/send?from=${from}`);
  }
  onCopyClick = () => {
    this.setState({
      popVisible: true,
    });
  };
  onModalCopyClick = () => {
    this.setState({
      modalPopVisible: true,
    });
  };
  handleVisibleChange = (visible: boolean) => {
    this.setState({
      popVisible: visible,
    });
  };
  handleModalVisibleChange = (visible: boolean) => {
    this.setState({
      modalPopVisible: visible,
    });
    if (!visible) {
      this.setState({
        passPhrase: '',
        revealLoading: false,
        decrypted: false,
        decryptedKey: '',
      });
    }
  };
  handleExportModalVisible = () => {
    this.setState({
      exportModalVisible: !this.state.exportModalVisible,
    });
  };
  componentDidMount() {
    this.props.getBalance({ address: this.props.address });
    this.props.getAccountFile({ address: this.props.address });
  }

  handleAddressSwitch = () => {
    this.setState({
      showBech: !this.state.showBech,
    });
  };

  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      revealVisible: false,
    });
  };
  handleRevealVisible = (visible: boolean) => {
    this.setState({
      passPhrase: '',
      revealVisible: visible,
      decrypted: false,
      decryptedKey: '',
    });
  };
  handleDecrypt = async () => {
    this.setState({
      passPhrase: '',
      revealLoading: true,
      decrypted: false,
      decryptedError: false,
      decryptedKey: '',
    });
    try {
      const decrypted = await decrypt(JSON.parse(this.props.accountFile), this.state.passPhrase);
      if (decrypted) {
        this.setState({
          revealLoading: false,
          decryptedError: false,
          decrypted: true,
          decryptedKey: decrypted,
        });
      }
    } catch (error) {
      this.setState({
        revealLoading: false,
        decryptedError: true,
        decrypted: false,
        decryptedKey: '',
      });
    }
  };

  copyAddress(rawAddress: string, showBech: boolean) {
    return showBech ? getAddress(rawAddress).bech32 : getAddress(rawAddress).checksum;
  }

  render() {
    return (
      <div className={styles.container}>
        <Modal
          visible={this.state.exportModalVisible}
          onCancel={this.handleExportModalVisible}
          footer={null}
          centered={true}
          width={360}
        >
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 400, padding: 24 }}>
            <TextArea
              style={{ padding: 12, height: 300 }}
              defaultValue={this.props.accountFile}
              disabled={true}
            />
            <CopyToClipboard text={this.props.accountFile}>
              <Button
                block={true}
                type="primary"
                ghost={true}
                style={{
                  marginTop: '0.8rem',
                  marginBottom: '0.8rem',
                  height: '4.0rem',
                  fontSize: '1.4rem',
                }}
              >
                Copy To ClipBoard
              </Button>
            </CopyToClipboard>
            <Button
              block={true}
              type="primary"
              ghost={true}
              style={{
                marginTop: '0.6rem',
                marginBottom: '0.6rem',
                height: '4.0rem',
                fontSize: '1.4rem',
              }}
              // tslint:disable-next-line: jsx-no-lambda
              onClick={() => {
                const file = this.props.accountFile;
                const blob = new Blob([file], { type: 'text/plain;charset=utf-8' });
                FileSaver.saveAs(blob, `${this.props.address}.json`);
              }}
            >
              Download .json file
            </Button>
          </div>
        </Modal>
        <Modal
          visible={this.state.modalVisible}
          onCancel={this.handleModalVisible}
          footer={null}
          centered={true}
          width={360}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
            }}
          >
            <QRCode
              value={this.props.address ? getAddress(this.props.address).bech32 : ''}
              size={256}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#dddddd',
                opacity: 0.6,
                padding: 12,
                width: 256,
                marginTop: '0.6rem',
              }}
            >
              <div
                style={{
                  fontSize: 18,

                  width: 244,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {this.props.address}
              </div>
              <CopyToClipboard
                text={this.copyAddress(this.props.address, this.state.showBech)}
                onCopy={this.onModalCopyClick}
              >
                <Icon type="copy" style={{ fontSize: '16px', color: '#08c' }} />
              </CopyToClipboard>
            </div>

            <Divider />

            {!this.state.revealVisible ? (
              <div>
                <Button
                  block={true}
                  type="primary"
                  ghost={true}
                  style={{
                    marginTop: '0.6rem',
                    marginBottom: '0.6rem',
                    height: '4.0rem',
                    fontSize: '1.4rem',
                  }}
                >
                  View On Explorer
                </Button>
                <Button
                  block={true}
                  type="primary"
                  ghost={true}
                  style={{
                    marginTop: '0.6rem',
                    marginBottom: '0.6rem',
                    height: '4.0rem',
                    fontSize: '1.4rem',
                  }}
                  // tslint:disable-next-line: jsx-no-lambda
                  onClick={() => this.handleRevealVisible(true)}
                >
                  Reveal PrivateKey
                </Button>
                <Button
                  block={true}
                  type="primary"
                  ghost={true}
                  style={{ marginTop: '0.6rem', height: '4.0rem', fontSize: '1.4rem' }}
                  // tslint:disable-next-line: jsx-no-lambda
                  onClick={() => {
                    this.handleModalVisible();
                    this.handleExportModalVisible();
                  }}
                >
                  Export KeyStore
                </Button>
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                }}
              >
                {!this.state.decrypted ? (
                  <Input.Password
                    size="large"
                    placeholder="Input Wallet Password"
                    style={{
                      width: '100%',
                      height: '4.0rem',
                      marginBottom: '.6rem',

                      border: this.state.decryptedError ? '1px solid #f25718' : '1px solid #eeeeee',
                    }}
                    // tslint:disable-next-line: jsx-no-lambda
                    onChange={e => this.setState({ passPhrase: e.target.value })}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: 14,
                      padding: 12,
                      width: 256,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      background: '#dddddd',
                      opacity: 0.6,
                      marginTop: '0.4rem',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {this.state.decryptedKey}
                  </div>
                )}
                {!this.state.decrypted ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Button
                      block={true}
                      type="primary"
                      ghost={true}
                      style={{
                        marginTop: '0.6rem',
                        height: '3.2rem',
                        fontSize: '1.0rem',
                        marginRight: '0.2rem',
                      }}
                      // tslint:disable-next-line: jsx-no-lambda
                      onClick={() => this.handleRevealVisible(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      block={true}
                      type="primary"
                      style={{ marginTop: '0.6rem', height: '3.2rem', fontSize: '1.0rem' }}
                      onClick={this.handleDecrypt}
                      loading={this.state.revealLoading}
                    >
                      Reveal
                    </Button>
                  </div>
                ) : (
                  <CopyToClipboard text={this.state.decryptedKey}>
                    <Button
                      block={true}
                      type="primary"
                      ghost={true}
                      style={{ marginTop: '0.6rem', height: '4.0rem', fontSize: '1.4rem' }}
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                )}
              </div>
            )}
          </div>
        </Modal>

        <div style={{ marginTop: '1em', marginBottom: '1em' }}>
          <Button
            icon={'wallet'}
            shape="circle"
            size="large"
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => router.push('/wallet')}
          />
        </div>
        <div
          className={styles.headerText}
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Popover
            placement="bottom"
            content={PopContent}
            visible={this.state.popVisible}
            onVisibleChange={this.handleVisibleChange}
          >
            <CopyToClipboard
              text={this.copyAddress(this.props.address, this.state.showBech)}
              onCopy={this.onCopyClick}
            >
              <span>
                {this.props.address
                  ? this.displayAddress(this.props.address, this.state.showBech)
                  : ''}
              </span>
            </CopyToClipboard>
          </Popover>
          <Button icon="swap" size="large" shape="circle" onClick={this.handleAddressSwitch} />
        </div>
        <div className={styles.balanceText}>
          {this.props.loading ? <Spin /> : this.displayBalance(this.props.balance)}
          <div className={styles.TokenName}>{this.props.symbol}</div>
        </div>
        <div className={styles.buttonWrap}>
          <Button
            size="large"
            block={true}
            style={{ margin: '0.6rem', height: '4.0rem', fontSize: '1.4rem' }}
            type="primary"
            ghost={true}
            onClick={this.handleModalVisible}
          >
            Detail
          </Button>
          <Button
            size="large"
            block={true}
            style={{ margin: '0.6rem', height: '4.0rem', fontSize: '1.4rem' }}
            type="primary"
            ghost={true}
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => this.toSend(this.props.address)}
          >
            Send
          </Button>
        </div>
      </div>
    );
  }
}

function mapState(state: any) {
  return {
    loading: state.loading.global,
    address: state.router.location.pathname.replace('/wallet/', ''),
    balance: state.account.balance,
    nonce: state.account.nonce,
    accountFile: state.account.accountFile,
    symbol: state.network.symbol,
  };
}
function mapDispatch(dispatch: any) {
  return {
    getBalance: (payload: any) => dispatch(createAction('account/getBalance')(payload)),
    getAccountFile: (payload: any) => dispatch(createAction('account/getAccountFile')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Account);
