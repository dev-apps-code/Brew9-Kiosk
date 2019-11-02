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
  Image
} from "react-native";
import React from "react";
import { alpha, fontAlpha, windowWidth } from "../Common/size";
import {TITLE_FONT, NON_TITLE_FONT} from "../Common/common_style";

export default class CategoryCell extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onCategoryCellPress = () => {
    this.props.onSelectCategory(this.props.scrollIndex, this.props.index);
  };

  render() {
    const { categoryImage, categoryname } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.onCategoryCellPress}>
        <View style={styles.container}>
          <View style={styles.verticalLineView}></View>
          <View
            navigation={this.props.navigation}
            style={
              this.props.selected
                ? [styles.categorycell, styles.selected]
                : styles.categorycell
            }
          >
        
            <Text
              numberOfLines={3}
              style={
                this.props.selected ? styles.labelText_selected : styles.labelText
              }
            >
              {categoryname}
            </Text>
          </View>

        </View>
     
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  categorycell: {
    backgroundColor: "rgba(0,0,0,0)",
    flex: 1,
    marginTop:10*alpha,
    marginBottom:10*alpha,
    alignItems: "center",
    justifyContent: "center"
  },
  selected: {

  },
  verticalLineView:{
    backgroundColor: "black", 
    position: "absolute",
    right:0,
    top:0,
    height:"100%",
    width:1,
  },
  selectbarView: {
    backgroundColor: "rgb(0, 178, 227)",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 1 * alpha
  },
  labelText: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "rgb(78, 77, 77)",
    fontFamily: TITLE_FONT,
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    marginLeft: 10 * alpha,
    marginRight: 10 * alpha,
  },

  labelText_selected: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "rgb(0, 178, 227)",
    fontFamily: TITLE_FONT,
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    marginLeft: 10 * alpha,
    marginRight: 10 * alpha,
  },  
  // imageImage: {
  //   resizeMode: "center",
  //   backgroundColor: "transparent",
  //   width: 20 * alpha,
  //   height: 20 * alpha,
  //   marginLeft: 7 * alpha
  // }
});
