import React from 'react';
import {Text, View} from 'react-native';
import ProductList from '../../component/product-list/product-list.component';
import {Product} from '../../interface/product.interface';
import {styles} from './product-list.style';
import Loading from '../../component/loading/loading.component';
import I18n from '../../i18n/i18n';
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

export default class ProductListScreen extends React.Component<Props, State> {
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
      console.log('> ProductListScreen:: can not set listener');
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
    const {loading, products, isPremium} = this.state;
    return (
      <View style={styles.container}>
        {loading ? (
          <Loading />
        ) : products && products.length > 0 ? (
          <ProductList products={products} isPremium={isPremium} />
        ) : (
          <Text style={styles.noProductFound}>{I18n.t('noProductFound')}</Text>
        )}
      </View>
    );
  }
}
