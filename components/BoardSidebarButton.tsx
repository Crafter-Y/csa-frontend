import { View, Text, Pressable } from "react-native";
import React, { useRef } from "react";
import { Image } from "expo-image";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";

type Props = {
  icon: string;
  text: string;
  pressAction: () => void;
};

const BoardSidebarButton = ({ icon, text, pressAction }: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable
      style={tw`justify-between items-center mb-1 flex-row py-4`}
      ref={ref}
      onPress={pressAction}
    >
      <View></View>
      <View style={tw`flex-row items-center gap-2`}>
        <Image source={icon} style={tw`h-6 w-6`} />
        <Text
          style={tw.style({
            underline: isHovered,
            "opacity-80": isHovered,
            "opacity-95": !isHovered,
          })}
        >
          {text}
        </Text>
      </View>

      <View
        style={tw.style(
          {
            "bg-blueAccent": isHovered,
          },
          `w-1 h-8 rounded-l-md`
        )}
      ></View>
    </Pressable>
  );
};

export default BoardSidebarButton;
