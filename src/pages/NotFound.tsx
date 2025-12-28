import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
        <span className="font-display text-4xl font-bold text-muted-foreground">404</span>
      </div>
      <h1 className="font-display text-3xl font-bold text-foreground">Page Not Found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Sorry, we couldn't find the page you're looking for. Let's get you back on track.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </Button>
        <Button asChild variant="hero">
          <Link to="/">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
