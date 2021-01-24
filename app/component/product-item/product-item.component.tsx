import React from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import {Product} from '../../interface/product.interface';
import I18n from '../../i18n/i18n';
import {styles} from './product-item.style';

interface Props {
  product: Product;
}

interface State {
  searchText: string;
}

export default class ProductItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  componentDidMount() {}

  render() {
    const {product} = this.props;
    const imageStyles = [styles.image, styles.horizontalImage];
    const imageStylesEnd = [
      styles.image,
      styles.fullImage,
      styles.horizontalImageEnd,
    ];
    const appendLeadingZeroes = (n: number) => {
      if (n <= 9) {
        return '0' + n;
      }
      return n;
    };
    var matchTime = new Date(product.matchTime);
    var formattedMatchTime =
      appendLeadingZeroes(matchTime.getDate()) +
      '/' +
      appendLeadingZeroes(matchTime.getMonth() + 1) +
      '/' +
      matchTime.getFullYear() +
      ' ' +
      appendLeadingZeroes(matchTime.getHours()) +
      ':' +
      appendLeadingZeroes(matchTime.getMinutes());

    return (
      <View style={[styles.product]}>
        <TouchableWithoutFeedback onPress={() => console.log('Match Clicked')}>
          <View style={[styles.imageContainer]}></View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => console.log('Match Clicked')}>
          <View style={styles.productDescription}>
            <Text style={styles.productTitle}>{product.teams}</Text>
            <Text style={styles.productDate}>{formattedMatchTime}</Text>
            <View style={styles.prediction}>
              <Text style={styles.averageTitle}>{I18n.t('endGameTotal')}</Text>
              <Text style={styles.averageScore}>
                {product.totalAverageResult}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => console.log('Match Clicked')}>
          <View style={[styles.imageContainer, styles.endContainer]}></View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
