"use client";

import { useCallback, useEffect, useState } from "react";

export const AVATARS = ["🦊", "🐙", "🦉", "🐢", "🦜", "🐝", "🌵", "🌶️", "🍋", "🎸", "🚀", "⚽️"];

export type Theme = "light" | "dark";

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

/** Non-critical UI preferences, persisted in localStorage. */
export function usePrefs(defaultAvatar: string) {
  const [avatar, setAvatarState] = useState(defaultAvatar);
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const storedAvatar = read("como:avatar");
    const storedTheme = read("como:theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    if (storedAvatar) setAvatarState(storedAvatar);
    setThemeState(storedTheme === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    if (theme) document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setAvatar = useCallback((value: string) => {
    setAvatarState(value);
    write("como:avatar", value);
  }, []);

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
    write("como:theme", value);
  }, []);

  return { avatar, setAvatar, theme: theme ?? "dark", setTheme };
}
