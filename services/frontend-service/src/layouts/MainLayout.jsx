import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-base transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col pt-16 min-h-[calc(100vh-20rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
