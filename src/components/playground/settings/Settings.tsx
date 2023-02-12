import { Box } from '@mui/material'
import { BestOf } from './BestOf'
import { FrequencyPenalty } from './FrequencyPenalty'
import { MaxTokens } from './MaxTokens'
import { Model } from './Model'
import { PresencePenalty } from './PresencePenalty'
import { StopSequences } from './StopSequences'
import { Temperature } from './Temperature'
import { TopP } from './TopP'

export const PlaygroundSettings = () => {
  return (
    <Box display="flex" flexDirection="column" gap={2} px={1}>
      <Model/>
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