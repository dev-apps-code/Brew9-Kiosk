import {
  Animated,
  Easing,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { connect } from "react-redux";
import { alpha, fontAlpha, windowWidth } from "../Common/size";
import ShopList from "../Components/ShopList";
import {
  TINT_COLOR,
  TABBAR_INACTIVE_TINT,
  TITLE_FONT,
  TAB_STYLE,
  LIGHT_GREY_BACKGROUND,
  NON_TITLE_FONT,
  TEXT_COLOR,
  DISABLED_COLOR,
  DEFAULT_BORDER_RADIUS,
} from "../Common/common_style";
import { createAction } from "../Utils";
import AllShopsRequestObject from "../Requests/all_shops_request_object";
  import SelectShopRequestObject from '../Requests/select_shop_request_object';
import NearestShopRequestObject from "../Requests/nearest_shop_request_object";

@connect(({ members, shops, orders }) => ({
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
    selectedAreaText: "All",
    selectedDistrict: null,
    showAreaView: false,
    showMap: true,
    selectedShop: null,
  });

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", this._didFocus);
    this.keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardWillShowListener.remove();
  }

  _didFocus = async () => {
    this.loadAllShops();
  };

  keyboardWillHide = () => {
    // this.resetSearchFieldWidth();
  };

  keyboardWillShow = () => {
    this.setState({ showMap: false });
  };

  async loadAllShops() {
    this.setState({ isLoading: true });
    const { companyId, dispatch, location } = this.props;

    const latitude = location != null ? location.coords.latitude : null;
    const longitude = location != null ? location.coords.longitude : null;

    const allShopsObject = new AllShopsRequestObject();
    allShopsObject.setUrlId(companyId);

    //   const nearbyShopsObject = new NearestShopRequestObject(latitude, longitude);
    //   nearbyShopsObject.setUrlId(companyId);

    // load all shops always
    dispatch(
      createAction("shops/loadAllShops")({
        object: allShopsObject,
        callback: this.updateShopsList,
      })
    );

    //   const { status } = await Permissions.getAsync(Permissions.LOCATION);
    //   if (latitude !== null && longitude !== null && status === 'granted') {
    //     this.setState({ isLoading: true });

    //     now load nearby shops
    //     dispatch(
    //       createAction('shops/loadNearbyShops')({
    //         object: nearbyShopsObject,
    //         callback: this.updateShopsList
    //       })
    //     );
    //   } else {
    //     dispatch(createAction('shops/clearNearbyShops')());
    //   }
  }

  updateShopsList = (eventObject) => {
    this.setState({ isLoading: false });
  };

  onPressOrderNow = async (id) => {
    const { location } = this.props;
    const latitude = location != null ? location.coords.latitude : null;
    const longitude = location != null ? location.coords.longitude : null;

    if (latitude !== null && longitude !== null) {
      const object = new SelectShopRequestObject(latitude, longitude);

      object.setUrlId(this.props.companyId);
      object.setShopId(id);

      const callback = this.onPressOrderNowCallback;
      const params = { object, callback };
      const action = createAction("shops/selectShop")(params);
      this.props.dispatch(action);
    } else {
      const object = new SelectShopRequestObject();
      object.setUrlId(this.props.companyId);
      object.setShopId(id);

      const callback = this.onPressOrderNowCallback;
      const params = { object, callback };
      const action = createAction("shops/selectShop")(params);
      this.props.dispatch(action);
    }
  };

  onPressShop = (data) => {
    this.setState({
      selectedShop: data,
    });
  };

  onPressOrderNowCallback = (eventObject) => {
    const {
      dispatch,
      navigation: { navigate },
    } = this.props;

    if (eventObject.success) {
      navigate("Home");
    }
  };

  getShopsList = () => {
    const { allShops, nearbyShops } = this.props;
    const { displayShopList, isSearching, searchResults } = this.state;

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
  //view
  mainView: {
    height: "100%",
    width: "100%",
    backgroundColor: LIGHT_GREY_BACKGROUND,
  },
  header: {
      height: alpha * 50,
      width: '100%',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: 'white',

  },
  headerText: {
      fontFamily: TITLE_FONT,
      fontSize: fontAlpha * 12
  }
});
