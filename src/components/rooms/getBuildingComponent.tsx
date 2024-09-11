/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";

import CBAROOM from "./Cba";
import Pancho from "./Pancho";
import Hangar from "./Hangar";
import GenRooms from "./GenRooms";

export type BuildingName = "PANCHO_HALL" | "BSBA" | "HANGAR" | "MPG_OLDCANTEEN";
type BuildingComponent = React.FC;

const buildingComponents: Record<BuildingName, BuildingComponent> = {
  PANCHO_HALL: Pancho,
  BSBA: CBAROOM,
  HANGAR: Hangar,
  MPG_OLDCANTEEN: GenRooms,
};

// Function to get the component based on building name
const getBuildingComponent = (
  building: BuildingName,
): React.ReactElement | null => {
  const Component = buildingComponents[building];
  return Component ? <Component /> : null;
};
export default getBuildingComponent;
