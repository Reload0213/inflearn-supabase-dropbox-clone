'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from 'types_db';

// 일반 서버 클라이언트 호출
export const createServerSupabaseClient = async (
    cookieStore: ReturnType<typeof cookies> = cookies(),
    admin: boolean = false
) => {
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        // admin인 경우 서비스 키, 아닐 경우 익명(ANON) 키
        admin ? process.env.NEXT_SUPABASE_SERVICE_ROLE! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
};

// admin 서버 클라이언트 호출
export const createServerSupabaseAdminClient = async (cookieStore: ReturnType<typeof cookies> = cookies()) => {
    return createServerSupabaseClient(cookieStore, true);
};
