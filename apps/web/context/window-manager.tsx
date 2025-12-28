"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type WindowId = string;

export interface WindowInstance {
    id: WindowId;
    title: string;
    component: ReactNode;
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
    width?: number;
    height?: number;
}

interface WindowManagerContextType {
    windows: WindowInstance[];
    openWindow: (id: WindowId, title: string, component: ReactNode) => void;
    closeWindow: (id: WindowId) => void;
    minimizeWindow: (id: WindowId) => void;
    focusWindow: (id: WindowId) => void;
    toggleWindow: (id: WindowId, title: string, component: ReactNode) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
    const [windows, setWindows] = useState<WindowInstance[]>([]);
    const [topZIndex, setTopZIndex] = useState(100);

    const openWindow = (id: WindowId, title: string, component: ReactNode) => {
        setWindows(prev => {
            const existing = prev.find(w => w.id === id);
            if (existing) {
                // Determine if we need to update zIndex
                const newZ = existing.zIndex === topZIndex ? topZIndex : topZIndex + 1;
                if (newZ > topZIndex) setTopZIndex(newZ);

                return prev.map(w => w.id === id ? {
                    ...w,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: newZ,
                    // content might update if passed freshly but for now let's reuse
                    component: component // Update component in case props changed
                } : w);
            }

            const newZ = topZIndex + 1;
            setTopZIndex(newZ);

            return [...prev, {
                id,
                title,
                component,
                isOpen: true,
                isMinimized: false,
                zIndex: newZ
            }];
        });
    };

    const closeWindow = (id: WindowId) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
    };

    const minimizeWindow = (id: WindowId) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    };

    const focusWindow = (id: WindowId) => {
        setWindows(prev => {
            const target = prev.find(w => w.id === id);
            if (!target || target.zIndex === topZIndex) return prev;

            const newZ = topZIndex + 1;
            setTopZIndex(newZ);

            return prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w);
        });
    };

    const toggleWindow = (id: WindowId, title: string, component: ReactNode) => {
        setWindows(prev => {
            const existing = prev.find(w => w.id === id);
            if (existing && existing.isOpen && !existing.isMinimized) {
                // If open and focused, close it (or minimize? user asked for toggle)
                // Let's close for now as per "toggle" usually meaning on/off
                return prev.map(w => w.id === id ? { ...w, isOpen: false } : w);
            }
            // Otherwise open/focus it
            // Logic is same as openWindow basically, but need to callback
            // Since we can't call openWindow inside setWindows callback generally, 
            // we'll handle logical "else" by running the open logic here manually or deferring
            // Ideally we separate this but for simplicity:

            // Re-use open logic duplication for safety inside the setter:
            if (existing) {
                const newZ = existing.zIndex === topZIndex ? topZIndex : topZIndex + 1;
                if (newZ > topZIndex) setTopZIndex(newZ);
                return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ, component } : w);
            }

            const newZ = topZIndex + 1;
            setTopZIndex(newZ);
            return [...prev, { id, title, component, isOpen: true, isMinimized: false, zIndex: newZ }];
        });
    };

    return (
        <WindowManagerContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, focusWindow, toggleWindow }}>
            {children}
        </WindowManagerContext.Provider>
    );
}

export function useWindowManager() {
    const context = useContext(WindowManagerContext);
    if (context === undefined) {
        throw new Error('useWindowManager must be used within a WindowManagerProvider');
    }
    return context;
}
