//
//  BannerCell
//  Brew9
//
//  Created by .
//  Copyright © 2018 brew9. All rights reserved.
//

import React from "react"
import { TouchableWithoutFeedback, Image, View, StyleSheet } from "react-native"
import { alpha, fontAlpha } from "../Common/size";

export default class BannerCell extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    onBannerCellPress = () => {
        
        this.props.onPressItem(this.props.item,this.props.index)
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
        width: "100%",
        height: 150 * alpha,
        flex: 1,
    },
    bannerImage: {
        backgroundColor: "transparent",
        resizeMode: "cover",
        height: 150 * alpha,
        marginLeft: 5 * alpha,
        marginRight: 5 * alpha,
        marginTop: 5 * alpha,
        marginBottom: 10 * alpha,
    },
})
