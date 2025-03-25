
import { Link } from "react-router-dom";
import { Ticket, Mail, Github, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background py-10">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Ticket className="h-6 w-6 text-primary" />
            <span>EventTix</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The premium event ticketing platform for college events
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                Events
              </Link>
            </li>
            <li>
              <Link to="/my-tickets" className="text-muted-foreground hover:text-foreground transition-colors">
                My Tickets
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Connect</h3>
          <div className="flex space-x-4">
            <a 
              href="mailto:info@eventtix.com" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container mt-8 border-t border-border/40 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} EventTix. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
