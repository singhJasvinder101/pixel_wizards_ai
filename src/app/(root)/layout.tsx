import MobileNav from '@/components/MobileNav';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="root flex">
            <Sidebar />
            <MobileNav />

            <Toaster />
            <div className="root-container">
                <div className="wrapper w-[90%] mx-auto">
                    {children}
                </div>
            </div>

        </main>
    )
}

export default Layout