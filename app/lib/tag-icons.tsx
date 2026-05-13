import type { IconType } from "react-icons/lib";
import { GiChiliPepper, GiSaltShaker, GiWrappedSweet, GiFishbone, GiWeightLiftingUp, GiNoodles, GiTooth } from "react-icons/gi";
import { TbLeaf, TbCircleCheck, TbDropletOff } from "react-icons/tb";
import { BsCupStraw } from "react-icons/bs";
import type { Tag } from "./data";

export const TAG_ICON: Record<Tag, IconType> = {
  Spicy:       GiChiliPepper,
  Salty:       GiSaltShaker,
  Sweety:      GiWrappedSweet,
  Mild:        TbLeaf,
  Normal:      TbCircleCheck,
  Fishy:       GiFishbone,
  Heavy:       GiWeightLiftingUp,
  Dry:         TbDropletOff,
  Chewy:       GiTooth,
  withDrink:   BsCupStraw,
  withRamyeon: GiNoodles,
};
