/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function useFilter(states, route, isFirstFilter = false) {
    const dynamicParams = useMemo(() => {
        const params = {};
        Object.keys(states).forEach((key) => {
            if (states[key] !== undefined && states[key] !== null && states[key] !== '') {
                if (Array.isArray(states[key])) {
                    if (states[key].length > 0) {
                        const formattedString = states[key].join(',');
                        params[key] = formattedString;
                    }
                } else if (states[key] !== 'all') {
                    params[key] = states[key];
                }
            }
        });

        return params;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...Object.values(states)]);

    const [isFilter, setIsFilter] = useState(isFirstFilter);

    useEffect(() => {
        if (isFilter) {
            router.get(route, dynamicParams, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    }, [isFilter, dynamicParams, route]);

    return { isFilter, dynamicParams, setIsFilter };
}
