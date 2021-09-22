import React from 'react';
import {View} from 'react-native';
import {styles} from './profile.style';
import axios, {CancelTokenSource} from 'axios';
import Profile from '../../component/profile/profile.component';
import {UserController} from '../../contoller/user.controller';
import {Storage} from '../../app.store';
import {User} from '../../interface/user.interface';
import Loading from '../../component/loading/loading.component';
import {Logger} from '../../util/logger.util';
import {LogSeverity} from '../../enum/log-severity.enum';

interface State {
  loading: boolean;
  me: User;
}

interface Props {
  navigation: any;
}

export default class ProfileScreen extends React.Component<Props, State> {
  private _focusListener: any;
  private _blurListener: any;
  private _mounted: boolean = false;
  private _cancelTokenSource: CancelTokenSource;
  private _userController: UserController;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      me: {} as User,
    };
    this._cancelTokenSource = axios.CancelToken.source();
    this._userController = new UserController();
  }

  componentDidMount = () => {
    this._mounted = true;

    const {navigation} = this.props;

    if (navigation) {
      this._focusListener = navigation.addListener('focus', async () => {
        await this.load();
      });
      this._blurListener = navigation.addListener('blur', async () => {
        this._cancelTokenSource.cancel('Request Cancelled');
        this._cancelTokenSource = axios.CancelToken.source();
      });
    } else {
      Logger.log({
        severity: LogSeverity.MINOR,
        message: 'Can not set listener',
        callerInstance: this,
        callerMethod: 'componentDidMount',
      });
    }
  };

  componentWillUnmount = () => {
    // Remove the event listener
    try {
      this._focusListener.remove();
      this._blurListener.remove();
    } catch (e) {}
  };

  load = async () => {
    if (!this._mounted) return;

    this.setState({
      loading: true,
    });

    const auth = await Storage.getAuth();
    if (auth != null) {
      try {
        const res = await this._userController.getMe(
          auth,
          this._cancelTokenSource.token,
        );
        if (res && res.data && res.status === 200) {
          const me = res.data as User;

          this.setState({
            loading: false,
            me,
          });
        } else if (res && res.data.message) {
          this.setState({
            loading: false,
            me: {} as User,
          });
        } else {
          Logger.log({
            severity: LogSeverity.MINOR,
            message: 'Broken Data.',
            callerInstance: this,
            callerMethod: 'load',
          });

          this.setState({
            loading: false,
            me: {} as User,
          });
        }
      } catch (e) {
        Logger.log({
          severity: LogSeverity.MAJOR,
          message: 'Unhandled Exception: ',
          args: e,
          callerInstance: this,
          callerMethod: 'load',
        });

        this.setState({
          loading: false,
          me: {} as User,
        });
      }
    } else {
      this.setState({loading: false, me: {} as User});
    }
  };

  render() {
    const {me, loading} = this.state;
    return (
      <View style={styles.container}>
        {loading ? <Loading /> : <Profile user={me}></Profile>}
      </View>
    );
  }
}
