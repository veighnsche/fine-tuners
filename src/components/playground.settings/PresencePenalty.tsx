import { useAppDispatch, useAppSelector } from '../../store'
import { setPresencePenalty } from '../../store/playground.settings.slice'
import { Slider } from '../Slider'

export const PresencePenalty = () => {
  const presencePenalty = useAppSelector(state => state.playgroundSettings.presencePenalty)
  const dispatch = useAppDispatch()

  return (
    <Slider
      label="Presence Penalty"
      tooltip="Penalize new tokens is like a rule to encourage the AI language model to talk about new things. The higher you set this number, the more likely the AI language model will be to talk about things it hasn't mentioned before in its answer. This can make its answers more interesting and prevent it from getting stuck talking about the same thing over and over again."
      sliderProps={{
        min: 0,
        max: 2,
        step: 0.01,
      }}
      value={presencePenalty}
      onChange={(value) => dispatch(setPresencePenalty({ presencePenalty: value }))}
    />
  )
}