import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { Nav } from './components/ui/Nav'
import { LandingPage } from './routes/LandingPage'
import { ConfiguradorPage } from './routes/ConfiguradorPage'
import { ConfiguradorTipoPage } from './routes/ConfiguradorTipoPage'
import { CotizacionPage } from './routes/CotizacionPage'
import { CotizacionExitoPage } from './routes/CotizacionExitoPage'
import { ContactoPage } from './routes/ContactoPage'
import { AdminPage } from './routes/AdminPage'

function RootLayout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const configuradorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configurador',
  component: ConfiguradorPage,
})

export const configuradorTipoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configurador/$tipo',
  component: ConfiguradorTipoPage,
})

export const cotizacionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cotizacion',
  component: CotizacionPage,
})

const cotizacionExitoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cotizacion/exito',
  component: CotizacionExitoPage,
})

const contactoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacto',
  component: ContactoPage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/cotizaciones',
  component: AdminPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  configuradorRoute,
  configuradorTipoRoute,
  cotizacionRoute,
  cotizacionExitoRoute,
  contactoRoute,
  adminRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
