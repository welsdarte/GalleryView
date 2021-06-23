import 'react-native-gesture-handler';
import React from 'react';
import { Button, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from './src/screens/Gallery';
import BigPictureScreen from './src/screens/BigPicture';

import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MMKVStorage from 'react-native-mmkv-storage';
const MMKV = new MMKVStorage.Loader().initialize();

import { useNavigation, CommonActions } from '@react-navigation/native';
import { useEffect } from 'react';

Feather.loadFont();
Entypo.loadFont();
Ionicons.loadFont();
AntDesign.loadFont();
SimpleLineIcons.loadFont();

const Stack = createStackNavigator();


const HeaderRight = () => {
  const navigation = useNavigation();
  [gMode, setGMode] = React.useState(null)
  useEffect(()=>{gMode === 'grid' ? setGMode("list") : setGMode("grid")}, [])
  if(gMode === null) setGMode(MMKV.getString("galleryMod")) 
  return (
    
    gMode === 'grid' ?
    <View style={{flexDirection: 'row', alignItems: 'center',marginRight: 10}}> 
      <SimpleLineIcons style={{alignSelf: 'center',position: 'absolute' }} name="grid" size={24} color='black' />
        <Button
          onPress={() => {
            navigation.dispatch(CommonActions.navigate("Home", {galleryMode: gMode}))
            gMode === 'list' ? setGMode("grid") : setGMode("list");
          }}
          title="      "
          color="green"
        />
    </View>
    :
    <View style={{flexDirection: 'row', alignItems: 'center',marginRight: 10}}> 
      <Ionicons style={{alignSelf: 'center',position: 'absolute' }} name="menu-outline" size={30} color='black' />
        <Button
          onPress={() => {gMode === 'list' ? setGMode("grid") : setGMode("list");
            ;navigation.dispatch(CommonActions.navigate("Home", {galleryMode: gMode}))}}
          title="      "
          color="green"
        />
    </View>
  );
};
const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          
          name="Home"
          component={GalleryScreen}
          options={{
            
            headerRight: () => <HeaderRight />,
          title: 'Gallery', headerStyle: {backgroundColor: '#ffffffff'}, headerTitleStyle:{fontWeight: 'bold', }}}
          
        />
        <Stack.Screen
          name="BigPicture"
          component={BigPictureScreen}
          options={{ title: 'Details', headerStyle: {backgroundColor: '#ffffffff'}, headerTitleStyle:{fontWeight: 'bold',}}}
        />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;



