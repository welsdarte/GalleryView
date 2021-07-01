import 'react-native-gesture-handler';
import React from 'react';
import { Button, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from './src/screens/Gallery';
import BigPictureScreen from './src/screens/BigPicture';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MMKVStorage from 'react-native-mmkv-storage';
const MMKV = new MMKVStorage.Loader().initialize();

import { useNavigation, CommonActions } from '@react-navigation/native';
import { useEffect } from 'react';

import {MyProvider} from './src/provider/MyProvider';

Feather.loadFont();
Ionicons.loadFont();
AntDesign.loadFont();
SimpleLineIcons.loadFont();

const Stack = createStackNavigator();


const HeaderRight = () => {
  const navigation = useNavigation();
  [gMode, setGMode] = React.useState(null)
  useEffect(()=>{gMode === 'grid' ? setGMode("list") : setGMode("grid")}, [])
  if(gMode === null && MMKV.getString("galleryMod") === null) setGMode("grid")
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
          color="rgba(20,20,20,0)"
          style={{ elevation : 0}}
          
        />
    </View>
    :
    <View style={{flexDirection: 'row', alignItems: 'center',marginRight: 10}}> 
      <Ionicons style={{alignSelf: 'center',position: 'absolute' }} name="menu-outline" size={30} color='black' />
        <Button
          onPress={() => {gMode === 'list' ? setGMode("grid") : setGMode("list");
            ;navigation.dispatch(CommonActions.navigate("Home", {galleryMode: gMode}))}}
          title="      "
          color="rgba(20,20,20,0)"
          style={{ elevation : 0}}
        />
    </View>
  );
};
const App = () => {
  MMKV.setString("galleryMod", "list")
  return (
    <MyProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            
            name="Home"
            component={GalleryScreen}
            options={{
              
              headerRight: () => MMKV.getString("orientation") === 'landscape' ? null : <HeaderRight />,
            title: 'Gallery', headerStyle: {backgroundColor: '#ffffffff'}, headerTitleStyle:{fontWeight: 'bold', }}}
            
          />
          <Stack.Screen
            name="BigPicture"
            component={BigPictureScreen}
            options={{ title: 'Details', headerStyle: {backgroundColor: '#ffffffff'}, headerTitleStyle:{fontWeight: 'bold',}}}
          />

          
        </Stack.Navigator>
      </NavigationContainer>
    </MyProvider>

  );
};

export default App;



