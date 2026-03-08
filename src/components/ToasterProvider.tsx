"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                className: 'glass text-sm font-medium',
                style: {
                    background: 'var(--glass-bg)',
                    color: 'var(--foreground)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                }
            }}
        />
    );
}
