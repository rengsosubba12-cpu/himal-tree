import MagazineNav from './components/UI/MagazineNav';
import EditorialCursor from './components/UI/EditorialCursor';
import SakuraOverlay from './components/UI/SakuraOverlay';
import DesktopHero from './components/Hero/DesktopHero';
import MobileHero from './components/Hero/MobileHero';
import MenuSpread from './components/Sections/MenuSpread';
import StoriesSection from './components/Sections/StoriesSection';
import BookingForm from './components/Sections/BookingForm';
import { cafeInfo } from './data/content';

function App() {
  return (
    <>
      {/* Persistent textured paper background for continuous cinematic feel */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/background/bg-paper.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      {/* Global UI overlays */}
      <EditorialCursor />
      <MagazineNav />
      <SakuraOverlay />

      {/* HARD COMPONENT SPLIT: Desktop & Mobile Completely Isolated */}
      <div id="home">
        {/* DESKTOP ONLY - Completely Untouched */}
        <div className="hidden lg:block w-full">
          <DesktopHero /> 
        </div>

        {/* MOBILE ONLY - Safe & Lightweight */}
        <div className="block lg:hidden w-full">
          <MobileHero />
        </div>
      </div>

      {/* Content Sections */}
      <MenuSpread />
      <StoriesSection />
      <BookingForm />

      {/* Footer */}
      <footer className="bg-paper text-ink py-20 px-6 md:px-16 border-t border-hairline">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl mb-2">{cafeInfo.name}</h3>
            <p className="font-script italic text-xl opacity-50">{cafeInfo.nameKr}</p>
            <p className="font-sans text-xs tracking-[0.3em] uppercase opacity-40 mt-4">
              {cafeInfo.tagline}
            </p>
          </div>

          {/* Contact */}
          <div className="font-body text-sm opacity-60 leading-relaxed space-y-3">
            <p>{cafeInfo.address}</p>
            <p>{cafeInfo.phone}</p>
            <p>{cafeInfo.email}</p>
            <p>{cafeInfo.hours}</p>
          </div>

          {/* Social */}
          <div className="font-sans text-xs tracking-[0.3em] uppercase opacity-40 space-y-3">
            <p>Instagram: {cafeInfo.social.instagram}</p>
            <p>Facebook: {cafeInfo.social.facebook}</p>
            <div className="mt-8 pt-4 border-t border-[rgba(26,26,26,0.1)]">
              <p className="opacity-60">© 2026 {cafeInfo.name}</p>
              <p className="opacity-40 mt-1">Designed with 정성</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
