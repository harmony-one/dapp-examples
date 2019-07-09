import React from 'react';
import { Input, Form, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import router from 'umi/router';
import { createAction } from '@/utils';
import { FullscreenLoading } from '../components';
import styles from './index.css';

interface InterIndex {
  length: number;
  unlockError: boolean;
  loading: any;
  unlockWallet: Function;
}

class Index extends React.Component<InterIndex> {
  state = {
    password: undefined,
    loading: this.props.loading,
  };
  createWallet() {
    return router.push('/new?step1=mne&&create=true');
  }
  importMne() {
    return router.push('/new?step1=mne&&create=false');
  }

  unlock(password: string) {
    this.setState({
      loading: true,
    });
    setTimeout(() => this.props.unlockWallet({ password }), 200);
  }
  renderButton(props: any) {
    if (props.length === 0) {
      return (
        <div>
          <div className={styles.button} onClick={this.createWallet}>
            New Wallet
          </div>
          <div className={styles.button} onClick={this.importMne}>
            Import Phrases
          </div>
        </div>
      );
    } else {
      const UnlockForm = Form.create({
        name: 'UnlockForm',
      })((formProps: FormComponentProps) => {
        const unlockedPassword = formProps.form.getFieldValue('unlockPassword');
        const disabled = unlockedPassword === undefined || unlockedPassword === '';
        return (
          <Form>
            <Form.Item>
              {formProps.form.getFieldDecorator('unlockPassword', {})(
                <Input.Password size="large" style={{ height: '4rem', fontSize: '2rem' }} />,
              )}
            </Form.Item>
            <Form.Item>
              <Button
                className={disabled ? styles.buttonDisabled : styles.button}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={() => this.unlock(unlockedPassword)}
                block={true}
                size={'large'}
                disabled={disabled}
                loading={this.props.loading}
              >
                Unlock
              </Button>
            </Form.Item>
          </Form>
        );
      });
      return <UnlockForm />;
    }
  }
  componentDidUpdate(prevProps: any) {
    if (prevProps.loading === true && this.props.loading === false) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    return (
      <div className={styles.container}>
        {this.state.loading ? <FullscreenLoading /> : null}
        <div className={styles.brand}>H wallet</div>
        {this.renderButton(this.props)}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    loading: state.wallet.loading,
    length: state.wallet.accounts.length,
    unlockError: state.wallet.unlockError,
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    unlockWallet: (payload: any) => dispatch(createAction('wallet/unlockWallet')(payload)),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Index);
