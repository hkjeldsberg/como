"use client";

import { useCallback, useEffect, useState } from "react";

export const AVATARS = ["🦊", "🐙", "🦉", "🐢", "🦜", "🐝", "🌵", "🌶️", "🍋", "🎸", "🚀", "⚽️"];

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

  useEffect(() => {
    const storedAvatar = read("como:avatar");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    if (storedAvatar) setAvatarState(storedAvatar);
  }, []);

  const setAvatar = useCallback((value: string) => {
    setAvatarState(value);
    write("como:avatar", value);
  }, []);

  return { avatar, setAvatar };
}
