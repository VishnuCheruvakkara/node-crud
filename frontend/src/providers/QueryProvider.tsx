'use client';

import React, {useState} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryProvider({children} : {children: React.ReactNode}){
    const [queryClient] = useState(
        ()=>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
                        refetchOnWindowFocus: false // Don't span requests when user switches browser tabs
                    },
                },
            })
    )

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}