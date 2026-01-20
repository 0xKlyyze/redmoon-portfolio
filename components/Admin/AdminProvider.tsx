'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AdminContextType {
    isAdmin: boolean;
    isLoading: boolean;
    clientIP: string | null;
    authMethod: 'ip' | 'pin' | 'none';
    checkAdminStatus: () => Promise<void>;
    loginWithPin: (pin: string) => Promise<boolean>;
    adminPin: string | null;
    setAdminPin: (pin: string | null) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}

interface AdminProviderProps {
    children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [clientIP, setClientIP] = useState<string | null>(null);
    const [authMethod, setAuthMethod] = useState<'ip' | 'pin' | 'none'>('none');
    const [adminPin, setAdminPin] = useState<string | null>(null);

    const checkAdminStatus = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/check');
            const data = await response.json();

            // Debug logging
            console.log('[AdminProvider] Admin check response:', data);

            setIsAdmin(data.isAdmin);
            setClientIP(data.clientIP);
            setAuthMethod(data.method);
        } catch (error) {
            console.error('[AdminProvider] Failed to check admin status:', error);
            setIsAdmin(false);
            setAuthMethod('none');
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithPin = async (pin: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });
            const data = await response.json();

            setIsAdmin(data.isAdmin);
            setClientIP(data.clientIP);
            setAuthMethod(data.method);

            if (data.isAdmin) {
                setAdminPin(pin);
            }

            return data.isAdmin;
        } catch (error) {
            console.error('Failed to login with PIN:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAdminStatus();
    }, []);

    return (
        <AdminContext.Provider value={{
            isAdmin,
            isLoading,
            clientIP,
            authMethod,
            checkAdminStatus,
            loginWithPin,
            adminPin,
            setAdminPin,
        }}>
            {children}
        </AdminContext.Provider>
    );
}
