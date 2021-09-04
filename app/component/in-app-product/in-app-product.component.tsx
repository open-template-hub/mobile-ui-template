import React from 'react';
import {Alert, Text, View} from 'react-native';
import {Product} from 'react-native-iap';
import {styles} from './in-app-product.style';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as RNIap from 'react-native-iap';
import {faCrown, faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {Theme} from '../../constant/theme.constant';
import CustomButtonWithIcon from '../custom-button-with-icon/custom-button-with-icon.component';

interface Props {
  product: Product;
}

export default class InAppProduct extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  oneTimePayment = async (productId: string) => {
    try {
      await RNIap.requestPurchase(productId);
    } catch (err: any) {
      Alert.alert(err.toLocaleString());
    }
  };

  render() {
    const {product} = this.props;
    return (
      <View style={styles.container}>
        <FontAwesomeIcon
          icon={faCrown}
          size={36}
          color={Theme.Color.defaultButtonColor}
        />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{product.localizedPrice}</Text>
        <View style={styles.purchaseButton}>
          <CustomButtonWithIcon
            onPress={() => this.oneTimePayment(product.productId)}
            disabled={false}
            icon={faShoppingCart}
            iconSize={24}
            color={Theme.Color.defaultActionButtonColor}
            tintColor={'#FFC107'}
          />
        </View>
      </View>
    );
  }
}
