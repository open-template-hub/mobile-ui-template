import React from 'react';
import {Text, View} from 'react-native';
import ProductList from '../../component/product-list/product-list.component';
import {Product} from '../../interface/product.interface';
import {styles} from './product-list.style';
import Loading from '../../component/loading/loading.component';
import Localization from '../../localization/i18n/Localization';
import axios, {CancelTokenSource} from 'axios';
import {Logger} from '../../util/logger.util';
import {LogSeverity} from '../../enum/log-severity.enum';
import {ProductController} from '../../contoller/product.controller';
import {Storage} from '../../app.store';

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
  private _productController: ProductController;

  constructor(props: Props) {
    super(props);
    this.state = {
      products: [],
      loading: false,
      isPremium: false,
    };
    this._cancelTokenSource = axios.CancelToken.source();
    this._productController = new ProductController();
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
      products: [],
    });

    try {
      const auth = await Storage.getAuth();

      if (auth && auth.accessToken) {
        const res = await this._productController.getProducts(
          auth,
          this._cancelTokenSource.token,
        );
        if (res && res.data) {
          this.setState({loading: false, products: res.data});
        } else {
          Logger.log({
            severity: LogSeverity.MINOR,
            message: 'Broken Data.',
            callerInstance: this,
            callerMethod: 'load',
          });
        }
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
      });
    }
  };

  renderContent = (
    loading: boolean,
    products: Product[],
    isPremium: boolean,
  ) => {
    if (loading) {
      return <Loading />;
    } else if (products && products.length > 0) {
      return <ProductList products={products} isPremium={isPremium} />;
    } else {
      return (
        <Text style={styles.noProductFound}>
          {Localization.t('noProductFound')}
        </Text>
      );
    }
  };

  render() {
    const {loading, products, isPremium} = this.state;
    return (
      <View style={styles.container}>
        {this.renderContent(loading, products, isPremium)}
      </View>
    );
  }
}
