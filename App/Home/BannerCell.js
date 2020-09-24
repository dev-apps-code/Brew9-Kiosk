//
//  BannerCell
//  Brew9
//
//  Created by .
//  Copyright © 2018 brew9. All rights reserved.
//

import React from "react"
import { TouchableWithoutFeedback, Image, View, StyleSheet } from "react-native"
import { alpha, fontAlpha ,windowWidth} from "../Common/size";

export default class BannerCell extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    onBannerCellPress = () => {
        
        // this.props.onPressItem(this.props.item,this.props.index)
    }

    render() {
        return <TouchableWithoutFeedback
            onPress={this.onBannerCellPress} style={styles.bannercell}>
            <View
                navigation={this.props.navigation}
                style={styles.bannercell}>
                <Image
                source={{uri: this.props.bannerImage}}
                    style={styles.bannerImage}/> 
            </View>
        </TouchableWithoutFeedback>
    }
}

const styles = StyleSheet.create({
    bannercell: {
        backgroundColor: "red",
        
         height: 115 * alpha,
        flex: 1,
        width: windowWidth ,
    },
    bannerImage: {
        backgroundColor: "rgb(0, 178, 227)",
        resizeMode: "cover",
        height: 115 * alpha,
        width: windowWidth ,
    },
})
