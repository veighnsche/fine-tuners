import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OpenAiFile } from '../models/openAI/Files'
import { RootState } from './index'

export interface TrainSettingsState {
  trainingFile: OpenAiFile | null;
  validationFile?: OpenAiFile['id'];
  model?: string;
  nEpochs?: number;
  batchSize?: number;
  learningRate?: number;
  promptLossWeight?: number;
  computeClassificationMetrics?: boolean;
  classificationNumClasses?: number;
  classificationPositiveClass?: string;
  classificationBetas?: number[];
  suffix?: string;
}

const initialState: TrainSettingsState = {
  trainingFile: null,
  model: 'curie',
  nEpochs: 4,
  promptLossWeight: 0.01,
}

export const trainSettingsSlice = createSlice({
  name: 'trainSettings',
  initialState,
  reducers: {
    setTrainingFile: (state, action: PayloadAction<{
      trainingFile: OpenAiFile
    }>) => {
      state.trainingFile = action.payload.trainingFile
    },
    setModel: (state, action: PayloadAction<{
      model: string
    }>) => {
      state.model = action.payload.model
    },
    setNEpochs: (state, action: PayloadAction<{
      nEpochs: number
    }>) => {
      state.nEpochs = action.payload.nEpochs
    },
    setPromptLossWeight: (state, action: PayloadAction<{
      promptLossWeight: number
    }>) => {
      state.promptLossWeight = action.payload.promptLossWeight
    },
  },
})

export const {
  setTrainingFile,
  setModel,
  setNEpochs,
  setPromptLossWeight,
} = trainSettingsSlice.actions

export const selectTrainSettings = ({
  trainSettings: {
    trainingFile,
    model,
    nEpochs,
    promptLossWeight,
  },
}: RootState) => {
  const settings: Record<string, any> = {
    training_file: trainingFile?.id,
  }
  if (model && model !== 'curie') {
    settings['model'] = model
  }
  if (nEpochs && nEpochs !== 4) {
    settings['n_epochs'] = nEpochs
  }
  if (promptLossWeight && promptLossWeight !== 0.01) {
    settings['prompt_loss_weight'] = promptLossWeight
  }
  return settings
}

export default trainSettingsSlice.reducer