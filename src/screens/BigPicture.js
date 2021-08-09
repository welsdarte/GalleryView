import React from 'react';
import { Alert, View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import MMKVStorage from 'react-native-mmkv-storage'
const MMKV = new MMKVStorage.Loader().initialize();
import FeatherIcon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import {MyContext} from '../provider/MyProvider';

const BigPicture = ({navigation, route}) => {
    
    const context = React.useContext(MyContext);
    const [orientation, setOrientation ] = React.useState("landscape")
    
    function detectOrientation (width, height) {
        if(width < height ){
            orientation === 'portrait' ? null : setOrientation('portrait')
        }else {
            orientation === 'landscape' ? null: setOrientation('landscape')
        } 
    }
    React.useEffect(() => {
        Dimensions.addEventListener('change', ({ window:{ width, height }}) => {
            detectOrientation(width, height)
        })
    })
    return(
        <>
        {orientation === 'portrait' ?
        <View style={styles.container}>
            <ReactNativeZoomableView
            maxZoom={3.5}
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
        :(
            <View style={styles.container}>
                <ReactNativeZoomableView
                maxZoom={3.5}
                minZoom={1}
                zoomStep={0.1}
                initialZoom={1}
                bindToBorders={true}
                onZoomAfter={this.logOutZoomState}
                >
                    <View style={styles.container}>
                        <Image resizeMode='contain' style={styles.imageLandscape} source={{uri: `data:${route.params.item["mime"]};base64,${route.params.item["data"]}`}}/>
                    </View>
                </ReactNativeZoomableView>
            </View>
        )
        }
        <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%',justifyContent: 'space-between', }}>
            <View style={{marginHorizontal: 30, marginVertical: 15}}>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        "Confirmation",
                        `Image will be deleted from gallery`,
                        [
                          {
                            text: "Cancel",
                            
                            style: "cancel"
                          },
                          { text: "OK", onPress: () => {context.deleteImageAt(route.params.index); navigation.navigate("Home")}
                             }
                        ]
                      )}}>
                    <FeatherIcon name="trash-2" size={60} color='white'/>
                </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: 30, marginVertical: 15}}>
                <TouchableOpacity onPress={() => {
                    ImagePicker.openCropper({
                        path: route.params.item['path'],
                        includeBase64: true,
                        freeStyleCropEnabled: true,
                      }).then(image => {
                          context.replaceImageAt(route.params.index, image)

                      }).then(()=>navigation.navigate("Home"));
                }}>
                    <FeatherIcon name="crop" size={60} color='white'/>
                </TouchableOpacity>
            </View>
        </View>
        </>  
    );
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
    imageLandscape:{
        resizeMode:'contain',
        flex: 1,
        width: '100%',
        height: 300,
        
    },
})

export default BigPicture;