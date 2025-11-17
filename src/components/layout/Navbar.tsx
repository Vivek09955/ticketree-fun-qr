
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Ticket, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold"
          onClick={closeMenu}
        >
          <Ticket className="h-6 w-6 text-primary" />
          <span>EventTix</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link 
            to="/events" 
            className="font-medium transition-colors hover:text-primary"
          >
            Events
          </Link>
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link 
                  to="/admin" 
                  className="font-medium transition-colors hover:text-primary"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link 
                  to="/my-tickets" 
                  className="font-medium transition-colors hover:text-primary"
                >
                  My Tickets
                </Link>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
              <Link to="/register">
                <Button>
                  <User className="mr-2 h-4 w-4" /> Register
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden btn-icon p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background animate-fade-in">
          <nav className="container flex flex-col p-6 text-lg">
            <Link 
              to="/events" 
              className="py-4 font-medium border-b border-border/50"
              onClick={closeMenu}
            >
              Events
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link 
                    to="/admin" 
                    className="py-4 font-medium border-b border-border/50"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/my-tickets" 
                    className="py-4 font-medium border-b border-border/50"
                    onClick={closeMenu}
                  >
                    My Tickets
                  </Link>
                )}
                <button
                  className="py-4 font-medium text-left text-destructive"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-4 font-medium border-b border-border/50"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="py-4 font-medium"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
