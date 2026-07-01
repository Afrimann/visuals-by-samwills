"use client";

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "vbs_intro_shown";

interface IntroContextValue {
  introComplete: boolean;
  // True once the client has resolved sessionStorage — until then, render
  // a blank placeholder instead of the gate to avoid a flash of the wrong state.
  introReady: boolean;
  completeIntro: () => void;
}

const IntroContext = createContext<IntroContextValue>({
  introComplete: true,
  introReady: true,
  completeIntro: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

export default function IntroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Splash only ever runs for a fresh load that lands on the homepage.
  const [introComplete, setIntroComplete] = useState(() => pathname !== "/");
  const [introReady, setIntroReady] = useState(false);

  // Runs before paint so an already-shown-this-session splash never flashes.
  useLayoutEffect(() => {
    if (pathname === "/" && sessionStorage.getItem(SESSION_KEY)) {
      setIntroComplete(true);
    }
    setIntroReady(true);
  }, [pathname]);

  const completeIntro = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setIntroComplete(true);
  }, []);

  const value = useMemo(
    () => ({ introComplete, introReady, completeIntro }),
    [introComplete, introReady, completeIntro]
  );

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}
