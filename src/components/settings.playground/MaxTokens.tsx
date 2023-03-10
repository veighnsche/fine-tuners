import { useAppDispatch, useAppSelector } from '../../store'
import { setMaxTokens } from '../../store/playground.settings.slice'
import { Slider } from '../Slider'

export const MaxTokens = () => {
  const maxTokens = useAppSelector(state => state.playgroundSettings.maxTokens)
  const dispatch = useAppDispatch()

  return (
    <Slider
      label="Max Tokens"
      tooltip="Max tokens means the maximum number of words the AI language model is allowed to use to make its answer. The number can be different for each AI language model, but usually it's around 500 or 1,000 words. That's a lot of words! But we have to make sure the AI language model doesn't use too many words so that it's easier for you to read and understand its answer."
      sliderProps={{
        min: 1,
        max: 4000,
        step: 1,
      }}
      value={maxTokens}
      onChange={(value) => dispatch(setMaxTokens({ maxTokens: value }))}
    />
  )
}