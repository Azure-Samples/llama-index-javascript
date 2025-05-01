import Link from "next/link";
import Header from "@/app/components/header";
import {
  FaConciergeBell,
  FaEnvelope,
  FaFileContract,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function MenuPage() {
  const menuItems = [
    { label: "Our Services", href: "/services", icon: <FaConciergeBell />, color: "bg-blue-100 text-blue-600" },
    { label: "Contact Us", href: "/contact", icon: <FaEnvelope />, color: "bg-green-100 text-green-600" },
    { label: "Terms and Conditions", href: "/terms", icon: <FaFileContract />, color: "bg-yellow-100 text-yellow-600" },
    { label: "Security", href: "/security", icon: <FaShieldAlt />, color: "bg-purple-100 text-purple-600" },
    { label: "Logout", href: "/logout", icon: <FaSignOutAlt />, color: "bg-red-100 text-red-600" },
  ];

  return (
    <main className="h-screen w-screen flex justify-center items-center bg-gradient-to-b from-zinc-200 dark:from-black p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <Header />

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Menu</h1>
          <p className="text-gray-600 dark:text-gray-300">Select an action below to continue.</p>

          <ul className="space-y-3">
            {menuItems.map(({ label, href, icon, color }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-transform"
                >
                  <span className={`p-2 rounded-full flex-shrink-0 ${color}`}>{icon}</span>
                  <span className="flex-1 text-left font-medium text-gray-800 dark:text-gray-200">
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="mt-4 inline-block w-full text-center py-2 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
