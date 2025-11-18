import { Calculator, Package, Printer, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: Calculator, label: 'Calculadora' },
    { to: '/filaments', icon: Package, label: 'Filamentos' },
    { to: '/printers', icon: Printer, label: 'Impressoras' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="relative flex flex-col items-center justify-center flex-1 h-full text-muted-foreground transition-all duration-300 group"
            activeClassName="text-primary"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full animate-fade-in" />
                )}
                <div className={`
                  p-3 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-primary/15 scale-105' : 'group-hover:bg-muted'}
                `}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs mt-1 font-medium transition-all ${isActive ? 'scale-105' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
