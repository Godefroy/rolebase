import {
  circleColor,
  defaultCircleColorHue,
} from '@rolebase/shared/helpers/circleColor'
import { GraphColorMode } from '../types'

const depthColorVariation = 5

export const getLightColor = (
  lightness: number,
  depth = 1,
  hue = defaultCircleColorHue
) => circleColor(lightness - (depth - 1) * depthColorVariation, hue)

export const getDarkColor = (
  lightness: number,
  depth = 1,
  hue = defaultCircleColorHue
) => circleColor(lightness + (depth - 1) * depthColorVariation, hue)

export const getColor = (
  mode: GraphColorMode,
  lightnessLight: number,
  lightnessDark: number,
  depth = 1,
  hue = defaultCircleColorHue
) =>
  mode === 'light'
    ? getLightColor(lightnessLight, depth, hue)
    : getDarkColor(lightnessDark, depth, hue)
