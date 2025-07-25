import { paths } from "./routes/paths"

import packageJson from "../package.json"

export type ConfigValue = {
  appName: string
  appVersion: string
  serverUrl: string
  assetsDir: string
  auth: {
    method: "jwt"
    skip: boolean
    redirectPath: string
  }
}

export const CONFIG: ConfigValue = {
  appName: "Sevsea",
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "",
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? "",
  /**
   * Auth
   * @method jwt
   */
  auth: {
    method: "jwt",
    skip: false,
    // redirectPath: paths.dashboard.root,
    redirectPath: paths.auth.jwt.signIn,
  },
}
