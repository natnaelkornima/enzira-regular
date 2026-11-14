import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    // Initial state from localStorage if available
    const [countryCode, setCountryCodeState] = useState(() => {
        return localStorage.getItem('enzira_user_country') || '';
    });
    
    const [isOutsideEthiopia, setIsOutsideEthiopiaState] = useState(() => {
        const saved = localStorage.getItem('enzira_is_outside_et');
        if (saved !== null) return saved === 'true';
        const savedCountry = localStorage.getItem('enzira_user_country');
        if (savedCountry) return savedCountry !== 'ET';
        return false;
    });

    const setLocation = (country, isOutside) => {
        const outside = isOutside !== undefined ? isOutside : country !== 'ET';
        const normalizedCountry = country ? country.toUpperCase() : (outside ? 'US' : 'ET');
        setCountryCodeState(normalizedCountry);
        setIsOutsideEthiopiaState(outside);
        localStorage.setItem('enzira_user_country', normalizedCountry);
        localStorage.setItem('enzira_is_outside_et', String(outside));
    };

    const toggleLocation = () => {
        const nextOutside = !isOutsideEthiopia;
        const nextCountry = nextOutside ? (countryCode === 'ET' ? 'US' : countryCode || 'US') : 'ET';
        setLocation(nextCountry, nextOutside);
    };

    useEffect(() => {
        // If already explicitly stored by user in localStorage, don't override
        if (localStorage.getItem('enzira_is_outside_et') !== null) {
            return;
        }

        let isMounted = true;
        const detectLocation = async () => {
            const fetchWithTimeout = async (url, timeoutMs = 2500) => {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), timeoutMs);
                try {
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(timer);
                    if (res.ok) return await res.json();
                } catch {
                    clearTimeout(timer);
                }
                return null;
            };

            let detected = '';
            try {
                // 1. Primary: freeipapi.com
                const data1 = await fetchWithTimeout('https://freeipapi.com/api/json');
                if (data1?.countryCode) {
                    detected = data1.countryCode.toUpperCase();
                }

                // 2. Secondary fallback: ipapi.co
                if (!detected) {
                    const data2 = await fetchWithTimeout('https://ipapi.co/json/');
                    if (data2?.country) {
                        detected = data2.country.toUpperCase();
                    }
                }

                // 3. Timezone fallback
                if (!detected) {
                    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
                    if (tz.includes('Addis_Ababa') || tz.includes('Nairobi') || tz.includes('Asmara')) {
                        detected = 'ET';
                    } else if (tz) {
                        detected = 'US';
                    }
                }
            } catch (err) {
                console.warn('Geolocation lookup notice:', err);
            }

            if (isMounted && detected) {
                setLocation(detected, detected !== 'ET');
            }
        };

        detectLocation();

        return () => {
            isMounted = false;
        };
    }, []);

    const currency = isOutsideEthiopia ? 'USD' : 'ETB';
    const currencySymbol = isOutsideEthiopia ? '$' : 'Birr';

    return (
        <LocationContext.Provider
            value={{
                countryCode,
                isOutsideEthiopia,
                setIsOutsideEthiopia: (val) => setLocation(val ? (countryCode === 'ET' ? 'US' : countryCode || 'US') : 'ET', val),
                setCountryCode: (code) => setLocation(code, code !== 'ET'),
                toggleLocation,
                currency,
                currencySymbol,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocationData = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationData must be used within a LocationProvider');
    }
    return context;
};

