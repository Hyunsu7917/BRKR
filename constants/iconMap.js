export const icons = [
  { label: "Magnet", icon: require("@/assets/blueprint-icons/Magnet.png") },
  { label: "Nanobay", icon: require("@/assets/blueprint-icons/Nanobay.png") },
  { label: "Onebay", icon: require("@/assets/blueprint-icons/Onebay.png") },
  { label: "Twobay", icon: require("@/assets/blueprint-icons/Twobay.png") },
  { label: "SampleCase", icon: require("@/assets/blueprint-icons/Samplecase.png") },
  { label: "LN2 Dewar", icon: require("@/assets/blueprint-icons/LN2Dewar.png") },
  { label: "Prodigy unit", icon: require("@/assets/blueprint-icons/ProdigyUnit.png") },
  { label: "CryoPlatform", icon: require("@/assets/blueprint-icons/CryoPlatform.png") },
  { label: "He Cylinder", icon: require("@/assets/blueprint-icons/HeCylinder.png") },
  { label: "Indoor unit", icon: require("@/assets/blueprint-icons/IndoorUnit.png") },
  { label: "HPPR", icon: require("@/assets/blueprint-icons/HPPR.png") },
  { label: "BCU", icon: require("@/assets/blueprint-icons/BCU.png") },
  { label: "Workstation Desk", icon: require("@/assets/blueprint-icons/WorkstationDesk.png") },
];
export const iconMap = Object.fromEntries(
  icons.map((item) => [item.label, item.icon])
);