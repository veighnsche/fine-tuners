import { Box, Theme } from '@mui/material'
import { useAppSelector } from '../../store'
import { setModel } from '../../store/playground.settings.slice'
import { Model } from '../shared.settings/Model'
import { BestOf } from './BestOf'
import { FrequencyPenalty } from './FrequencyPenalty'
import { MaxTokens } from './MaxTokens'
import { PresencePenalty } from './PresencePenalty'
import { StopSequences } from './StopSequences'
import { Temperature } from './Temperature'
import { TopP } from './TopP'

interface PlaygroundSettingsProps {
  width: ReturnType<Theme['spacing']>
  minWidth: ReturnType<Theme['spacing']>
}

export const PlaygroundSettings = ({ width, minWidth }: PlaygroundSettingsProps) => {
  const model = useAppSelector(state => state.playgroundSettings.model!)
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      px={1}
      width={width}
      minWidth={minWidth}
      p={4}
    >
      <Model model={model} setModel={setModel}/>
      <Temperature/>
      <MaxTokens/>
      <StopSequences/>
      <TopP/>
      <FrequencyPenalty/>
      <PresencePenalty/>
      <BestOf/>
    </Box>
  )
}
