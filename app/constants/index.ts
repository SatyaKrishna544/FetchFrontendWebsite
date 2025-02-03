import { Dimensions } from "react-native";

export const PAGE_SIZE = 15;
export const PAGE_DISPLAY_LIMIT = 5;

export const SORT_BY_NAME = [
  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },
];

export const SORT_BY_BREED = [
  { label: "Breed (A-Z)", value: "breed:asc" },
  { label: "Breed (Z-A)", value: "breed:desc" },
];

export const SORT_BY_ZIP = [
  { label: "ZIP Code (0-9)", value: "zip:asc" },
  { label: "ZIP Code (9-0)", value: "zip:desc" },
];

export const AGE_RANGES = [
  { label: "All Ages", value: "all" },
  { label: "Puppies (0-1 year)", value: "0-1" },
  { label: "Young (1-3 years)", value: "1-3" },
  { label: "Adult (3-7 years)", value: "3-7" },
  { label: "Senior (7+ years)", value: "7+" },
];

export const DEFAULT_SORT = "breed:asc";
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const CARD_MARGIN = 8;
export const CARDS_PER_ROW = 5;
export const CARD_WIDTH = (SCREEN_WIDTH - 40 - (CARDS_PER_ROW * CARD_MARGIN * 2)) / CARDS_PER_ROW;
