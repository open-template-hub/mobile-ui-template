import React from 'react';
import {View} from 'react-native';
import RNIap, {
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
  Subscription,
} from 'react-native-iap';
import {Storage} from '../../app.store';
import {Config} from '../../config/app.config';
import {PaymentController} from '../../contoller/payment.controller';
import {PaymentArgs} from '../../interface/payment-args.interface';
import {styles} from '../in-app-product-list/in-app-product-list.style';
import InAppProduct from '../in-app-product/in-app-product.component';
import Loading from '../loading/loading.component';
import {BannerAd, BannerAdSize} from '@react-native-firebase/admob';
import {LogSeverity} from '../../enum/log-severity.enum';
import {Logger} from '../../util/logger.util';

interface Props {
  onPaymentConfirmed(): Promise<void>;
  navigation: any;
}

interface State {
  productList: Subscription[];
  receipt: string;
  loading: boolean;
  isLoaded: boolean;
}

export default class InAppProductList extends React.Component<Props, State> {
  private _focusListener: any;
  private _purchaseUpdateSubscription: any;
  private _purchaseErrorSubscription: any;

  private _paymentController: PaymentController;

  constructor(props: Props) {
    super(props);
    this.state = {
      productList: [],
      receipt: '',
      loading: false,
      isLoaded: false,
    };

    this._paymentController = new PaymentController();
  }

  componentDidMount = () => {
    const {isLoaded} = this.state;
    if (isLoaded) return;

    this.load();
  };

  load = async () => {
    this.setState({loading: true});

    try {
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      await this.getItems();

      this._purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: ProductPurchase) => {
          Logger.log({
            severity: LogSeverity.INFO,
            message: 'Purchase: ',
            args: purchase,
            callerInstance: this,
            callerMethod: 'load',
          });
          if (
            purchase.purchaseStateAndroid === 1 &&
            !purchase.isAcknowledgedAndroid &&
            purchase.purchaseToken
          ) {
            try {
              const ackResult = await acknowledgePurchaseAndroid(
                purchase.purchaseToken,
              );
              Logger.log({
                severity: LogSeverity.INFO,
                message: 'Result: ',
                args: ackResult,
                callerInstance: this,
                callerMethod: 'load',
              });
            } catch (ackErr) {
              Logger.log({
                severity: LogSeverity.MINOR,
                message: 'Ack Error: ',
                args: ackErr,
                callerInstance: this,
                callerMethod: 'load',
              });
            }
          }
          await this.purchaseConfirmed(purchase);
          this.setState({receipt: purchase.transactionReceipt});
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
        },
      );
    } catch (err) {
      Logger.log({
        severity: LogSeverity.CRITICAL,
        message: 'Error: ',
        args: err,
        callerInstance: this,
        callerMethod: 'load',
      });
    }

    this.setState({loading: false, isLoaded: true});
  };

  componentWillUnmount = () => {
    // Remove the event listener
    try {
      this._focusListener.remove();
      this._purchaseUpdateSubscription.remove();
      this._purchaseErrorSubscription.remove();
    } catch (e) {}
  };

  getItems = async (): Promise<void> => {
    try {
      const items = Config.Provider.Google.InApp.products;
      const products: Subscription[] = await RNIap.getSubscriptions(items);
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
    if (purchase && purchase.purchaseToken) {
      await Storage.setPurchase(purchase.purchaseToken);
      const {onPaymentConfirmed} = this.props;
      await onPaymentConfirmed();
      try {
        const auth = await Storage.getAuth();
        const paymentArgs = {
          paymentConfigKey: Config.Provider.Google.InApp.subscriptionPaymentKey,
          payload: purchase,
        } as PaymentArgs;
        this._paymentController.saveSubscription(auth, paymentArgs);
      } catch (e) {
        Logger.log({
          severity: LogSeverity.MAJOR,
          message: 'Error on Save Subscription: ',
          args: e,
          callerInstance: this,
          callerMethod: 'purchaseConfirmed',
        });
      }
    }
  };

  render() {
    const {productList, loading} = this.state;
    return (
      <View style={styles.container}>
        <BannerAd
          unitId={Config.Provider.Google.Admob.bannerId}
          size={BannerAdSize.ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdClosed={() => console.log('onAdClosed')}
          onAdFailedToLoad={() => console.log('onAdFailedToLoad')}
          onAdLoaded={() => console.log('onAdLoaded')}
          onAdOpened={() => console.log('onAdOpened')}
          onAdLeftApplication={() => console.log('onAdLeftApplication')}
        />

        {loading ? (
          <Loading />
        ) : productList && productList.length > 0 ? (
          productList.map((p) => (
            <View key={p.productId} style={styles.product}>
              <InAppProduct product={p} />
            </View>
          ))
        ) : null}
      </View>
    );
  }
}
