import React from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import {Product} from '../../interface/product.interface';
import {styles} from './product-item.style';

interface Props {
  product: Product;
}

export default class ProductItem extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {product} = this.props;

    return (
      <View style={[styles.product]}>
        <TouchableWithoutFeedback
          onPress={() => console.log('Product Clicked')}>
          <View style={[styles.imageContainer]}></View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => console.log('Product Clicked')}>
          <View style={styles.productDescription}>
            <Text style={styles.productId}>{product.product_id}</Text>
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.productDate}>{product.description}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => console.log('Product Clicked')}>
          <View style={[styles.imageContainer, styles.endContainer]}></View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
