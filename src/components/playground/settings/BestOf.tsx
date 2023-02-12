import { useAppDispatch, useAppSelector } from '../../../store'
import { setBestOf } from '../../../store/playground.settings.slice'
import { Slider } from '../../Slider'

export const BestOf = () => {
  const bestOf = useAppSelector(state => state.playgroundSettings.bestOf)
  const dispatch = useAppDispatch()

  const sliderProps = {
    min: 1,
    max: 20,
    step: 1,
  }

  const handleChange = (value: number) => {
    if (value > sliderProps.max) {
      value = sliderProps.max
    }
    if (value < sliderProps.min) {
      value = sliderProps.min
    }
    dispatch(setBestOf({ bestOf: value }))
  }

  return (
    <Slider
      label="Best Of"
      tooltip="Best completions means the AI language model will make lots of different answers, and only show you the best one. This is like having a big test and only getting to see the best score you got. But be careful! This can use up a lot of the words the AI language model is allowed to use, so it's best to only use it when you really need it."
      sliderProps={sliderProps}
      value={bestOf}
      onChange={handleChange}
    />
  )
}