"use client";

import { useWindowManager } from "@/context/window-manager";
import { WindowFrame } from "./WindowFrame";

export function WindowManager() {
    const { windows } = useWindowManager();

    return (
        <>
            {windows.map((window) => (
                <WindowFrame
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    isOpen={window.isOpen}
                    isMinimized={window.isMinimized}
                    zIndex={window.zIndex}
                >
                    {window.component}
                </WindowFrame>
            ))}
        </>
    );
}
