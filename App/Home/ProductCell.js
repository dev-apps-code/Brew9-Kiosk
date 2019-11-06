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
import { alpha, fontAlpha ,windowWidth} from "../Common/size";
import {TITLE_FONT, NON_TITLE_FONT} from "../Common/common_style";

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
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  productDetail: {
backgroundColor:"white",
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
    width: (windowWidth-90)/2 - 20 *alpha,
    height: 160 * alpha,
    flexDirection: "column",
    alignItems: "center",
    marginLeft:1*alpha,
    marginTop: 10 * alpha,
    marginBottom: 5 * alpha
  },
  productimageImage: {    
    resizeMode: "cover",
    backgroundColor: "white",
    width: 130 * alpha,
    height: 130 * alpha,
    marginLeft: 0 * alpha,
    marginBottom: 5 * alpha,
  },
  soldView: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    position: "absolute",
    left: 5,
    width: 74 * alpha,
    top: 62 * alpha,
    height: 22 * alpha,
    justifyContent: "center",
    alignItems: "center"
  },
  soldtextText: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 13 * fontAlpha,
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
  titleText2: {
    color: "rgb(54, 54, 54)",
    fontFamily: TITLE_FONT,
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginLeft: 1 * alpha
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
  addButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    right: 7 * alpha,
    width: 20 * alpha,
    bottom: 1 * alpha,
    height: 20 * alpha
  },
  addButtonText: {
    color: "black",
    fontFamily: ".SFNSText",
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left"
  },
  addButtonImage: {
    resizeMode: "contain"
  },
  selectoptionView: {
    backgroundColor: "transparent",
    position: "absolute",
    right: 0 * alpha,
    width: 61 * alpha,
    bottom: 0 * alpha,
    height: 28 * alpha
  },
  optionButton: {
    backgroundColor: "rgb(0, 178, 227)",
    borderRadius: 10 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    right: 6 * alpha,
    width: 55 * alpha,
    bottom: 0 * alpha,
    height: 20 * alpha
  },
  optionButtonText: {
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left"
  },
  optionButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha
  },
  badgeView: {
    backgroundColor: "rgb(0, 178, 227)",
    borderRadius: 7 * alpha,
    borderWidth: 1 * alpha,
    borderColor: "white",
    borderStyle: "solid",
    position: "absolute",
    right: 0 * alpha,
    width: 14 * alpha,
    bottom: 13 * alpha,
    height: 15 * alpha,
    justifyContent: "center",
    alignItems: "center"
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
