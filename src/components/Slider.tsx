import styled from '@emotion/styled'
import {
  FormControl,
  InputLabel,
  Slider as MuiSlider,
  SliderProps as MuiSliderProps,
  TextField,
  Tooltip,
} from '@mui/material'

export const SliderControl = styled(FormControl)`
  width: 100%;
  transform: translateY(-0.8rem);
`
export const SliderTextWrapper = styled.div`
  display: flex;
  justify-content: right;
  align-items: flex-end;
  gap: 1rem;
`
export const SliderLabel = styled(InputLabel)`
  transform: translateY(0.85rem);
`
export const SliderTextField = styled(TextField)`
  width: 5rem;
  transform: translateY(0.9rem);
  text-align: right !important;
`

interface SliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  sliderProps: MuiSliderProps & Required<Pick<MuiSliderProps, 'min' | 'max' | 'step'>>
  tooltip?: string
}

export const Slider = ({ label, value, onChange, sliderProps, tooltip }: SliderProps) => {
  const handleChange = (value: number) => {
    if (value > sliderProps.max) {
      value = sliderProps.max
    }
    if (value < sliderProps.min) {
      value = sliderProps.min
    }
    onChange(value)
  }

  return (
    <SliderControl>
      <Tooltip title={tooltip} placement="left">
        <SliderTextWrapper>
          <SliderLabel size="small">
            {label}
          </SliderLabel>
          <SliderTextField
            type="number"
            size="small"
            variant="standard"
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </SliderTextWrapper>
      </Tooltip>
      <MuiSlider
        {...sliderProps}
        size="small"
        value={value}
        onChange={(e, value) => {
          onChange(value as number)
        }}
      />
    </SliderControl>
  )
}