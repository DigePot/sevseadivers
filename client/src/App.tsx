import { Provider } from "react-redux"
import { store } from "./store"

type AppProps = {
  children: React.ReactNode
}

export default function App({ children }: AppProps) {
  return <Provider store={store}>{children}</Provider>
}
