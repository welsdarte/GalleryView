// TO-DO
// bottomshown true iken yapılan scrollar fadeOutDown animationı geciktirmeli
// resimleri tek tek silebilme ozelligi

import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  
} from 'react-native';
import { DraxProvider, DraxList } from 'react-native-drax';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import MMKVStorage, {create, useMMKVStorage} from "react-native-mmkv-storage";
import * as Animatable from 'react-native-animatable';

const MMKV = new MMKVStorage.Loader().initialize();
export const useStorage = create(MMKV); 

//icons
const plusIcon = <Icon name="plus-circle" size={64} color="#ffffff" />;
const cameraIcon = <Icon2 name="camera-outline"size={68} color="#ffffff" />;
const trashIcon = <Icon3 name="delete" size={60} color="#ffffff" />;
export const changeMode = () => {
  
}
const Gallery = ({navigation, route}) => {
  
  const [imgArr, setImgArr] = useMMKVStorage("imgArr", MMKV)
  const [galleryMod, setGalleryMod] = useMMKVStorage("galleryMod", MMKV);
  const [bottomShow, setBottomShow] = React.useState(false);
  const [fadeOutDownIsNow, setFadeOutDownIsNow] = React.useState(false);
  const [extendShowTime, setExtendShowTime] = React.useState(false);
  const gridSize = 200;
  
  if(typeof route.params !== 'undefined'){
    if(route.params.galleryMode !== galleryMod){
     galleryMod === 'grid' ? setGalleryMod('list') : setGalleryMod('grid')
    }
    
  }
  const bottomAnimationRef = React.useRef(null);
  const _onScrollBegin = () => {
    if( ! bottomShow){
      if(bottomAnimationRef){
        bottomAnimationRef.current?.zoomInUp(600)
      }
    }else{
      setExtendShowTime(true)
    }setBottomShow(true);
  }
  var id;
  const _onScrollEnd = () => {
    if( bottomShow && !fadeOutDownIsNow){
      setFadeOutDownIsNow(true)
      setTimeout(function() {setBottomShow(false); setFadeOutDownIsNow(false)}, 3600)
      id = setTimeout(function(){
        if(bottomAnimationRef){
          bottomAnimationRef.current?.fadeOutDown(600)
        }
      },
      3000);
    }
  }
    
  
  return (
  <> 
  
  {MMKV.getString("galleryMod") === null ? setGalleryMod(false) : (galleryMod === "grid" ? 
    <>
    
    <FlatGrid
      onScrollBeginDrag={_onScrollBegin}
      onScrollEndDrag={_onScrollEnd}
      itemDimension={gridSize}
      spacing={1}
      data={imgArr}
      style={styles.flatGrid}
      renderItem={({ item, index}) => (
        <TouchableOpacity 
          onPress={()=>{navigation.navigate('BigPicture', {item: item, index: index})}}>
            <Image style={styles.littleImage} source={{uri: `data:${item["mime"]};base64,${item["data"]}`}}></Image>
        </TouchableOpacity>
      )}
      keyExtractor={(item, rowItemIndex) => item.size}
    /> 
    </>
    : 
    <DraxProvider>
      <View style={styles.container}>
        <DraxList
          
          onScrollBeginDrag={() => {_onScrollBegin()}}
          onScrollEndDrag={() => {_onScrollEnd()}}
          style={styles.list}
          data={imgArr}
          renderItemContent={({ item, index}) => (<>
              <TouchableOpacity 
                onPress={()=>{navigation.navigate('BigPicture', {item: item, index: index})}}>
                  <Image style={styles.image} source={{uri: `data:${item["mime"]};base64,${item["data"]}`}}></Image>
              </TouchableOpacity>
              </>
          )}
          onItemReorder={({ fromIndex, toIndex }) => {
            const newData = imgArr.slice();
            newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
            setImgArr(newData);
          }}
          keyExtractor={(item) => item.data}
        />
      </View>
    </DraxProvider>
    )
    }
    
    
    {/* bottom three buttons trash - camera - plus */}
    <Animatable.View animation="fadeOutDown"duration={1}ref={bottomAnimationRef} style={{justifyContent: 'space-around',flexDirection: 'row', width: '100%', bottom: 0 , position: 'absolute',}}>
      <TouchableOpacity onPress={() => {
        imgArr.length === 0 ? null :
        Alert.alert(
        "Confirmation",
        `${imgArr.length} item${imgArr.length > 1 ? "s": ""} will be deleted from list`,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => setImgArr([]) }
        ]
      );}}>
        <Animatable.View >
          {trashIcon}
        </Animatable.View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {openTheCamera()}}>
          <Animatable.View >
            {cameraIcon}
          </Animatable.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {openThePicker(imgArr === null ? []: imgArr)} }>
          <Animatable.View>
            {plusIcon}
          </Animatable.View>
      </TouchableOpacity>
    </Animatable.View>
    </>
  );
}


function openThePicker(imgArr){
  ImagePicker.openPicker({
    includeBase64: true,
    freeStyleCropEnabled: true,
    cropping: true
  }).then(image => {
    MMKV.setArray("imgArr", [ ...imgArr, image])  
  });
}
function openTheCamera(){
  ImagePicker.openCamera({
    includeBase64: true,
    freeStyleCropEnabled: true,
    cropping: true
  }).then(image => {
    MMKV.setArray("imgArr", [ ...imgArr, image])  
  });
}

const styles = StyleSheet.create({
    image:{
      width:'85%',
      marginHorizontal:'7.5%',
      marginVertical:'2.5%',
      resizeMode:'cover',
      height:350,
      borderRadius: 16,
    },
    littleImage: {
      width: '100%',
      height: 200,
      resizeMode: 'stretch',
    },
    container: {
      flex: 1,
      backgroundColor: '#101010',    
    },
    list: {
      flex: 1,
      
    },
    flatGrid:{
      backgroundColor: '#101010',
      flex: 1,
    }
});

export default Gallery;
