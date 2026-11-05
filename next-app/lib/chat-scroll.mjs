// 76px of slack avoids tiny layout/layout-rounding changes unpinning the reader.
export function isNearBottom({ scrollTop, scrollHeight, clientHeight }, threshold = 76) {
  return scrollHeight - (scrollTop + clientHeight) <= threshold;
}
