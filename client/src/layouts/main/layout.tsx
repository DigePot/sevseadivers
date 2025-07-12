import React from "react";
import { navData as mainNavData } from "../nav-config-main";
import { CONFIG } from "../../global-config";
import { SignInButton } from "../../components/sign-in-button";
import { SignUpButton } from "../../components/sign-up-button";
import { Link } from "react-router";
import { useAuth, useUser } from "../../sections/auth/hooks";
import { SignOutButton } from "../../components/sign-out-button";
import Footer from "../../layouts/footer/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const id = localStorage.getItem("id") ?? "";
  const { user } = useUser(id);
  const { authenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <Link className="flex items-center space-x-2 text-xl font-bold text-cyan-600 font-sans" to="/">
          {/* Wave emoji icon */}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-2xl">
            🌊
          </span>
          <span>{CONFIG.appName}</span>
        </Link>
        <nav className="flex items-center gap-4">
          <div className="space-x-2">
            {mainNavData.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-black text-base px-2 py-1 transition hover:underline hover:text-cyan-600"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {authenticated ? (
              <SignOutButton className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded transition" >
                <svg className="w-4 h-4 mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </SignOutButton>
            ) : (
              <SignInButton />
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>

      {/* Footer */}
        <Footer />
    </div>
  );
}
