import wretch from "wretch";
import { useAuth } from "../../auth/hooks";
import { authFailed } from "../../auth/auth.slice";
import { useAppDispatch } from "../../store";
import { fromJsonl } from "../../utils/lines.json";

interface UseFetchFileContentParams {
  id: string;
}

export const useFileFetch = () => {
  const { getApiKey } = useAuth();
  const dispatch = useAppDispatch();

  return async ({ id }: UseFetchFileContentParams) => {
    const apiKey = await getApiKey();
    const blob = await wretch(`https://api.openai.com/v1/files/${id}/content`)
      .auth(`Bearer ${apiKey}`)
      .get()
      .unauthorized(() => {
        dispatch(authFailed());
        throw new Error("OpenAI API request failed");
      })
      .blob()
      .catch(err => {
        console.error(err);
        throw err;
      });

    const text = await blob.text();
    return fromJsonl(text);
  };
};