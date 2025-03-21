// metro.config.js (최신 설정)
const { getDefaultConfig } = require("@react-native/metro-config");

module.exports = {
  ...getDefaultConfig(__dirname),
  resolver: {
    sourceExts: ["jsx", "js", "ts", "tsx"], // 사용 확장자 추가
  },
};
