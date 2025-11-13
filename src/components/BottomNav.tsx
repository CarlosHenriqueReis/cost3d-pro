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
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
