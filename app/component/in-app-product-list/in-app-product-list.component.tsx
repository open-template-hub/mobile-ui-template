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
          console.log('> InAppProductList:: Purchase: ', purchase);
          if (
            purchase.purchaseStateAndroid === 1 &&
            !purchase.isAcknowledgedAndroid &&
            purchase.purchaseToken
          ) {
            try {
              const ackResult = await acknowledgePurchaseAndroid(
                purchase.purchaseToken,
              );
              console.log('> InAppProductList:: Result:', ackResult);
            } catch (ackErr) {
              console.warn('> InAppProductList:: Ack Error: ', ackErr);
            }
          }
          await this.purchaseConfirmed(purchase);
          this.setState({receipt: purchase.transactionReceipt});
          this._purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
              console.log('> InAppProductList:: Error: ', error);
            },
          );
        },
      );
    } catch (err) {
      console.log('> InAppProductList:: Error in cdm: ', err);
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
      console.log('> getItems:: Products[0]: ', products[0]);
      this.setState({productList: products});
    } catch (err) {
      console.log('> getItems:: purchase error => ', err);
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
        console.log('> purchaseConfirmed:: Error on Save Subscription: ', e);
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
