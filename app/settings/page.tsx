"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/header";
import { 
  FaMoon, 
  FaSun, 
  FaBell, 
  FaRegTrashAlt, 
  FaUserCog 
} from "react-icons/fa";

export default function SettingsPage() {
  // LOCAL STATE FOR DEMO PURPOSES
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [chatTone, setChatTone] = useState<"friendly" | "professional">("friendly");

  return (
    <main className={`${darkMode ? "dark" : ""}`}>
      <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-b from-zinc-200 dark:from-black">
        <div className="space-y-6 lg:space-y-12 w-[90%] lg:w-[40rem] text-left bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg">
          <Header />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Customize your chatbot experience below.
          </p>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
            <div className="flex items-center space-x-3">
              {darkMode ? <FaMoon /> : <FaSun />}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {darkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <button
              onClick={() => setDarkMode((v) => !v)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Toggle
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaBell />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Notifications
              </span>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={notifications}
                onChange={() => setNotifications((v) => !v)}
              />
              <div className="w-10 h-5 bg-gray-300 dark:bg-zinc-700 rounded-full relative transition">
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    notifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Chat Tone */}
          <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FaUserCog />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Chat Tone
              </span>
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="chatTone"
                  value="friendly"
                  checked={chatTone === "friendly"}
                  onChange={() => setChatTone("friendly")}
                />
                <span className="text-gray-700 dark:text-gray-300">Friendly</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="chatTone"
                  value="professional"
                  checked={chatTone === "professional"}
                  onChange={() => setChatTone("professional")}
                />
                <span className="text-gray-700 dark:text-gray-300">Professional</span>
              </label>
            </div>
          </div>

          {/* Clear Chat History */}
          <div className="flex items-center justify-between p-4 bg-red-100 dark:bg-red-900 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaRegTrashAlt className="text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-700 dark:text-red-300">
                Clear Chat History
              </span>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Clear
            </button>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block bg-white dark:bg-zinc-700 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


