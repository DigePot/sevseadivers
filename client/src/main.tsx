import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"
import { Outlet, RouterProvider, createBrowserRouter } from "react-router"
import App from "./App.tsx"
import "./index.css"
import { routesSection } from "./routes/sections"
import "./i18n.ts"

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    children: routesSection,
  },
])

const root = createRoot(document.getElementById("root")!)

root.render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
)
