import React from "react";
import { TailwindProvider } from "tailwind-rn";
import RootNavigator from "./navigator/RootNavigator";
import utilities from "./tailwind.json";

export default function App() {
  return (
    // @ts-ignore - type wrong somehow
    <TailwindProvider utilities={utilities}>
      <RootNavigator />
    </TailwindProvider>
  );
}
