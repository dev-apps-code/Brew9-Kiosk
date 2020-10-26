import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';
import {
  TITLE_FONT,
  DEFAULT_BORDER_RADIUS,
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

  renderShopName = () => {
    const {open, name} = this.props.details;
    const color = open ? '#00B2E3' : DISABLED_COLOR;
    return <Text style={[styles.shopName, {color}]}>{name}</Text>;
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
        {this.renderShopName()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  shopDetailView: {
    height: alpha * 50,
    backgroundColor: 'white',
    marginBottom: alpha * 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: alpha * 10,
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
  shopName: {
    color: 'rgb(54, 54, 54)',
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    marginRight: 10 * alpha,
    marginTop: 2 * alpha,
  },
});
