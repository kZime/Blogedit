import { Link } from "react-router-dom";
import { Moon, Sun, PenLine, FileEdit, LogIn, UserPlus, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../contexts/AuthModalContext";
import { useTheme } from "../contexts/ThemeContext";

export interface SiteHeaderProps {
  showPostsLink?: boolean;
  editLink?: { to: string; label: string } | null;
}

export default function SiteHeader({ showPostsLink, editLink }: SiteHeaderProps) {
  const { accessToken } = useAuth();
  const { openLoginModal, openRegisterModal } = useAuthModal();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Blogedit
        </Link>
        <nav className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {showPostsLink && (
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Posts
            </Link>
          )}
          {accessToken ? (
            <>
              <Link
                to="/editor"
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <PenLine className="w-4 h-4" />
                Write
              </Link>
              {editLink && (
                <Link
                  to={editLink.to}
                  className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <FileEdit className="w-4 h-4" />
                  {editLink.label}
                </Link>
              )}
              <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Logged in
              </span>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openLoginModal}
                className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                type="button"
                onClick={openRegisterModal}
                className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
