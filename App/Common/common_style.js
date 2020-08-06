import { windowWidth, alpha } from "./size";
import { StyleSheet } from "react-native";

export const TITLE_FONT = "ClanPro-News";
export const NON_TITLE_FONT = "ClanPro-Book";
export const LIGHT_GREY_BACKGROUND = 'rgb(243, 243, 243)';
export const LIGHT_GREY = 'rgb(130, 130, 130)';
export const TINT_COLOR = 'rgb(0, 194, 236)';
export const DISABLED_COLOR = 'rgb(191, 191, 191)';
export const DEFAULT_BORDER_RADIUS = 6 * alpha;

export const commonStyles = StyleSheet.create({
  lightGraySeparator: {
    backgroundColor: "blue",
    height: 5 * alpha,
    width: windowWidth
  }
});
