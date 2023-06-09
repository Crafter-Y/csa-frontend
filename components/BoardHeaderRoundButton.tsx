import { Pressable } from "react-native";
import React, { useRef } from "react";
import tw from "@/tailwind";
import { Image, ImageSource } from "expo-image";
import { useHover } from "react-native-web-hooks";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  imageSource:
    | string
    | number
    | string[]
    | ImageSource
    | ImageSource[]
    | null
    | undefined;
  onPress: () => void;
  style?: ClassInput;
};

const BoardHeaderRoundButton = ({ imageSource, onPress, style }: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable
      style={tw.style(
        {
          "bg-lightgrayNeutral": isHovered,
        },
        `items-center justify-center h-10 w-10 rounded-full`,
        style
      )}
      ref={ref}
      onPress={onPress}
    >
      <Image source={imageSource} style={tw`h-4 w-4`} />
    </Pressable>
  );
};

export default BoardHeaderRoundButton;
