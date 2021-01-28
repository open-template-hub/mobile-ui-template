import React from 'react';
import {Alert, Text, View} from 'react-native';
import {Subscription} from 'react-native-iap';
import CustomButton from '../custom-button/custom-button.component';
import {faGooglePlay} from '@fortawesome/free-brands-svg-icons';
import {styles} from './in-app-product.style';
import Localization from '../../localization/i18n/i18n.localization';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import RNIap from 'react-native-iap';

interface Props {
  product: Subscription;
}

export default class InAppProduct extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  subscribe = async (productId: string) => {
    try {
      await RNIap.requestSubscription(productId);
    } catch (err) {
      Alert.alert(err.toLocaleString());
    }
  };

  render() {
    const {product} = this.props;
    return (
      <View style={styles.container}>
        <FontAwesomeIcon icon={faGooglePlay} size={30} color="#c00611" />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{product.localizedPrice}</Text>
        <View style={styles.purchaseButton}>
          <CustomButton
            onPress={async () => await this.subscribe(product.productId)}
            disabled={false}
            title={Localization.t('purchase')}
          />
        </View>
      </View>
    );
  }
}
