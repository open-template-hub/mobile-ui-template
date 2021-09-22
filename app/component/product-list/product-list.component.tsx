import React from 'react';
import {View} from 'react-native';
import SearchBox from '../search-box/search-box.component';
import {styles} from './product-list.style';
import Localization from '../../localization/i18n/Localization';
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

  filterProducts = (text: string) => {
    const {products} = this.props;
    if (text.length > 0) {
      var re = new RegExp(text, 'gi');
      let filteredProducts = products.filter((m) => {
        return m.product_id.search(re) !== -1;
      });

      this.setState({filteredProducts: filteredProducts, searchText: text});
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
            placeholder={Localization.t('searchText')}
            value={this.state.searchText}
            onChangeText={(text) => this.filterProducts(text)}
          />
        </View>
        <ScrollView style={styles.products} persistentScrollbar={true}>
          {!isPremium ? (
            <View style={styles.ads}>
              <BannerAd
                unitId={Config.Provider.Google.Admob.bannerId}
                size={BannerAdSize.ADAPTIVE_BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
                onAdClosed={() => console.log('onAdClosed')}
                onAdFailedToLoad={(e) => console.log('onAdFailedToLoad', e)}
                onAdLoaded={() => console.log('onAdLoaded')}
                onAdOpened={() => console.log('onAdOpened')}
                onAdLeftApplication={() => console.log('onAdLeftApplication')}
              />
            </View>
          ) : (
            <></>
          )}

          {filteredProducts
            ? filteredProducts.map((p) => (
                <View key={p.product_id} style={styles.productItem}>
                  <ProductItem product={p} />
                </View>
              ))
            : null}
        </ScrollView>
      </LinearGradient>
    );
  }
}
