import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import { useEffect } from "react";

// Pages
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Medicines from "@/pages/Medicines";
import Records from "@/pages/Records";
import Doctor from "@/pages/Doctor";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...props }: any) {
  const [location, setLocation] = useLocation();
  const user = localStorage.getItem("sehat_user");

  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user) return null;
  return <Component {...props} />;
}

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/home" component={() => <ProtectedRoute component={Home} />} />
        <Route path="/medicines" component={() => <ProtectedRoute component={Medicines} />} />
        <Route path="/records" component={() => <ProtectedRoute component={Records} />} />
        <Route path="/doctor" component={() => <ProtectedRoute component={Doctor} />} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
