import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, MaskedViewBase } from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import MMKVStorage, { useMMKVStorage } from 'react-native-mmkv-storage'
const MMKV = new MMKVStorage.Loader().initialize();



const BigPicture = ({navigation, route}) => {
    return(
        <>
        <View style={styles.container}>
            <ReactNativeZoomableView
            maxZoom={1.5}
            minZoom={1}
            zoomStep={0.1}
            initialZoom={1}
            bindToBorders={true}
            onZoomAfter={this.logOutZoomState}
            >
                <View style={styles.container}>
                    <Image style={styles.image} source={{uri: `data:${route.params.item["mime"]};base64,${route.params.item["data"]}`}}/>
                </View>
            </ReactNativeZoomableView>
            
        </View>
        
        
        </>
    );
}

function deleteImageAt(index){
    console.log("deleteImageAt started ...")
    var newArr = MMKV.getArray("imgArr");
    console.log("newArrSize ", newArr.length)
    newArr = newArr.slice(0, index).concat(newArr.slice(index + 1));
    MMKV.setArray("imgArr", newArr);
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'black',
        flex: 1,
    },
    image:{
        resizeMode:'contain',
        width:'100%',
        height: 700,
        flexDirection:'row',
        
    },
})

export default BigPicture;