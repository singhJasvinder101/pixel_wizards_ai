import MobileNav from '@/components/MobileNav';
import Sidebar from '@/components/Sidebar';
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="root flex">
            <Sidebar />
            <MobileNav />

            <div className="root-container">
                <div className="wrapper">
                    {children}
                </div>
            </div>

        </main>
    )
}

export default Layout