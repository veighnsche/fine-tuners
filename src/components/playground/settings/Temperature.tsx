import { useAppDispatch, useAppSelector } from '../../../store'
import { setTemperature } from '../../../store/playground.settings.slice'
import { Slider } from '../../Slider'

export const Temperature = () => {
  const temperature = useAppSelector(state => state.playgroundSettings.temperature)
  const dispatch = useAppDispatch()

  const sliderProps = {
    min: 0,
    max: 1,
    step: 0.01,
  }

  const handleChange = (value: number) => {
    if (value > sliderProps.max) {
      value = sliderProps.max
    }
    if (value < sliderProps.min) {
      value = sliderProps.min
    }
    dispatch(setTemperature({ temperature: value }))
  }

  return (
    <Slider
      label="Temperature"
      tooltip="Temperature controls how surprising or expected the responses from the AI language model are. If you want the AI language model to come up with more unexpected or creative answers, you can turn up the temperature. If you want it to generate more predictable and straightforward answers, you can turn down the temperature."
      sliderProps={sliderProps}
      value={temperature}
      onChange={handleChange}
    />
  )
}