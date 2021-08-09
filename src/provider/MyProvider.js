import React, {useState} from 'react';
import MMKVStorage,{ create,} from 'react-native-mmkv-storage';
const MMKV = new MMKVStorage.Loader().initialize();
export const useStorage = create(MMKV); 
const MyContext = React.createContext();

const MyProvider = ( props ) => {
    
    const [images, setImages] = useState(MMKV.getArray("imgArr") === null ? [] : MMKV.getArray("imgArr"))
    const [ori, setOri] = useState("portrait")
    MMKV.setArray("imgArr", images);
    MMKV.setString("orientation", ori);
    function deleteImageAt(index){
        var newArr = [...images];
        newArr.splice(index, 1)
        setImages(newArr);
    }
    function replaceImageAt( index, image) {
        var newArr = [...images];
        newArr.splice(index, 1, image)
        setImages(newArr)
    }
    
    return(
        <MyContext.Provider
            value={{
                images,
                setImages,
                deleteImageAt,
                replaceImageAt,
                ori
            }}       
        >
            {props.children}
        </MyContext.Provider>
    ) 
}

export {MyProvider, MyContext}

