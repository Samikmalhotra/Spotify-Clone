import fetcher from "./fetcher";

export const auth = (
  mode: "signin" | "signup" | "signout",
  body: { email: string; password: string, firstName?: string, lastName?: string }
) => {
  return fetcher(`/${mode}`, body);
};
