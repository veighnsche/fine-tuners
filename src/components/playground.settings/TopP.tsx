import { useAppDispatch, useAppSelector } from '../../store'
import { setTopP } from '../../store/playground.settings.slice'
import { Slider } from '../Slider'

export const TopP = () => {
  const topP = useAppSelector(state => state.playgroundSettings.topP)
  const dispatch = useAppDispatch()

  return (
    <Slider
      label="Top P"
      tooltip="Top P controls how many different options the AI language model will consider when making up its words and phrases. If you set Top P to 0.5, it means the AI language model will look at half of all the possibilities and choose from those. The higher you set Top P, the more options the AI language model will consider, which can make its answers more diverse. But if you set it too high, its answers might not make as much sense."
      sliderProps={{
        min: 0,
        max: 1,
        step: 0.1,
      }}
      value={topP}
      onChange={(value) => dispatch(setTopP({ topP: value }))}
    />
  )
}