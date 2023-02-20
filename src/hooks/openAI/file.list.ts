import wretch from "wretch";
import { useAuth } from "../../auth/hooks";
import { authFailed } from "../../auth/auth.slice";
import { OpenAiFile, OpenAIFilesObject } from "../../models/openAI/Files";
import { useAppDispatch } from "../../store";

export const useFileList = () => {
  const { getApiKey } = useAuth();
  const dispatch = useAppDispatch();

  return async (): Promise<OpenAiFile[]> => {
    const apiKey = await getApiKey();
    const filesObject = await wretch("https://api.openai.com/v1/files")
      .auth(`Bearer ${apiKey}`)
      .get()
      .unauthorized(() => {
        dispatch(authFailed());
        throw new Error("OpenAI API request failed");
      })
      .json<OpenAIFilesObject>();

    return filesObject.data;
  };
}