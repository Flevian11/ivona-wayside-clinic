import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FloatingThemeSwitcher() {
    const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // 1. Initialize theme from local storage or system
        const savedTheme = localStorage.getItem('appearance') as 'light' | 'dark' | 'system' | null;
        if (savedTheme) {
            setThemeState(savedTheme);
        } else if (document.documentElement.classList.contains('dark')) {
            setThemeState('dark');
        } else {
            setThemeState('light');
        }
    }, []);

    const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
        setThemeState(newTheme);
        localStorage.setItem('appearance', newTheme);

        const root = document.documentElement;
        
        if (newTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.toggle('dark', systemTheme === 'dark');
        } else {
            root.classList.toggle('dark', newTheme === 'dark');
        }
        
        setIsOpen(false);
    };

    if (!mounted) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 print:hidden">
            {/* Expanded Options */}
            <div
                className={cn(
                    "flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/90 p-1.5 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/90",
                    isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"
                )}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme('light')}
                    className={cn("h-9 w-9 rounded-xl transition-colors", theme === 'light' && "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100")}
                    title="Light Mode"
                >
                    <Sun className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme('dark')}
                    className={cn("h-9 w-9 rounded-xl transition-colors", theme === 'dark' && "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100")}
                    title="Dark Mode"
                >
                    <Moon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme('system')}
                    className={cn("h-9 w-9 rounded-xl transition-colors", theme === 'system' && "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100")}
                    title="System Preference"
                >
                    <Monitor className="h-4 w-4" />
                </Button>
            </div>

            {/* Main Trigger Button */}
            <Button
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="h-12 w-12 rounded-full bg-emerald-700 text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-transform hover:scale-105 active:scale-95"
            >
                <Palette className={cn("h-5 w-5 transition-transform duration-300", isOpen && "rotate-90")} />
            </Button>
        </div>
    );
}