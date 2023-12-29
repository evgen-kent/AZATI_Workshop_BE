import { ENV, ProcessEnv } from '../../config/env.interface';

export const loadEnvironmentVariables = (): void => {
  const mandatoryVariables: Array<keyof ProcessEnv> = Object.keys(ENV) as Array<
    keyof ProcessEnv
  >;

  for (const variable of mandatoryVariables) {
    if (!ENV[variable]) {
      throw new Error(
        `The required environment variable ***${variable}*** is not set.`,
      );
    }
  }
};
