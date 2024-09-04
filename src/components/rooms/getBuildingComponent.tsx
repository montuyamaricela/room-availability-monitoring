/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";

import CBAROOM from "./Cba";
import Pancho from "./Pancho";
import Hangar from "./Hangar";

export type BuildingName =
  | "PANCHO_HALL"
  | "MPG"
  | "HANGAR"
  | "OLD_CANTEEN"
  | "BSBA";
type BuildingComponent = React.FC;

const buildingComponents: Record<BuildingName, BuildingComponent> = {
  PANCHO_HALL: Pancho,
  MPG: CBAROOM,
  HANGAR: Hangar,
  OLD_CANTEEN: CBAROOM,
  BSBA: CBAROOM,
};

// Function to get the component based on building name
const getBuildingComponent = (
  building: BuildingName,
): React.ReactElement | null => {
  const Component = buildingComponents[building];
  return Component ? <Component /> : null;
};
export default getBuildingComponent;
