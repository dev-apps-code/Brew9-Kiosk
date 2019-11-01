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
import { alpha, fontAlpha } from "../Common/size";
import {TITLE_FONT, NON_TITLE_FONT} from "../Common/common_style";

export default class ProductCell extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onProductCellPress = () => {
    this.props.onCellPress(this.props.item, this.props.index);
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
            source={require("../../assets/images/background.png")}
            style={{
              overflow: "hidden",
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              width: "100%",
              height: "100%"
            }}
          />

          <View
            pointerEvents="box-none"
            style={{
              width: 74 * alpha,
              height: 15 * alpha,
              marginLeft: 3 * alpha,
              marginTop: 4 * alpha
            }}
          >
            {/* <View
              pointerEvents="box-none"
              style={{
                position: "absolute",
                left: 0,
                top: 0 * alpha,
                bottom: 0 * alpha,
                justifyContent: "center"
              }}
            >
              <Image
                source={{ uri: this.props.productimage }}
                style={styles.productimageImage}
              />
            </View> */}
            {!this.props.productenable && (
              <View style={styles.soldView}>
                <Text style={styles.soldtextText}>Sold Out</Text>
              </View>
            )}
          </View>

          <View style={styles.lineText}>
            <View style={styles.row}>
              <View style={styles.wrap}>
                <View style={styles.wrapColumn}>
                  <Text adjustsFontSizeToFit numberOfLines={3} style={styles.titleText}>{this.props.productname}</Text>
                </View>
                <View style={styles.wrapColumn2}>
                  <Text style={styles.titleText2}>
                    {/* {this.props.item.menu_remarks} */}
                    {/* {this.props.productStatus} */}
                    Status
                  </Text>
                </View>
              </View>
              <View style={styles.wrap2}>
                <Text style={styles.priceText}>
                  {parseFloat(this.props.productprice).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>          
          <View style={styles.detailsView}>
            <View
              pointerEvents="box-none"
              style={{
                position: "absolute",
                left: 0,
                top: 0 * alpha,
                bottom: 0 * alpha,
                marginTop: 0 * alpha,
                justifyContent: "center"
              }}
            >
              <Image
                source={{ uri: this.props.productimage }}
                style={styles.productimageImage}
              />
            {/* <View style={{width:"100%",height:20*alpha,backgroundColor:'red'}}></View> */}
            </View>
      
          </View>
          
          <View style={styles.lineText}></View>          
          
        </View>
        
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    marginLeft: 2 * alpha
  },
  wrap: {
    flex: 4,
    width: "30%",
    height: 50 * alpha
    // backgroundColor: "red"
  },
  wrap2: {
    flex: 2,
    alignItems: "flex-end",
    justifyContent: "center",
    // backgroundColor: "green",
    height: 50 * alpha
  },
  wrapColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    // backgroundColor: "yellow",
    height: 100 * alpha
  },
  wrapColumn2: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
    // backgroundColor: "purple",
    height: 100 * alpha
  },
  lineText: {
    backgroundColor: "black",
    width: "70%",
    height: 1 * alpha,
    marginLeft: 10 * alpha
  },
  productcell: {
    backgroundColor: "transparent",
    width: "50%",
    height: 200 * alpha,
    flexDirection: "column",
    alignItems: "flex-start"
  },
  productimageImage: {
    backgroundColor: "transparent",
    resizeMode: "cover",
    width: 80 * alpha,
    height: 100 * alpha,
    marginLeft: 60 * alpha,
    marginTop: 180 * alpha
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
    backgroundColor: "transparent",
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 13 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center"
  },
  detailsView: {
    backgroundColor: "transparent",
    width: "60%",
    height: 46 * alpha,
    alignItems: "flex-start"
  },
  titleText: {
    color: "rgb(54, 54, 54)",
    fontFamily: "ClanPro-MediumItalic",
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "transparent",
    marginLeft: 1 * alpha,
    fontStyle: "italic"
  },
  titleText2: {
    color: "rgb(54, 54, 54)",
    fontFamily: TITLE_FONT,
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
    color: "rgb(54, 54, 54)",
    fontFamily: NON_TITLE_FONT,
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "left",
    width: "70%",
    fontFamily: "SFProText-MediumItalic"
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
