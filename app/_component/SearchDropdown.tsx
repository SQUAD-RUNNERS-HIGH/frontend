import React, { SetStateAction, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Pressable,
  Image,
} from "react-native";
import { Place } from "../_types";
import { useLocation } from "../_hooks/useLocation";
import { Region } from "react-native-maps";
import { z } from "zod";
import { userLocationSchema } from "../(tabs)/signup/_lib/signUpSchema";

interface BaseProps {
  results: Place[];
  setSelectedQuery: React.Dispatch<SetStateAction<string>>;
  setDropdownHeight?: React.Dispatch<SetStateAction<number>>;
  inputHeight?: number;
}

interface FormProps extends BaseProps {
  form: true;
  setSearchedLocation:  React.Dispatch<SetStateAction<z.infer<typeof userLocationSchema>>> ;

}

interface NonFormProps extends BaseProps {
  form?: boolean;
  setSearchedLocation: React.Dispatch<SetStateAction<Region>>; // 또는 다른 타입
}

type SearchInputProps =
  | {
      form: true;
      setSearchedLocation: React.Dispatch<
        SetStateAction<z.infer<typeof userLocationSchema>>
      >;
    } & BaseProps
  | {
      form?: false;
      setSearchedLocation: React.Dispatch<SetStateAction<Region>>;
    } & BaseProps;

const SearchDropdown = ({
  results,
  setSelectedQuery,
  setSearchedLocation,
  setDropdownHeight,
  inputHeight,
  form=false
}: SearchInputProps) => {
  const { setIsDropdownVisible } = useLocation();
  return (
    <View
      style={[styles.dropdowncontainer, {top: inputHeight? inputHeight: '100%'}]}
      pointerEvents="box-none"
      onLayout={(event) => {
        if (setDropdownHeight) {
          setDropdownHeight(event.nativeEvent.layout.height);
        }
      }}
    >
      <FlatList
        data={results}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: {item: Place}) => {
          return (
            <Pressable
              style={styles.resultItem}
              onPress={() => {
              // form 에서 사용될 경우
              if(form) {
                setSearchedLocation({latitude: item.geometry.location.lat,
                  longitude: item.geometry.location.lng, specificLocation: item.formatted_address});
              }
              // form 에서 사용되지 않았을경우
              else{
                const latitudeDelta =
                  item.geometry.viewport.northeast.lat -
                  item.geometry.viewport.southwest.lat;
                const longitudeDelta =
                  item.geometry.viewport.northeast.lng -
                  item.geometry.viewport.southwest.lng;
                const location = {
                  latitude: item.geometry.location.lat,
                  longitude: item.geometry.location.lng,
                  latitudeDelta,
                  longitudeDelta,
                };
                setSearchedLocation(location);
              }
                setSelectedQuery(item.formatted_address);
                setIsDropdownVisible(false);
            }}
            >
              <Image style={styles.resultIcon} source={{ uri: item?.icon }} />
              <Text style={styles.resultText}>{item.formatted_address}</Text>
            </Pressable>
          );
        }}
        style={[styles.dropdown, {maxHeight:200} ]}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdowncontainer: {
    width: "100%",
    maxHeight: 300, // 드롭다운 최대 높이 설정
    zIndex: 20,
    position: 'absolute',
  },
  dropdown: {
    flex: 1,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingVertical: 4,
  },
  resultIcon: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: "#ACACAC",
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  notFirst: {
    borderTopWidth: 1, // border-top: 1px
    borderTopColor: "#2D2D32", // border-top의 색상
  },
  resultText: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Open Sans",
    fontWeight: 600,
    verticalAlign: "middle",
  },
});

export default SearchDropdown;
