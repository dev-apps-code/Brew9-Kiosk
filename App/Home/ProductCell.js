//
//  ProductCell
//  Brew9
//
//  Created by [Author].
//  Copyright © 2018 brew9. All rights reserved.
//

import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { alpha, fontAlpha, windowWidth } from "../Common/size";
import {
  TITLE_FONT,
  NON_TITLE_FONT,
  PRIMARY_COLOR,
} from "../Common/common_style";

export default class ProductCell extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onProductCellPress = () => {
    // this.props.onCellPress(this.props.item, this.props.index);
  };

  onAddPressed = () => {
    this.props.onChangeQuantity(
      this.props.item,
      this.props.index,
      "add",
      false
    );
  };

  onRemovePressed = () => {
    this.props.onChangeQuantity(
      this.props.item,
      this.props.index,
      "remove",
      false
    );
  };

  renderStatusView = () => {
    let {
      productDiscountTagLabel,
      productDiscountTagColor,
      productDiscountTagTextColor,
      productDiscountedPrice,
      productstatus,
    } = this.props;

    let labelColor = productDiscountTagColor;
    let labelText = productDiscountTagLabel;
    let labelTagTextColor = productDiscountTagTextColor;
    if (productDiscountedPrice === "" || productDiscountedPrice === 0) {
      if (productstatus !== "") {
        labelColor = "rgb(0, 178, 227)";
        labelText = productstatus;
        labelTagTextColor = "#FFFFFF";
      } else {
        return (
          <View
            style={{
              height: alpha * 13,
              width: alpha * 30,
            }}
          />
        );
      }
    }

    let labelTextStyle = {
      fontFamily: NON_TITLE_FONT,
      fontSize: fontAlpha * 7,
      backgroundColor: labelColor,
      color: labelTagTextColor,
      paddingVertical: alpha * 2,
      paddingHorizontal: alpha * 4,
    };

    let triangleStyle = {
      ...styles.triangle,
      ...{ borderBottomColor: labelColor },
    };

    return (
      <View
        style={{
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={labelTextStyle}>{labelText}</Text>
          <View style={triangleStyle} />
        </View>
      </View>
    );
  };

  renderPrices = () => {
    let { productDiscountedPrice, productprice } = this.props;
    return productprice > 0 ? (
      <View style={styles.pricesView}>
        <Text style={styles.priceText}>
          ${parseFloat(productprice).toFixed(2)}
        </Text>
        {productDiscountedPrice ? (
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("./../../assets/images/apps.png")}
              style={styles.brew9Icon}
            />
            <Text style={styles.discountPriceText}>
              ${parseFloat(productDiscountedPrice).toFixed(2)}
            </Text>
          </View>
        ) : null}
      </View>
    ) : (
      <View style={{ height: alpha * 15 }} />
    );
  };

  onSelectOptionPressed = () => {
    this.props.onCellPress(this.props.item, this.props.index);
  };

  renderName = () => {
    let { index } = this.props;
    let style =
      index % 2 == 0
        ? styles.titleText
        : [styles.titleText, { width: alpha * 120 }];
    return (
      <Text adjustsFontSizeToFit numberOfLines={3} style={style}>
        {this.props.productname}
      </Text>
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onProductCellPress}>
        <View navigation={this.props.navigation} style={styles.productcell}>
          <Image
            source={{ uri: this.props.productimage }}
            style={styles.productimageImage}
          />

          <View style={styles.productDetail}>
            {this.renderStatusView()}
            {this.renderName()}
            {this.renderPrices()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  productDetail: {
    backgroundColor: "white",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    marginLeft: 2 * alpha,
  },
  lineText: {
    backgroundColor: "black",
    width: "70%",
    height: 1 * alpha,
  },
  productcell: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    // backgroundColor: "yellow",
    width: (windowWidth - 90) / 2 - 20 * alpha,
    height: 200 * alpha,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 1 * alpha,
    marginTop: 10 * alpha,
    marginBottom: 5 * alpha,
  },
  productimageImage: {
    resizeMode: "cover",
    backgroundColor: "white",
    width: 130 * alpha,
    height: 130 * alpha,
    marginLeft: 0 * alpha,
    marginBottom: 10 * alpha,
  },
  soldView: {
    position: "absolute",
    alignSelf: "center",
    width: 74 * alpha,
    bottom: 35 * alpha,
    height: 22 * alpha,
    justifyContent: "center",
    alignItems: "center",
  },
  soldtextText: {
    backgroundColor: "rgb(0, 178, 227)",
    color: "white",
    paddingLeft: 5 * alpha,
    paddingRight: 5 * alpha,
    fontFamily: TITLE_FONT,
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  titleText: {
    color: "rgb(54, 54, 54)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginBottom: alpha * 3,
    marginTop: alpha * 2,
  },
  descriptionText: {
    backgroundColor: "transparent",
    opacity: 0.39,
    color: "black",
    fontFamily: TITLE_FONT,
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    width: 180 * alpha,
    marginLeft: 1 * alpha,
    marginTop: 5 * alpha,
  },
  priceText: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "#363636",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontWeight: "bold",
  },
  discountPriceText: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "rgb(0, 178, 227)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontWeight: "bold",
  },

  numberofitemText: {
    color: "rgb(255, 251, 251)",
    fontFamily: NON_TITLE_FONT,
    fontSize: 10 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "transparent",
  },

  triangle: {
    position: "absolute",
    right: alpha * -8.5,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: alpha * 7,
    borderRightWidth: alpha * 7,
    borderBottomWidth: alpha * 3,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    // borderBottomColor: "skyblue",
    transform: [{ rotate: "90deg" }],
  },

  brew9Icon: {
    marginLeft: 10 * alpha,
    marginRight: 1 * alpha,
    height: alpha * 13,
    width: alpha * 13,
  },

  pricesView: {
    // alignItems:'flex-end',
    justifyContent: "center",
    flexDirection: "row",
  },
});
