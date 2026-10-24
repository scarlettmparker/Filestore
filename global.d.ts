declare module "@sun/components";

declare module "@sun/api" {
  import type { DocumentNode } from "graphql";

  type ApiConfig = {
    authCookie?: string;
    clientId?: string;
    clientSecret?: string;
    apiKey?: string;
    appBaseUrl?: string;
  };

  type ExecuteDocumentOptions = {
    retries?: number[];
    timeoutMs?: number;
  };

  type ExecuteDocumentResult<T> = {
    success: boolean;
    data?: T;
    error?: string;
    statusCode?: number;
  };

  export function configureApi(config: ApiConfig): void;
  export function executeDocument<TData = unknown, TVariables = Record<string, unknown>>(
    document: DocumentNode,
    variables?: TVariables,
    authToken?: string,
    options?: ExecuteDocumentOptions,
  ): Promise<ExecuteDocumentResult<TData>>;
  export function getCookieValue(
    cookieHeader: string | undefined,
    name: string,
  ): string | undefined;
}
