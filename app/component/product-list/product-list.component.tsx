import React from 'react';
import {View} from 'react-native';
import SearchBox from '../search-box/search-box.component';
import {styles} from './product-list.style';
import I18n from './../../i18n/i18n';
import {Product} from '../../interface/product.interface';
import ProductItem from '../product-item/product-item.component';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Theme} from '../../constant/theme.constant';
import {Config} from '../../config/app.config';
import {BannerAd, BannerAdSize} from '@react-native-firebase/admob';

interface Props {
  products: Array<Product>;
  isPremium: boolean;
}

interface State {
  searchText: string;
  filteredProducts: Array<Product>;
}

export default class ProductList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const {products} = this.props;

    this.state = {
      searchText: '',
      filteredProducts: products,
    };
  }

  componentDidMount() {}

  filterProducts = (text: string) => {
    const {products} = this.props;
    if (text.length > 0) {
      var re = new RegExp(text, 'gi');
      let filteredMatches = products.filter((m) => {
        return m.teams.search(re) !== -1;
      });

      this.setState({filteredProducts: filteredMatches, searchText: text});
    } else {
      this.setState({searchText: text, filteredProducts: products});
    }
  };

  render() {
    const {filteredProducts} = this.state;
    const {isPremium} = this.props;
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0.25, y: 1.1}}
        locations={[0.2, 1]}
        colors={[Theme.Color.signBack1, Theme.Color.signBack2]}
        style={[{flex: 1, paddingTop: Theme.Size.base * 4}]}>
        <View style={styles.searchBox}>
          <SearchBox
            placeholder={I18n.t('searchText')}
            value={this.state.searchText}
            onChangeText={(text) => this.filterProducts(text)}
          />
        </View>
        <ScrollView style={styles.products} persistentScrollbar={true}>
          {!isPremium ? (
            <View style={styles.ads}>
              <BannerAd
                unitId={Config.Provider.Google.Admob.bannerId}
                size={BannerAdSize.MEDIUM_RECTANGLE}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
                onAdClosed={() => console.log('onAdClosed')}
                onAdFailedToLoad={() => console.log('onAdFailedToLoad')}
                onAdLoaded={() => console.log('onAdLoaded')}
                onAdOpened={() => console.log('onAdOpened')}
                onAdLeftApplication={() => console.log('onAdLeftApplication')}
              />
            </View>
          ) : (
            <></>
          )}

          {filteredProducts
            ? filteredProducts.map((match) => (
                <View key={match.matchCode} style={styles.productItem}>
                  <ProductItem product={match} />
                </View>
              ))
            : null}
        </ScrollView>
      </LinearGradient>
    );
  }
}
