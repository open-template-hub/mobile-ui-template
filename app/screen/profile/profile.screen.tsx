import React from 'react';
import {View} from 'react-native';
import {Product} from '../../interface/product.interface';
import {styles} from './profile.style';
import {AnalyticsUtil} from '../../util/analytics.util';
import {Screens} from '../../constant/screens.constant';
import axios, {CancelTokenSource} from 'axios';

interface State {
  products: Array<Product>;
  loading: boolean;
  isPremium: boolean;
}

interface Props {
  navigation: any;
}

export default class ProfileScreen extends React.Component<Props, State> {
  private _focusListener: any;
  private _blurListener: any;
  private _mounted: boolean = false;
  private _cancelTokenSource: CancelTokenSource;

  constructor(props: Props) {
    super(props);
    this.state = {
      products: [],
      loading: false,
      isPremium: false,
    };
    this._cancelTokenSource = axios.CancelToken.source();
  }

  componentDidMount = () => {
    this._mounted = true;

    AnalyticsUtil.log(Screens.Products);

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
      console.log('> ProfileScreen:: can not set listener');
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
      products: [],
    });

    this.setState({
      loading: false,
      products: [],
    });
  };

  render() {
    return <View style={styles.container}></View>;
  }
}
