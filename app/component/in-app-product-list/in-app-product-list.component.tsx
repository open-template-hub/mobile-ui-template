import React from 'react';
import {View, Platform, Text} from 'react-native';
import {
  ProductPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  Product,
} from 'react-native-iap';
import * as RNIap from 'react-native-iap';
import {Config} from '../../config/app.config';
import {styles} from '../in-app-product-list/in-app-product-list.style';
import InAppProduct from '../in-app-product/in-app-product.component';
import Loading from '../loading/loading.component';
import {LogSeverity} from '../../enum/log-severity.enum';
import {Logger} from '../../util/logger.util';
import Localization from '../../localization/i18n/Localization';

interface Props {
  onPaymentConfirmed(purchase: ProductPurchase): Promise<void>;
  navigation: any;
}

interface State {
  productList: Product[];
  receipt: string;
  loading: boolean;
}

export default class InAppProductList extends React.Component<Props, State> {
  private _focusListener: any;
  private _purchaseUpdateSubscription: any;
  private _purchaseErrorSubscription: any;
  private _mounted: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      productList: [],
      receipt: '',
      loading: false,
    };
  }

  componentDidMount = async () => {
    this._mounted = true;
    const {navigation} = this.props;

    if (navigation) {
      await this.load();
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
      this._mounted = false;
      this._purchaseUpdateSubscription.remove();
      this._purchaseErrorSubscription.remove();
    } catch (e) {}
  };

  load = async () => {
    if (!this._mounted) return;

    this.setState({loading: true});

    try {
      await this.getItems();
      await this.processNotConsumedPurchases();

      RNIap.flushFailedPurchasesCachedAsPendingAndroid()
        .catch(() => {
          // exception can happen here if:
          // - there are pending purchases that are still pending (we can't consume a pending purchase)
          // in any case, you might not want to do anything special with the error
        })
        .then(() => {
          this._purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
              Logger.log({
                severity: LogSeverity.CRITICAL,
                message: 'Error: ',
                args: error,
                callerInstance: this,
                callerMethod: 'purchaseErrorListener',
              });
            },
          );

          this._purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase: ProductPurchase) => {
              if (Platform.OS === 'ios') {
                if (purchase.transactionReceipt) {
                  console.log('IOS Purchase: ', purchase);
                  await this.purchaseConfirmed(purchase);
                }
              } else {
                if (
                  purchase.purchaseStateAndroid === 1 &&
                  purchase.purchaseToken &&
                  purchase.transactionReceipt
                ) {
                  console.log('Android Purchase: ', purchase);
                  await this.purchaseConfirmed(purchase);
                }
              }
            },
          );
        });
    } catch (err) {
      Logger.log({
        severity: LogSeverity.CRITICAL,
        message: 'Error: ',
        args: err,
        callerInstance: this,
        callerMethod: 'load',
      });
    }

    this.setState({loading: false});
  };

  processNotConsumedPurchases = async () => {
    const purchases = await RNIap.getAvailablePurchases();
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Processing Not Consumed Purchases: ',
      args: purchases,
      callerInstance: this,
      callerMethod: 'processNotConsumedPurchases',
    });
    const {onPaymentConfirmed} = this.props;
    purchases.map(async (p: ProductPurchase) => {
      await onPaymentConfirmed(p);
    });
  };

  getItems = async () => {
    try {
      const items =
        Platform.OS === 'ios'
          ? Config.Provider.Apple.InApp.products
          : Config.Provider.Google.InApp.products;
      const products: Product[] = await RNIap.getProducts(items);
      Logger.log({
        severity: LogSeverity.INFO,
        message: 'Products: ',
        args: products,
        callerInstance: this,
        callerMethod: 'getItems',
      });
      this.setState({productList: products});
    } catch (err) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error: ',
        args: err,
        callerInstance: this,
        callerMethod: 'getItems',
      });
    }
  };

  purchaseConfirmed = async (purchase: ProductPurchase) => {
    if (Platform.OS === 'ios') {
      if (purchase && purchase.transactionReceipt) {
        const {onPaymentConfirmed} = this.props;
        await onPaymentConfirmed(purchase);
      }
    } else {
      if (purchase && purchase.purchaseToken && purchase.transactionReceipt) {
        const {onPaymentConfirmed} = this.props;
        await onPaymentConfirmed(purchase);
      }
    }
  };

  renderContent = (loading: boolean, productList: Product[]) => {
    if (loading && productList && productList.length <= 0) {
      return <Loading />;
    } else if (productList && productList.length > 0) {
      return (
        <View style={styles.products}>
          {productList.map((p) => (
            <View key={p.productId} style={styles.product}>
              <InAppProduct product={p} />
            </View>
          ))}
        </View>
      );
    } else {
      return (
        <View style={styles.noInAppProductContainer}>
          <Text style={styles.noInAppProductText}>
            {Localization.t('noInAppProductFound')}
          </Text>
        </View>
      );
    }
  };

  render() {
    const {productList, loading} = this.state;
    return (
      <View style={styles.container}>
        {this.renderContent(loading, productList)}
      </View>
    );
  }
}
