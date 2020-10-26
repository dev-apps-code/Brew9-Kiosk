import {StyleSheet, Text, AsyncStorage, View} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import {alpha, fontAlpha} from '../Common/size';
import ShopList from '../Components/ShopList';
import NetInfo from '@react-native-community/netinfo';
import {TITLE_FONT, LIGHT_GREY_BACKGROUND} from '../Common/common_style';
import {createAction} from '../Utils';
import AllShopsRequestObject from '../Requests/all_shops_request_object';
import SelectShopRequestObject from '../Requests/select_shop_request_object';

@connect(({members, shops}) => ({
  allShops: shops.allShops,
  companyId: members.company_id,
  nearbyShops: shops.nearbyShops,
  location: members.location,
  selectedShop: shops.selectedShop,
}))
export default class Outlet extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getState();
  }

  _getState = () => ({
    isLoading: true,
    displayShopList: [],
    isSearching: false,
    searchResults: [],
    selectedArea: null,
    selectedAreaText: 'All',
    selectedDistrict: null,
    showAreaView: false,
    showMap: true,
    selectedShop: null,
  });

  async componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', this._didFocus);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardWillShowListener.remove();
  }

  _didFocus = async () => {
    //FIXME: this only checks if you have wifi/3g connection
    // not guaranteed internet connectivity
    const connectionState = await NetInfo.fetch();
    const {isConnected} = connectionState;
    if (isConnected) {
      this.loadAllShops();
    } else {
      alert('no network connection, attempting to load cache data');
      this.loadCache();
    }
  };

  isConnected = () => {
    NetInfo.fetch().then((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      return 'test';
    });
  };

  async loadAllShops() {
    this.setState({isLoading: true});
    const {companyId, dispatch} = this.props;

    const allShopsObject = new AllShopsRequestObject();
    allShopsObject.setUrlId(companyId);

    // load all shops always
    dispatch(
      createAction('shops/loadAllShops')({
        object: allShopsObject,
        callback: this.updateShopsList,
      }),
    );
  }

  updateShopsList = (eventObject) => {
    this.setState({isLoading: false});
  };

  onPressOrderNow = async (id) => {
    const {location} = this.props;
    const latitude = location != null ? location.coords.latitude : null;
    const longitude = location != null ? location.coords.longitude : null;

    if (latitude !== null && longitude !== null) {
      const object = new SelectShopRequestObject(latitude, longitude);

      object.setUrlId(this.props.companyId);
      object.setShopId(id);

      const callback = this.onPressOrderNowCallback;
      const params = {object, callback};
      const action = createAction('shops/selectShop')(params);
      this.props.dispatch(action);
    } else {
      const object = new SelectShopRequestObject();
      object.setUrlId(this.props.companyId);
      object.setShopId(id);

      const callback = this.onPressOrderNowCallback;
      const params = {object, callback};
      const action = createAction('shops/selectShop')(params);
      this.props.dispatch(action);
    }
  };

  async saveCache(data) {
    const cacheShop = JSON.stringify(data);
    await AsyncStorage.setItem('@cacheShop', cacheShop);
  }

  async loadCache() {
    try {
      const cacheShop = await AsyncStorage.getItem('@cacheShop');
      if (cacheShop !== null) {
        const object = JSON.parse(cacheShop);
        const callback = this.cacheCallBack;
        const params = {object, callback};
        const action = createAction('shops/cacheSelectShop')(params);
        this.props.dispatch(action);
      } else {
        alert('No cache data found');
      }
    } catch (error) {
      alert('No cache data found');
    }
  }

  onPressShop = (data) => {
    this.setState({
      selectedShop: data,
    });
  };

  onPressOrderNowCallback = (eventObject) => {
    if (eventObject.success) {
      this.props.navigation.navigate('Home');
      this.saveCache(eventObject.result);
    }
  };

  cacheCallBack = (eventObject) => this.props.navigation.navigate('Home');

  getShopsList = () => {
    const {allShops, nearbyShops} = this.props;
    const {displayShopList, isSearching, searchResults} = this.state;

    if (isSearching) return searchResults;
    if (displayShopList.length > 0) return displayShopList;
    if (nearbyShops.length > 0) return nearbyShops;
    return allShops;
  };

  render() {
    const shops = this.getShopsList();
    return (
      <View style={styles.mainView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Please Select Shop</Text>
        </View>
        <ShopList
          shops={shops}
          onPressFavourite={this.onPressFavourite}
          onPressOrderNow={this.onPressOrderNow}
          onRefresh={() => this.loadAllShops()}
          onPressShop={this.onPressShop}
          refreshing={this.state.isLoading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
    backgroundColor: LIGHT_GREY_BACKGROUND,
  },
  header: {
    height: alpha * 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerText: {
    fontFamily: TITLE_FONT,
    fontSize: fontAlpha * 12,
  },
});
