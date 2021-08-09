import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { DraxProvider, DraxList } from 'react-native-drax';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import MMKVStorage, {useMMKVStorage} from "react-native-mmkv-storage";
import { useEffect } from 'react';
import {MyContext} from '../provider/MyProvider';

const MMKV = new MMKVStorage.Loader().initialize();

//icons
const plusIcon = <Icon name="plus-circle" size={64} color="#ffffff" />;
const cameraIcon = <Icon2 name="camera-outline"size={68} color="#ffffff" />;
const trashIcon = <Icon3 name="delete" size={60} color="#ffffff" />;

const Gallery = ({navigation, route}) => {
  const context = React.useContext(MyContext);
  const [orientation, setOrientation ] = React.useState("portrait")
  useEffect(() => {
    Dimensions.addEventListener('change', ({ window:{ width, height }}) => {
      if(width < height ){
        orientation === 'portrait' || orientation === null ? null : setOrientation('portrait')
      }else {
        orientation === 'landscape'|| orientation === null ? null: setOrientation('landscape')
      } 
    })
  })
  
  const [galleryMod, setGalleryMod] = useMMKVStorage("galleryMod", MMKV);
  const gridSize = 150;
  
  if(typeof route.params !== 'undefined'){
    if(route.params.galleryMode !== galleryMod){
      galleryMod === 'grid' ? setGalleryMod('list') : setGalleryMod('grid')
    }
  }
  
  function openThePicker(imgArr){
    ImagePicker.openPicker({
      includeBase64: true,
      freeStyleCropEnabled: true,
      cropping: true
    }).then(image => {
      context.setImages([ ...imgArr, image])  
    });
  }
  function openTheCamera(imgArr){
    ImagePicker.openCamera({
      includeBase64: true,
      freeStyleCropEnabled: true,
      cropping: true
    }).then(image => {
      context.setImages([ ...imgArr, image])  
    });
  }
  return (
  <> 
  {orientation === 'portrait' ? 
  MMKV.getString("galleryMod") === null ? setGalleryMod("list") : (galleryMod === "grid" ? 
    
    <View style={styles.container}>
    <FlatGrid
      itemDimension={gridSize}
      spacing={1}
      data={context.images === null ? [] :  context.images}
      style={styles.flatGrid}
      renderItem={({ item, index}) => (
        <TouchableOpacity 
          onPress={()=>{navigation.navigate('BigPicture', {item: item, index: index})}}>
            <Image style={styles.littleImage} source={{uri: `data:${item["mime"]};base64,${item["data"]}`}}></Image>
        </TouchableOpacity>
      )}
      keyExtractor={(item,) => item.size}
    />
    </View>
    
    :
    <DraxProvider>
      <View style={styles.container}>
        <DraxList
          style={styles.list}
          data={context.images}
          renderItemContent={({ item, index}) => (<>
              <TouchableOpacity 
                onPress={()=>{navigation.navigate('BigPicture', {item: item, index: index})}}>
                  <Image style={styles.image} source={{uri: `data:${item["mime"]};base64,${item["data"]}`}}></Image>
              </TouchableOpacity>
              </>
          )}
          onItemReorder={({ fromIndex, toIndex }) => {
            const newData = context.images.slice();
            newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
            context.setImages(newData)
          }}
          keyExtractor={(item) => item.data}
        />
      </View>
    </DraxProvider>
    )
    : 
    <View style={styles.container}>
      <FlatGrid
        itemDimension={gridSize}
        spacing={1}
        data={context.images === null ? [] :  context.images}
        style={styles.flatGrid}
        renderItem={({ item, index}) => (
          <TouchableOpacity 
            onPress={()=>{navigation.navigate('BigPicture', {item: item, index: index})}}>
              <Image style={styles.littleImageLandscape} source={{uri: `data:${item["mime"]};base64,${item["data"]}`}}></Image>
          </TouchableOpacity>
        )}
        keyExtractor={(item, rowItemIndex) => item.size}
      />
    </View>}
    
    {/* bottom three buttons trash - camera - plus */}
    <View style={{justifyContent: 'space-around',flexDirection: 'row', width: '100%', bottom: 0 , position: 'absolute',}}>
      <TouchableOpacity onPress={() => {
        context.images.length === 0 ? null :
        Alert.alert(
        "Confirmation",
        `${context.images.length} item${context.images.length > 1 ? "s": ""} will be deleted from list`,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => context.setImages([]) }
        ]
      );}}>
        <View >
          {trashIcon}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {openTheCamera(context.images === null ? []: context.images)}}>
          <View >
            {cameraIcon}
          </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {openThePicker(context.images === null ? []: context.images)} }>
          <View>
            {plusIcon}
          </View>
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
    image:{
      width:'85%',
      marginHorizontal:'7.5%',
      marginVertical:'2.5%',
      resizeMode:'cover',
      height:320,
      borderRadius: 16,
    },
    littleImage: {
      width: '100%',
      height: 200,
      resizeMode: 'stretch',
    },
    littleImageLandscape: {
      width: '100%',
      height: 150,
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
