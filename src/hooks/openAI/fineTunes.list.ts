import wretch from "wretch";
import { useAuth } from "../../auth/hooks";
import { authFailed } from "../../auth/auth.slice";
import { OpenAiFineTuneObject } from "../../models/openAI/FineTuning";
import { useAppDispatch } from "../../store";

export const useFineTunesList = () => {
  const { getApiKey } = useAuth();
  const dispatch = useAppDispatch();

  return async () => {
    const apiKey = await getApiKey();
    return wretch("https://api.openai.com/v1/fine-tunes")
      .auth(`Bearer ${apiKey}`)
      .get()
      .unauthorized(() => {
        dispatch(authFailed());
        throw new Error("OpenAI API request failed");
      })
      .json<OpenAiFineTuneObject>();
  };
}