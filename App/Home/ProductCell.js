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
  TouchableOpacity
} from "react-native";
import React from "react";
import { alpha, fontAlpha, windowWidth } from "../Common/size";
import { TITLE_FONT, NON_TITLE_FONT } from "../Common/common_style";

export default class ProductCell extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

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

  onSelectOptionPressed = () => {
    this.props.onCellPress(this.props.item, this.props.index);
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
            <Text adjustsFontSizeToFit numberOfLines={3} style={styles.titleText}>{this.props.productname}</Text>
            <Text style={styles.priceText}>
              ${parseFloat(this.props.productprice).toFixed(2)}
            </Text>
          </View>
          {this.props.productstatus != null && this.props.productstatus.length > 0 ?
            <View style={styles.soldView}>
              <Text style={styles.soldtextText}>{this.props.productstatus}</Text>
            </View>
            : null}

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
    marginLeft: 2 * alpha
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
    height: 175 * alpha,
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 1 * alpha,
    marginTop: 10 * alpha,
    marginBottom: 5 * alpha
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
    alignItems: "center"
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
    textAlign: "center"
  },
  titleText: {
    color: "rgb(54, 54, 54)",
    fontFamily: TITLE_FONT,
    fontSize: 10 * fontAlpha,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 1)"
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
    marginTop: 5 * alpha
  },
  priceText: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "rgb(0, 178, 227)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 3 * alpha
  },

  numberofitemText: {
    color: "rgb(255, 251, 251)",
    fontFamily: NON_TITLE_FONT,
    fontSize: 10 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "transparent"
  }
});
