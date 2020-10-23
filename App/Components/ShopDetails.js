import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import {
  TITLE_FONT,
  NON_TITLE_FONT,
  LIGHT_GREY,
  DEFAULT_BORDER_RADIUS,
  TINT_COLOR,
  DISABLED_COLOR,
} from '../Common/common_style';
import {alpha, fontAlpha} from '../Common/size';

@connect(({members, shops}) => ({
  currentUser: members.profile,
  shop: shops.selectedShop,
}))
export default class ShopDetails extends Component {
  constructor(props) {
    super(props);
  }

  renderAvailablity = () => {
    const {open, name} = this.props.details;
    const color = open ? '#00B2E3' : DISABLED_COLOR;
    const viewStyle = {...styles.shopName, ...{borderColor: color}};
    const textStyle = {...styles.shopName, ...{color}};
    return <Text style={textStyle}>{name}</Text>;
  };

  render() {
    const {details, onPressOrderNow, shop} = this.props;
    const {open, id} = details;
    const itemStyle = shop && shop.id === id ? styles.highlighted : {};
    return (
      <TouchableOpacity
        disabled={!open}
        style={[styles.shopDetailView, itemStyle]}
        onPress={() => onPressOrderNow(id)}>
        {this.renderAvailablity()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  highlighted: {
    borderWidth: 1,
    borderColor: '#00B2E3',
  },
  shopDetailView: {
    height: alpha * 130,
    backgroundColor: 'white',
    marginBottom: alpha * 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: alpha * 10,
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
  availabilityView: {
    height: alpha * 16,
    width: alpha * 45,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3 * alpha,
  },
  detailsView: {
    flex: 4,
    flexWrap: 'wrap',
  },
  orderNowView: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailView: {
    flexDirection: 'row',
  },
  detailTextContainer: {
    flexDirection: 'row',
    paddingRight: 10,
    height: alpha * 30,
    // alignItems: 'center',
    justifyContent: 'flex-start',
  },
  orderButton: {
    width: '100%',
    height: alpha * 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    height: alpha * 15,
    width: alpha * 15,
    position: 'absolute',
    right: alpha * 4,
    bottom: alpha * 4,
  },
  accessButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessView: {
    flexDirection: 'row',
    paddingHorizontal: alpha * 20,
  },
  //text
  availabilityText: {
    fontSize: fontAlpha * 9,
    color: '#00B2E3',
    fontFamily: TITLE_FONT,
  },
  shopName: {
    color: 'rgb(54, 54, 54)',
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    marginRight: 10 * alpha,
    marginTop: 2 * alpha,
  },
  serviceInfoDetails: {
    fontSize: 9 * fontAlpha,
    fontFamily: NON_TITLE_FONT,
    marginBottom: 10 * alpha,
    marginTop: 4 * alpha,
    color: '#363636',
  },
  detailText: {
    color: LIGHT_GREY,
    // flexWrap: 'wrap',
    fontSize: 11 * fontAlpha,
    fontFamily: NON_TITLE_FONT,
    width: '95%',
  },
  orderNowText: {
    color: TINT_COLOR,
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
  },

  //image
  pinImage: {
    tintColor: LIGHT_GREY,
    width: 8 * alpha,
    height: 11 * alpha,
    marginRight: alpha * 7,
    marginTop: alpha * 2,
  },
  clockImage: {
    tintColor: LIGHT_GREY,
    width: 10 * alpha,
    height: 10 * alpha,
    marginRight: alpha * 8,
    marginTop: alpha * 2,
  },
  favoriteImage: {
    width: 13 * alpha,
    height: 11 * alpha,
    // position: 'absolute',
    // right: 0,
    // bottom: 1
  },
});
