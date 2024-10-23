export function formattedBuilding(building: string) {
  const lowerCaseBuilding = building.toLowerCase();

  if (lowerCaseBuilding.includes("pancho")) {
    return "PANCHO HALL";
  } else if (lowerCaseBuilding.includes("cba")) {
    return "CBA";
  } else if (lowerCaseBuilding.includes("hangar")) {
    return "HANGAR";
  } else {
    return "MPG_OLDCANTEEN";
  }
}

export function formattedRoom(room: string) {
  if (room.includes("Hangar") || room.includes("MPG")) {
    return room;
  } else if (room.includes("Lab")) {
    return room;
  } else {
    if (room.split(" ").length > 1) {
      return room.split(" ")[1];
    } else {
      return room;
    }
  }
}
