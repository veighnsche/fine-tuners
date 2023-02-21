import { useAppDispatch, useAppSelector } from '../../store'
import { setFrequencyPenalty } from '../../store/playground.settings.slice'
import { Slider } from '../Slider'

export const FrequencyPenalty = () => {
  const frequencyPenalty = useAppSelector(state => state.playgroundSettings.frequencyPenalty)
  const dispatch = useAppDispatch()

  return (
    <Slider
      label="Frequency Penalty"
      tooltip="Penalize new tokens is like a rule to stop the AI language model from repeating the same words and phrases over and over again. The higher you set this number, the less likely the AI language model will be to repeat what it's already said in its answer. This can make its answers more unique and prevent it from saying the same thing over and over again."
      sliderProps={{
        min: 0,
        max: 2,
        step: 0.01,
      }}
      value={frequencyPenalty}
      onChange={(value) => dispatch(setFrequencyPenalty({ frequencyPenalty: value }))}
    />
  )
}
