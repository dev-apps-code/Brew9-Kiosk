//
//  CategoryCell
//  Brew9
//
//  Created by [Author].
//  Copyright © 2018 brew9. All rights reserved.
//

import {
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React from "react";
import { alpha, fontAlpha, windowWidth } from "../Common/size";
import { TITLE_FONT, NON_TITLE_FONT } from "../Common/common_style";

export default class CategoryCell extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onCategoryCellPress = () => {
    this.props.onSelectCategory(this.props.scrollIndex, this.props.index);
  };

  render() {
    const { categoryImage, categoryname, label } = this.props;
    let iconStyle =
      categoryname === "Signature Coffee"
        ? {
            resizeMode: "contain",
            backgroundColor: "transparent",
            width: 12 * alpha,
            height: 12 * alpha,
          }
        : styles.categoryIconImage;
    return (
      <TouchableWithoutFeedback onPress={this.onCategoryCellPress}>
        <View
          navigation={this.props.navigation}
          style={
            this.props.selected
              ? styles.categorycell_selected
              : styles.categorycell
          }
        >
          {this.props.selected ? <View style={styles.selectbarView} /> : null}
          <View
            style={{
              flex: 1,
              paddingLeft: 7 * alpha,
              paddingTop: 5 * alpha,
              marginBottom: 7 * alpha,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {categoryImage && (
                <Image
                  style={iconStyle}
                  source={{ uri: categoryImage }}
                />
              )}
              {label != null && label != "" && (
                <View style={styles.promoBox}>
                  <Text style={styles.promoBoxText}>{label}</Text>
                </View>
              )}
            </View>

            <Text
              style={
                this.props.selected && categoryImage
                  ? styles.labelImageText_selected
                  : !this.props.selected && categoryImage
                  ? styles.labelImageText
                  : this.props.selected
                  ? styles.labelText_selected
                  : styles.labelText
              }
            >
              {categoryname}
            </Text>
            {/* </Text> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  promoBox: {
    backgroundColor: "#FDE9F1",
    borderTopLeftRadius: 2 * alpha,
    borderBottomLeftRadius: 2 * alpha,
    alignItems: "center",
    justifyContent: "center",
    height: 12 * alpha,
    paddingVertical: 1 * alpha,
    paddingHorizontal: 3 * alpha,

    minWidth: 0,
    maxWidth: 60 * alpha,
  },
  promoBoxText: {
    color: "#F05071",
    fontFamily: TITLE_FONT,
    fontSize: 7 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "right",
  },
  categorycell: {
    backgroundColor: "transparent",
    width: "100%",
    // height: 54 * alpha,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  categorycell_selected: {
    backgroundColor: "white",
    width: "100%",
    flex: 1,
    // height: 54 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selectbarView: {
    backgroundColor: "rgb(0, 178, 227)",
    width: 3 * alpha,
    height: "100%",
  },
  textWrapper: {
    flex: 1,
    width: "100%",
  },
  labelText: {
    backgroundColor: "transparent",
    color: "rgb(135, 135, 135)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    width: "100%",
    flex: 1,
    marginRight: 7 * alpha,
    flexWrap: "wrap",
  },
  labelImageText: {
    backgroundColor: "transparent",
    color: "rgb(135, 135, 135)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    flex: 1,
    marginLeft: 2 * alpha,
    marginRight: 7 * alpha,
    flexWrap: "wrap",
  },
  labelText_selected: {
    backgroundColor: "transparent",
    color: "rgb(54, 54, 54)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    flex: 1,
    marginRight: 7 * alpha,
    flexWrap: "wrap",
  },
  labelImageText_selected: {
    backgroundColor: "transparent",
    color: "rgb(54, 54, 54)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    flex: 1,
    marginLeft: 2 * alpha,
    marginRight: 7 * alpha,
    flexWrap: "wrap",
  },
  categoryIconImage: {
    resizeMode: "contain",
    backgroundColor: "transparent",
    width: 16 * alpha,
    height: 16 * alpha,
  },
});
