import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileMenu from './MobileMenu'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <div className="flex-1 px-3 pt-0 pb-4 md:px-5 md:pt-0 md:pb-5">
        <div className="w-full space-y-3">
          <header className="glass-panel sticky top-0 z-50 mb-3">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <MobileMenu showOnMobile={true}>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Menu</h3>
                  <Sidebar />
                </div>
              </MobileMenu>
              <Navbar mode="faculty" />
            </div>
          </header>
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block">
              <Sidebar />
            </aside>
            <main className="space-y-5">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
