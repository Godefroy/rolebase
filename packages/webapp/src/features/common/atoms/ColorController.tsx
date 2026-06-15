import { TriangleDownIcon } from '@chakra-ui/icons'
import {
  Collapse,
  Flex,
  Grid,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from '@chakra-ui/react'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { defaultCircleColorHue } from '@rolebase/shared/helpers/circleColor'
import React, { useMemo } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Switch from './Switch'

interface Props<Values extends FieldValues> {
  name: Path<Values>
  control: Control<Values>
  children: string
}

const hueToColor = (hue: number) => `hsl(${hue} 97% 75%)`

export default function ColorController<Values extends FieldValues>({
  name,
  control,
  children,
}: Props<Values>) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()

  // Determines colors palette from roles colors
  const palette = useMemo(
    () =>
      orgData &&
      [
        ...new Set(
          orgData.roles.map((role) => role.colorHue).filter(Boolean) as number[]
        ),
      ].sort((a, b) => a - b),
    [orgData]
  )

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <Switch
            isChecked={typeof field.value === 'number'}
            onChange={() =>
              field.onChange(field.value ? null : defaultCircleColorHue)
            }
          >
            {children}
          </Switch>
          <Collapse in={typeof field.value === 'number'} animateOpacity>
            <Flex alignItems="center" h="50px">
              <Slider
                aria-label=""
                min={0}
                max={360}
                step={1}
                defaultValue={defaultCircleColorHue}
                value={field.value || 0}
                my={3}
                onChange={(value) => field.onChange(value)}
              >
                <SliderTrack bgGradient="linear(to-r, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)">
                  <SliderFilledTrack bg="transparent" />
                </SliderTrack>
                <SliderThumb boxSize="1.8rem" bg={hueToColor(field.value)} />
              </Slider>

              {palette && palette.length !== 0 && (
                <Menu placement="bottom-end">
                  <Tooltip
                    label={t('ColorController.paletteTooltip')}
                    placement="top"
                    hasArrow
                  >
                    <MenuButton
                      as={IconButton}
                      aria-label="Palette"
                      variant="ghost"
                      size="sm"
                      icon={<TriangleDownIcon />}
                      ml={2}
                    />
                  </Tooltip>
                  <MenuList px={2}>
                    <Grid
                      gap={2}
                      templateColumns={`repeat(${Math.min(
                        6,
                        palette.length
                      )}, 1fr)`}
                    >
                      {palette?.map((hue) => (
                        <IconButton
                          key={hue}
                          aria-label=""
                          icon={<></>}
                          bg={hueToColor(hue)}
                          _hover={{ bg: hueToColor(hue), borderWidth: 2 }}
                          onClick={() => field.onChange(hue)}
                        />
                      ))}
                    </Grid>
                  </MenuList>
                </Menu>
              )}
            </Flex>
          </Collapse>
        </>
      )}
    />
  )
}
