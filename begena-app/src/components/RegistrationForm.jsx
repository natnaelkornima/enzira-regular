import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Users, Calendar, Phone, Send, Upload, CheckCircle,
    AlertCircle, Loader2, ArrowRight, ArrowLeft, ChevronDown,
    Search, Clock, Sparkles, Check
} from 'lucide-react';
import SuccessModal from './SuccessModal';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { compressImage } from '../lib/imageUtils';
import { useLanguage } from '../lib/LanguageContext';
import { useLocationData } from '../lib/LocationContext';
import { findPricingTier } from '../lib/translations';
import telebirrLogo from '../assets/telebirr-logo.png';
import cbeLogo from '../assets/cbe-logo.png';

const countryCodes = [
    { code: '+251', country: 'Ethiopia', iso: 'et' },
    { code: '+1', country: 'USA', iso: 'us' },
    { code: '+44', country: 'UK', iso: 'gb' },
    { code: '+49', country: 'Germany', iso: 'de' },
    { code: '+971', country: 'UAE', iso: 'ae' },
    { code: '+966', country: 'Saudi Arabia', iso: 'sa' },
    { code: '+27', country: 'South Africa', iso: 'za' },
    { code: '+254', country: 'Kenya', iso: 'ke' },
    { code: '+39', country: 'Italy', iso: 'it' },
    { code: '+46', country: 'Sweden', iso: 'se' },
    { code: '+47', country: 'Norway', iso: 'no' },
    { code: '+61', country: 'Australia', iso: 'au' },
    { code: '+1', country: 'Canada', iso: 'ca' },
    { code: '+33', country: 'France', iso: 'fr' },
    { code: '+31', country: 'Netherlands', iso: 'nl' },
    { code: '+41', country: 'Switzerland', iso: 'ch' },
    { code: '+32', country: 'Belgium', iso: 'be' },
    { code: '+34', country: 'Spain', iso: 'es' },
    { code: '+91', country: 'India', iso: 'in' },
    { code: '+81', country: 'Japan', iso: 'jp' },
    { code: '+82', country: 'South Korea', iso: 'kr' },
    { code: '+86', country: 'China', iso: 'cn' },
    { code: '+55', country: 'Brazil', iso: 'br' },
];

const CBELogo = () => (
    <div className="flex items-center justify-center w-24 sm:w-28 h-12 rounded-xl bg-white border border-white/20 shadow-xs shrink-0 overflow-hidden">
        <img src={cbeLogo} alt="Commercial Bank of Ethiopia" className="w-full h-full object-contain" />
    </div>
);

const TelebirrLogo = () => (
    <div className="flex items-center justify-center w-24 sm:w-28 h-12 rounded-xl bg-white border border-white/20 shadow-xs shrink-0 overflow-hidden p-1">
        <img src={telebirrLogo} alt="Telebirr" className="w-full h-full object-contain" />
    </div>
);

const PaymentCard = ({ name, accountNumber, logo, color = 'red-500', accountHolder = 'Kirubel Habtamu Enyew' }) => {
    const [copied, setCopied] = useState(false);
    const LogoComponent = logo;

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass p-5 flex items-center justify-between border border-white/10 hover:border-brand-red/30 transition-all duration-300 relative overflow-hidden rounded-2xl">
            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${color}/5 rounded-full blur-2xl pointer-events-none transition-colors duration-500`} />
            
            <div className="flex items-center gap-4 sm:gap-5 relative z-10 mr-2 min-w-0">
                <LogoComponent />
                <div className="min-w-0">
                    <h4 className="text-white/50 font-bold text-[10px] md:text-xs tracking-wide uppercase truncate">{name}</h4>
                    <p className="text-white font-mono font-black text-base sm:text-lg lg:text-xl mt-1 tracking-wider">{accountNumber}</p>
                    <p className="text-brand-red font-bold text-[9px] md:text-[10px] uppercase tracking-widest mt-1 truncate">{accountHolder}</p>
                </div>
            </div>
            
            <button
                type="button"
                onClick={handleCopy}
                className="relative z-10 flex items-center justify-center px-3 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-brand-red text-white/60 hover:text-white border border-white/10 hover:border-brand-red transition-all cursor-pointer select-none shrink-0"
                title="Copy to clipboard"
            >
                {copied ? (
                    <span className="text-[10px] font-bold text-green-400 hover:text-white uppercase tracking-widest">Copied</span>
                ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white">Copy</span>
                )}
            </button>
        </div>
    );
};

const RegistrationForm = ({ selectedTierId: externalTierId, onSelectPlanTier }) => {
    const { t, language } = useLanguage();
    const { setCountryCode, setLocation } = useLocationData();

    // 3-Step Wizard state: 1 = Details, 2 = Choose Plan, 3 = Payment & Upload
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        fullName: '',
        countryCode: '+251',
        phoneNumber: '',
        telegram: '',
        photo: null,
    });

    const [activePlanTab, setActivePlanTab] = useState('individual'); // 'individual' appears first
    const [selectedTierId, setSelectedTierId] = useState(externalTierId || 'individual-6m');
    const [photoPreview, setPhotoPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const countryPickerRef = useRef(null);

    // Dynamic country detection strictly determines pricing:
    // Only +251 shows Ethiopian Birr (ETB). Any other country code shows USD ($).
    const isDomestic = formData.countryCode === '+251';
    const isOutsideEthiopia = !isDomestic;

    // Detect user's IP-based location on initial mount to auto-select phone dial code
    useEffect(() => {
        let isMounted = true;

        const detectLocation = async () => {
            let detectedIso = '';

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

            try {
                // 1. Primary: freeipapi.com
                const data1 = await fetchWithTimeout('https://freeipapi.com/api/json');
                if (data1?.countryCode) {
                    detectedIso = data1.countryCode.toUpperCase();
                }

                // 2. Secondary: ipapi.co
                if (!detectedIso) {
                    const data2 = await fetchWithTimeout('https://ipapi.co/json/');
                    if (data2?.country) {
                        detectedIso = data2.country.toUpperCase();
                    }
                }

                // 3. Fallback: Browser timezone
                if (!detectedIso) {
                    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
                    if (tz.includes('Addis_Ababa') || tz.includes('Nairobi') || tz.includes('Asmara')) {
                        detectedIso = 'ET';
                    } else if (tz.startsWith('America/')) {
                        detectedIso = 'US';
                    } else if (tz.startsWith('Europe/London')) {
                        detectedIso = 'GB';
                    } else if (tz.startsWith('Europe/Berlin') || tz.startsWith('Europe/Frankfurt')) {
                        detectedIso = 'DE';
                    } else if (tz.startsWith('Asia/Dubai')) {
                        detectedIso = 'AE';
                    } else if (tz.startsWith('Asia/Riyadh')) {
                        detectedIso = 'SA';
                    }
                }

                if (isMounted && detectedIso) {
                    const matched = countryCodes.find((c) => c.iso.toUpperCase() === detectedIso);
                    if (matched) {
                        setFormData((prev) => ({ ...prev, countryCode: matched.code }));
                        setCountryCode(matched.iso.toUpperCase());
                        setLocation(matched.iso.toUpperCase(), matched.code !== '+251');
                    }
                }
            } catch {
                // Safe default is already +251
            }
        };

        detectLocation();

        return () => {
            isMounted = false;
        };
    }, []);

    // Sync external tier selection if parent changes it
    useEffect(() => {
        if (externalTierId) {
            setSelectedTierId(externalTierId);
            if (externalTierId.startsWith('group-')) {
                setActivePlanTab('group');
            } else {
                setActivePlanTab('individual');
            }
        }
    }, [externalTierId]);

    // Close country dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryPickerRef.current && !countryPickerRef.current.contains(event.target)) {
                setIsCountryPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = countryCodes.filter(
        (c) => c.country.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.includes(searchQuery)
    );

    const selectedCountry = countryCodes.find((c) => c.code === formData.countryCode) || countryCodes[0];

    const pricingPlans = t('pricing.plans');
    const selectedDetails = findPricingTier(language, selectedTierId, isOutsideEthiopia);

    const selectedPlanSummary = selectedDetails
        ? `${selectedDetails.plan.name} · ${selectedDetails.tier.duration} (${selectedDetails.tier.displayCurrency === '$' ? '$ ' : ''}${selectedDetails.tier.displayPrice}${selectedDetails.tier.displayCurrency !== '$' ? ' ' + selectedDetails.tier.displayCurrency : ''} ${t('pricing.perMonth')})`
        : '';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleTierSelect = (tierId) => {
        setSelectedTierId(tierId);
        onSelectPlanTier?.(tierId);
        if (errors.plan) {
            setErrors((prev) => ({ ...prev, plan: '' }));
        }
    };

    const processSelectedFile = (file) => {
        if (!file) return;

        if (!file.type || !file.type.startsWith('image/')) {
            setErrors((prev) => ({ ...prev, photo: 'Please select an image file (PNG, JPG, WEBP).' }));
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, photo: t('registration.validation.fileSize') }));
            return;
        }

        setFormData((prev) => ({ ...prev, photo: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
        if (errors.photo) {
            setErrors((prev) => ({ ...prev, photo: '' }));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        processSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer?.files?.[0]) {
            processSelectedFile(e.dataTransfer.files[0]);
        }
    };

    // Step 1 Validation
    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = t('registration.validation.fullName');
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = t('registration.validation.phoneNumber');
        } else {
            const cleanPhone = formData.phoneNumber.replace(/\s/g, '');
            if (!/^\d{6,15}$/.test(cleanPhone)) {
                newErrors.phoneNumber = t('registration.validation.validPhone');
            }
        }

        if (!formData.telegram.trim()) {
            newErrors.telegram = t('registration.validation.telegram');
        }

        return newErrors;
    };

    // Step 2 Validation
    const validateStep2 = () => {
        const newErrors = {};
        if (!selectedTierId) {
            newErrors.plan = t('registration.validation.plan');
        }
        return newErrors;
    };

    // Step 3 Validation
    const validateStep3 = () => {
        const newErrors = {};
        if (!formData.photo) {
            newErrors.photo = t('registration.validation.photo');
        }
        return newErrors;
    };

    // Move to Step 2
    const handleNextToPlan = () => {
        const step1Errors = validateStep1();
        if (Object.keys(step1Errors).length > 0) {
            setErrors(step1Errors);
            return;
        }
        setErrors({});
        setStep(2);
        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Move to Step 3
    const handleProceedToPayment = () => {
        const step2Errors = validateStep2();
        if (Object.keys(step2Errors).length > 0) {
            setErrors(step2Errors);
            return;
        }
        setErrors({});
        setStep(3);
        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Submit form in Step 3
    const handleSubmit = async (e) => {
        e.preventDefault();

        const step1Errors = validateStep1();
        const step2Errors = validateStep2();
        const step3Errors = validateStep3();
        const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors };

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            if (Object.keys(step1Errors).length > 0) {
                setStep(1);
            } else if (Object.keys(step2Errors).length > 0) {
                setStep(2);
            }
            return;
        }

        setErrors({});
        setStatus('loading');

        try {
            // 1. Process & compress screenshot
            let uploadBlob = formData.photo;
            let fallbackDataUrl = photoPreview || '';

            try {
                const optimized = await compressImage(formData.photo);
                if (optimized.blob) {
                    uploadBlob = optimized.blob;
                }
                if (optimized.dataUrl) {
                    fallbackDataUrl = optimized.dataUrl;
                }
            } catch (optError) {
                console.warn('Image compression notice (continuing with original):', optError);
            }

            let receiptFinalPath = '';

            // 2. Try Supabase Storage upload
            if (isSupabaseConfigured()) {
                try {
                    const rawExt = formData.photo.name?.split('.').pop() || 'jpg';
                    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
                    const fileName = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
                    const contentType = uploadBlob.type || `image/${fileExt === 'png' ? 'png' : 'jpeg'}`;

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('receipts')
                        .upload(fileName, uploadBlob, {
                            cacheControl: '3600',
                            upsert: true,
                            contentType,
                        });

                    if (!uploadError && uploadData) {
                        const { data: publicUrlData } = supabase.storage
                            .from('receipts')
                            .getPublicUrl(fileName);

                        if (publicUrlData?.publicUrl) {
                            receiptFinalPath = publicUrlData.publicUrl;
                        }
                    } else if (uploadError) {
                        console.warn('Supabase storage upload notice, falling back to embedded receipt data:', uploadError);
                    }
                } catch (storageException) {
                    console.warn('Supabase storage exception, falling back to embedded receipt data:', storageException);
                }
            }

            // Fallback to compressed base64 data URL so registration is never dropped
            if (!receiptFinalPath) {
                receiptFinalPath = fallbackDataUrl || photoPreview;
            }

            if (!receiptFinalPath) {
                throw new Error('Could not process payment screenshot. Please choose an image file and try again.');
            }

            // 3. Database insert with adaptive payload schema
            const fullPhone = `${formData.countryCode} ${formData.phoneNumber}`.trim();
            const candidatePayloads = [
                {
                    name: formData.fullName,
                    full_name: formData.fullName,
                    phone_number: formData.phoneNumber,
                    country_code: formData.countryCode,
                    username: formData.telegram,
                    telegram: formData.telegram,
                    uploaded_screenshot: receiptFinalPath,
                    payment_receipt_path: receiptFinalPath,
                    plan: selectedPlanSummary,
                    status: 'pending',
                },
                {
                    name: formData.fullName,
                    full_name: formData.fullName,
                    phone_number: formData.phoneNumber,
                    country_code: formData.countryCode,
                    username: formData.telegram,
                    telegram: formData.telegram,
                    uploaded_screenshot: receiptFinalPath,
                    payment_receipt_path: receiptFinalPath,
                    status: 'pending',
                },
                {
                    name: formData.fullName,
                    phone_number: fullPhone,
                    username: formData.telegram,
                    uploaded_screenshot: receiptFinalPath,
                    status: 'pending',
                },
                {
                    full_name: formData.fullName,
                    country_code: formData.countryCode,
                    phone_number: formData.phoneNumber,
                    telegram: formData.telegram,
                    payment_receipt_path: receiptFinalPath,
                    status: 'pending',
                },
            ];

            let insertSuccess = false;
            let lastDbError = null;

            for (const payload of candidatePayloads) {
                const { error: dbError } = await supabase.from('registrations').insert([payload]);

                if (!dbError) {
                    insertSuccess = true;
                    break;
                } else {
                    lastDbError = dbError;
                    if (dbError.message && dbError.message.includes('column') && dbError.message.includes('does not exist')) {
                        continue;
                    }
                    break;
                }
            }

            if (!insertSuccess && lastDbError) {
                console.error('Database insert error:', lastDbError);
                throw new Error(lastDbError.message || 'Failed to save registration details. Please try again.');
            }

            setStatus('success');
        } catch (error) {
            console.error('Registration submission error:', error);
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    return (
        <section id="register" className="section-container relative bg-dark-950 overflow-hidden py-20 lg:py-28">
            {/* Smooth anchor for #pricing and #register */}
            <div id="pricing" className="absolute -top-28 pointer-events-none" />

            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand-red/8 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* Wide, Centered Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t('hero.badge')} · {t('nav.enrollNow')}</span>
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight font-balderasu">
                        {t('hero.headingLine1')} <span className="text-white italic">{t('hero.headingLine2')}</span>
                    </h2>
                    <p className="text-white/45 text-sm sm:text-base leading-relaxed font-light">
                        {t('registration.sectionDesc')}
                    </p>
                </div>

                {/* Modern 3-Step Progress Tracker */}
                <div className="max-w-2xl mx-auto mb-10">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting track */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 h-[2px] bg-white/10 -z-0">
                            <div
                                className="h-full bg-brand-red transition-all duration-500 ease-out"
                                style={{
                                    width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                                }}
                            />
                        </div>

                        {/* Step 1 Node */}
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                                    step > 1
                                        ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/30'
                                        : step === 1
                                            ? 'bg-dark-950 border-brand-red text-white ring-4 ring-brand-red/20'
                                            : 'bg-dark-950 border-white/20 text-white/40'
                                }`}
                            >
                                {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                            </div>
                            <span
                                className={`text-[11px] font-bold tracking-wider uppercase transition-colors ${
                                    step >= 1 ? 'text-white' : 'text-white/40'
                                }`}
                            >
                                {t('registration.step1')}
                            </span>
                        </button>

                        {/* Step 2 Node */}
                        <button
                            type="button"
                            onClick={() => {
                                const step1Errors = validateStep1();
                                if (Object.keys(step1Errors).length === 0) {
                                    setStep(2);
                                } else {
                                    setErrors(step1Errors);
                                }
                            }}
                            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                                    step > 2
                                        ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/30'
                                        : step === 2
                                            ? 'bg-dark-950 border-brand-red text-white ring-4 ring-brand-red/20'
                                            : 'bg-dark-950 border-white/20 text-white/40'
                                }`}
                            >
                                {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                            </div>
                            <span
                                className={`text-[11px] font-bold tracking-wider uppercase transition-colors ${
                                    step >= 2 ? 'text-white' : 'text-white/40'
                                }`}
                            >
                                {t('registration.step2')}
                            </span>
                        </button>

                        {/* Step 3 Node */}
                        <button
                            type="button"
                            onClick={() => {
                                const step1Errors = validateStep1();
                                const step2Errors = validateStep2();
                                if (Object.keys(step1Errors).length === 0 && Object.keys(step2Errors).length === 0) {
                                    setStep(3);
                                }
                            }}
                            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                                    step === 3
                                        ? 'bg-dark-950 border-brand-red text-white ring-4 ring-brand-red/20'
                                        : 'bg-dark-950 border-white/20 text-white/40'
                                }`}
                            >
                                3
                            </div>
                            <span
                                className={`text-[11px] font-bold tracking-wider uppercase transition-colors ${
                                    step === 3 ? 'text-white' : 'text-white/40'
                                }`}
                            >
                                {t('registration.step3')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Main Card Container */}
                <div className="registration-card-premium w-full">
                    {/* STEP 1: PERSONAL DETAILS */}
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-2xl mx-auto space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                                        {t('registration.step1Title')}
                                    </h3>
                                    <p className="text-white/40 text-xs sm:text-sm mt-1.5 leading-relaxed">
                                        {t('registration.step1Desc')}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-2">
                                        <label className="label-premium">{t('registration.fullName')}</label>
                                        <div className="relative group">
                                            <div className="input-icon-wrapper-premium">
                                                <User className="w-4.5 h-4.5" />
                                            </div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder={t('registration.fullNamePlaceholder')}
                                                className={`input-premium ${errors.fullName ? 'border-red-500/50 bg-red-500/[0.02]' : ''}`}
                                            />
                                        </div>
                                        {errors.fullName && (
                                            <span className="text-xs text-red-400 font-semibold mt-1 ml-1 block">
                                                {errors.fullName}
                                            </span>
                                        )}
                                    </div>

                                    {/* Phone Number with Country Code Dropdown */}
                                    <div className="flex flex-col gap-2">
                                        <label className="label-premium">{t('registration.phoneNumber')}</label>
                                        <div className="grid grid-cols-[105px_1fr] sm:grid-cols-[120px_1fr] gap-3">
                                            {/* Country Picker Dropdown */}
                                            <div className="relative" ref={countryPickerRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                                                    className="country-trigger-premium"
                                                >
                                                    <div className="w-5 h-3.5 flex items-center justify-center rounded-[2px] overflow-hidden drop-shadow-sm shrink-0">
                                                        <img
                                                            src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
                                                            srcSet={`https://flagcdn.com/w40/${selectedCountry.iso}.png 2x`}
                                                            alt={selectedCountry.country}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold">{selectedCountry.code}</span>
                                                    <ChevronDown
                                                        className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${
                                                            isCountryPickerOpen ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {isCountryPickerOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="dropdown-premium w-64 max-h-72 overflow-hidden flex flex-col z-50 shadow-2xl"
                                                        >
                                                            <div className="p-2.5 border-b border-white/5">
                                                                <div className="relative">
                                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search country or code..."
                                                                        value={searchQuery}
                                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-brand-red/50"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="overflow-y-auto custom-scrollbar flex-1">
                                                                {filteredCountries.map((c, i) => (
                                                                    <button
                                                                        key={`${c.iso}-${i}`}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                countryCode: c.code,
                                                                            }));
                                                                            setCountryCode(c.iso.toUpperCase());
                                                                            setLocation(c.iso.toUpperCase(), c.code !== '+251');
                                                                            setIsCountryPickerOpen(false);
                                                                            if (errors.phoneNumber) {
                                                                                setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                                                                            }
                                                                        }}
                                                                        className={`w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${
                                                                            formData.countryCode === c.code ? 'bg-brand-red/15' : ''
                                                                        }`}
                                                                    >
                                                                        <div className="w-5 h-3.5 shrink-0 flex items-center justify-center rounded-[2px] overflow-hidden drop-shadow-xs">
                                                                            <img
                                                                                src={`https://flagcdn.com/w20/${c.iso}.png`}
                                                                                srcSet={`https://flagcdn.com/w40/${c.iso}.png 2x`}
                                                                                alt={c.country}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col min-w-0 flex-1">
                                                                            <span className="text-xs font-bold text-white truncate">{c.country}</span>
                                                                            <span className="text-[10px] text-white/40">{c.code}</span>
                                                                        </div>
                                                                        {formData.countryCode === c.code && (
                                                                            <CheckCircle className="w-3.5 h-3.5 text-brand-red shrink-0" />
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Phone Input */}
                                            <div className="relative group">
                                                <div className="input-icon-wrapper-premium">
                                                    <Phone className="w-4.5 h-4.5" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleChange}
                                                    placeholder="911 22 33 44"
                                                    className={`input-premium ${errors.phoneNumber ? 'border-red-500/50 bg-red-500/[0.02]' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        {errors.phoneNumber && (
                                            <span className="text-xs text-red-400 font-semibold mt-1 ml-1 block">
                                                {errors.phoneNumber}
                                            </span>
                                        )}
                                    </div>

                                    {/* Telegram Username */}
                                    <div className="flex flex-col gap-2">
                                        <label className="label-premium">{t('registration.telegram')}</label>
                                        <div className="relative group">
                                            <div className="input-icon-wrapper-premium">
                                                <Send className="w-4.5 h-4.5" />
                                            </div>
                                            <input
                                                type="text"
                                                name="telegram"
                                                value={formData.telegram}
                                                onChange={handleChange}
                                                placeholder={t('registration.telegramPlaceholder')}
                                                className={`input-premium ${errors.telegram ? 'border-red-500/50 bg-red-500/[0.02]' : ''}`}
                                            />
                                        </div>
                                        {errors.telegram && (
                                            <span className="text-xs text-red-400 font-semibold mt-1 ml-1 block">
                                                {errors.telegram}
                                            </span>
                                        )}
                                    </div>

                                    {/* Next: Choose Plan Button */}
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={handleNextToPlan}
                                            className="btn-premium-action group"
                                        >
                                            <span>{t('registration.nextChoosePlan')}</span>
                                            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: CHOOSE PLAN & PRICING */}
                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="text-center max-w-2xl mx-auto">
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                                        {t('registration.step2Title')}
                                    </h3>
                                    <p className="text-white/40 text-xs sm:text-sm mt-1.5 leading-relaxed">
                                        {t('registration.step2Desc')}
                                    </p>
                                </div>

                                {/* Plan Type Switcher (Individual appears FIRST!) */}
                                <div className="max-w-md mx-auto grid grid-cols-2 gap-3 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActivePlanTab('individual');
                                            if (!selectedTierId || selectedTierId.startsWith('group-')) {
                                                handleTierSelect('individual-6m');
                                            }
                                        }}
                                        className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                            activePlanTab === 'individual'
                                                ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                                                : 'text-white/50 hover:text-white'
                                        }`}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{pricingPlans?.individual?.name || 'Individual Plan'}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-bold uppercase tracking-wider">
                                            1-on-1
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActivePlanTab('group');
                                            handleTierSelect('group-unified');
                                        }}
                                        className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                            activePlanTab === 'group'
                                                ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                                                : 'text-white/50 hover:text-white'
                                        }`}
                                    >
                                        <Users className="w-4 h-4" />
                                        <span>{pricingPlans?.group?.name || 'Group Plan'}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-bold uppercase tracking-wider">
                                            5 People
                                        </span>
                                    </button>
                                </div>

                                {/* Active Plan Content */}
                                <div>
                                    {activePlanTab === 'individual' ? (
                                        /* 3 Cards for Individual Plan */
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            {pricingPlans?.individual?.tiers?.map((tier, idx) => {
                                                const isSelected = selectedTierId === tier.id;
                                                const currentPrice = isOutsideEthiopia ? tier.priceUsd : tier.price;
                                                const currentCurrency = isOutsideEthiopia ? '$' : t('pricing.currency');
                                                const isFeatured = idx === 1; // 6 Months is balanced/popular

                                                return (
                                                    <div
                                                        key={tier.id}
                                                        onClick={() => handleTierSelect(tier.id)}
                                                        className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                                                            isSelected
                                                                ? 'bg-brand-red/10 border-brand-red shadow-[0_0_35px_rgba(152,28,0,0.25)] ring-1 ring-brand-red'
                                                                : isFeatured
                                                                    ? 'bg-white/[0.025] border-brand-red/30 hover:border-brand-red/60'
                                                                    : 'bg-white/[0.015] border-white/10 hover:border-white/25 hover:bg-white/[0.03]'
                                                        }`}
                                                    >
                                                        {/* Top Glow on hover */}
                                                        <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-red/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                                                        <div>
                                                            {/* Duration & Tag */}
                                                            <div className="flex items-start justify-between gap-2 mb-4">
                                                                <div>
                                                                    <h4 className="font-heading text-lg sm:text-xl font-black text-white leading-tight">
                                                                        {tier.duration}
                                                                    </h4>
                                                                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-red mt-1">
                                                                        {tier.tag}
                                                                    </span>
                                                                </div>

                                                                {isSelected && (
                                                                    <span className="p-1 rounded-full bg-brand-red text-white shrink-0">
                                                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Price Display */}
                                                            <div className="pb-5 mb-5 border-b border-white/10">
                                                                <div className="flex items-baseline gap-1.5">
                                                                    {isOutsideEthiopia && (
                                                                        <span className="text-2xl font-black text-brand-red">$</span>
                                                                    )}
                                                                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                                                        {currentPrice}
                                                                    </span>
                                                                    {!isOutsideEthiopia && (
                                                                        <span className="text-sm font-bold text-white/70">
                                                                            {currentCurrency}
                                                                        </span>
                                                                    )}
                                                                    {isOutsideEthiopia && (
                                                                        <span className="text-xs font-bold text-white/50 uppercase">
                                                                            USD
                                                                        </span>
                                                                    )}
                                                                    <span className="text-xs text-white/40">
                                                                        {t('pricing.perMonth')}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Features List */}
                                                            <div className="space-y-2.5 text-xs text-white/75 font-medium">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-3.5 h-3.5 text-brand-red shrink-0" />
                                                                    <span>{tier.daysPerWeek}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-3.5 h-3.5 text-brand-red shrink-0" />
                                                                    <span>{tier.hoursPerDay}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <User className="w-3.5 h-3.5 text-brand-red shrink-0" />
                                                                    <span>{pricingPlans?.individual?.formatLabel}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-white/60">
                                                                    <CheckCircle className="w-3.5 h-3.5 text-white/30 shrink-0" />
                                                                    <span>{t('pricing.onlineLabel')}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Selection Button */}
                                                        <div className="pt-6 mt-6 border-t border-white/5">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleTierSelect(tier.id);
                                                                }}
                                                                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                                                    isSelected
                                                                        ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                                                                        : 'bg-white/5 hover:bg-white/10 text-white/80'
                                                                }`}
                                                            >
                                                                {isSelected ? (
                                                                    <>
                                                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                                        <span>{t('registration.selectedPlan')}</span>
                                                                    </>
                                                                ) : (
                                                                    <span>{t('registration.selectPlan')}</span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        /* Unified Single Card for Group Plan */
                                        <div className="max-w-xl mx-auto">
                                            {pricingPlans?.group?.tiers?.map((tier) => {
                                                const isSelected = selectedTierId === tier.id || selectedTierId?.startsWith('group-');
                                                const currentPrice = isOutsideEthiopia ? tier.priceUsd : tier.price;
                                                const currentCurrency = isOutsideEthiopia ? '$' : t('pricing.currency');

                                                return (
                                                    <div
                                                        key={tier.id}
                                                        onClick={() => handleTierSelect(tier.id)}
                                                        className={`p-7 sm:p-9 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                                                            isSelected
                                                                ? 'bg-brand-red/10 border-brand-red shadow-[0_0_35px_rgba(152,28,0,0.25)] ring-1 ring-brand-red'
                                                                : 'bg-white/[0.025] border-white/10 hover:border-brand-red/40 hover:bg-white/[0.04]'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                                            <div>
                                                                <span className="inline-block px-3 py-1 rounded-md bg-brand-red/15 text-brand-red text-[10px] font-bold uppercase tracking-wider mb-2">
                                                                    {tier.tag}
                                                                </span>
                                                                <h4 className="font-heading text-2xl font-black text-white">
                                                                    {tier.duration}
                                                                </h4>
                                                                <p className="text-white/45 text-xs mt-1">
                                                                    {pricingPlans?.group?.description}
                                                                </p>
                                                            </div>

                                                            <div className="text-left sm:text-right shrink-0">
                                                                <div className="flex items-baseline gap-1.5 sm:justify-end">
                                                                    {isOutsideEthiopia && (
                                                                        <span className="text-2xl font-black text-brand-red">$</span>
                                                                    )}
                                                                    <span className="text-4xl font-black text-white tracking-tight">
                                                                        {currentPrice}
                                                                    </span>
                                                                    {!isOutsideEthiopia && (
                                                                        <span className="text-sm font-bold text-white/70">
                                                                            {currentCurrency}
                                                                        </span>
                                                                    )}
                                                                    {isOutsideEthiopia && (
                                                                        <span className="text-xs font-bold text-white/50 uppercase">
                                                                            USD
                                                                        </span>
                                                                    )}
                                                                    <span className="text-xs text-white/40">
                                                                        {t('pricing.perMonth')}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[11px] text-white/40 mt-1">
                                                                    {pricingPlans?.group?.formatLabel}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Features Grid */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-5 border-y border-white/10 text-xs text-white/80">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-brand-red shrink-0" />
                                                                <span>{tier.daysPerWeek}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-brand-red shrink-0" />
                                                                <span>{tier.hoursPerDay}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-brand-red shrink-0" />
                                                                <span>{pricingPlans?.group?.formatLabel}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                                                                <span>{t('pricing.onlineLabel')}</span>
                                                            </div>
                                                        </div>

                                                        {/* Select Button */}
                                                        <div className="pt-6">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleTierSelect(tier.id);
                                                                }}
                                                                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                                                    isSelected
                                                                        ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                                                                        : 'bg-white/5 hover:bg-white/10 text-white/80'
                                                                }`}
                                                            >
                                                                {isSelected ? (
                                                                    <>
                                                                        <Check className="w-4 h-4 stroke-[3]" />
                                                                        <span>{t('registration.selectedPlan')}</span>
                                                                    </>
                                                                ) : (
                                                                    <span>{t('registration.selectPlan')}</span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {errors.plan && (
                                    <div className="text-center text-xs text-red-400 font-semibold">
                                        {errors.plan}
                                    </div>
                                )}

                                {/* Step 2 Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>{t('registration.backToDetails')}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleProceedToPayment}
                                        className="btn-premium-action w-full sm:w-auto sm:min-w-[240px] group"
                                    >
                                        <span>{t('registration.proceedToPayment')}</span>
                                        <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: PAYMENT & RECEIPT UPLOAD */}
                        {step === 3 && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-3xl mx-auto space-y-8"
                            >
                                <div className="text-center mb-6">
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                                        {t('registration.step3Title')}
                                    </h3>
                                    <p className="text-white/40 text-xs sm:text-sm mt-1.5 leading-relaxed">
                                        {t('registration.step3Desc')}
                                    </p>
                                </div>

                                {/* Selected Plan Summary Card */}
                                {selectedDetails && (
                                    <div className="price-card-premium">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                                                {t('registration.amountToPay')}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="text-xs font-bold uppercase tracking-wider text-brand-red hover:underline cursor-pointer flex items-center gap-1"
                                            >
                                                {t('registration.changePlan')}
                                            </button>
                                        </div>

                                        <div className="flex items-baseline gap-2 mt-2">
                                            {isOutsideEthiopia && (
                                                <span className="text-2xl font-black text-brand-red">$</span>
                                            )}
                                            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                                {selectedDetails.tier.displayPrice}
                                            </span>
                                            {!isOutsideEthiopia && (
                                                <span className="text-base font-bold text-white/80">
                                                    {selectedDetails.tier.displayCurrency}
                                                </span>
                                            )}
                                            {isOutsideEthiopia && (
                                                <span className="text-xs font-bold text-white/60 uppercase">
                                                    USD
                                                </span>
                                            )}
                                            <span className="text-xs text-white/40">{t('pricing.perMonth')}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs font-semibold text-white/80">
                                            <span className="px-2.5 py-0.5 rounded-md bg-brand-red/20 text-brand-red font-bold text-[10px] uppercase tracking-wider">
                                                {selectedDetails.plan.name}
                                            </span>
                                            <span>·</span>
                                            <span>{selectedDetails.tier.duration}</span>
                                            <span>·</span>
                                            <span>{selectedDetails.tier.daysPerWeek}</span>
                                            <span>·</span>
                                            <span>{selectedDetails.tier.hoursPerDay}</span>
                                        </div>

                                        <p className="text-white/40 text-xs mt-3 leading-relaxed">
                                            {t('registration.planPaymentNote')}
                                        </p>
                                    </div>
                                )}

                                {/* Payment Accounts Section */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                                        {isDomestic ? t('registration.pathTitle2') : t('registration.internationalPaymentGuidance')}
                                    </h4>

                                    {/* Domestic Accounts */}
                                    {isDomestic ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <PaymentCard
                                                name="Commercial Bank of Ethiopia (CBE)"
                                                accountNumber="1000432170393"
                                                logo={CBELogo}
                                                color="yellow-500"
                                            />
                                            <PaymentCard
                                                name="Telebirr"
                                                accountNumber="0920312156"
                                                logo={TelebirrLogo}
                                                color="blue-500"
                                            />
                                        </div>
                                    ) : (
                                        /* International / Diaspora Accounts */
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <PaymentCard
                                                    name="CBE (Wire / Remitly / Western Union)"
                                                    accountNumber="1000432170393"
                                                    logo={CBELogo}
                                                    color="yellow-500"
                                                />
                                                <PaymentCard
                                                    name="Telebirr Inward Remittance"
                                                    accountNumber="+251920312156"
                                                    logo={TelebirrLogo}
                                                    color="blue-500"
                                                />
                                            </div>

                                            {/* International Remittance Guidance Box */}
                                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/60 space-y-2">
                                                <p className="text-white/80 font-semibold">
                                                    {t('registration.internationalAccountDesc')}
                                                </p>
                                                <p>
                                                    {t('registration.supportHelp')}{' '}
                                                    <span className="text-white font-mono font-bold">+251 920 312 156</span>{' '}
                                                    or Telegram{' '}
                                                    <a
                                                        href="https://t.me/Enzira_Begena"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-brand-red font-bold hover:underline"
                                                    >
                                                        @Enzira_Begena
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Form Submission - Receipt Upload */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="label-premium">{t('registration.proofOfPayment')}</label>
                                        <label
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`upload-zone-premium cursor-pointer transition-all duration-200 ${
                                                errors.photo ? 'has-error' : ''
                                            } ${isDragging ? 'ring-2 ring-brand-red bg-brand-red/10' : ''}`}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onClick={(e) => {
                                                    e.target.value = null;
                                                }}
                                                onChange={handlePhotoChange}
                                            />
                                            {photoPreview ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="relative w-28 h-28 mx-auto rounded-xl overflow-hidden border border-brand-red/50 hover:scale-105 transition-transform duration-300 shadow-xl">
                                                        <img src={photoPreview} alt="Receipt Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-xs text-brand-red font-bold uppercase tracking-wider hover:underline">
                                                        Click or drop to replace image
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2.5 py-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                                                        <Upload className="w-6 h-6 text-white/40 group-hover:text-inherit" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-white/80 text-xs sm:text-sm font-bold">
                                                            {t('registration.uploadText')}
                                                        </p>
                                                        <p className="text-white/30 text-[10px] mt-1 uppercase tracking-widest">
                                                            {t('registration.uploadHint')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                        {errors.photo && (
                                            <span className="text-xs text-red-400 font-semibold mt-1 ml-1 block">
                                                {errors.photo}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>{t('registration.backToPlans')}</span>
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="btn-premium-action w-full sm:w-auto sm:min-w-[240px] group"
                                        >
                                            {status === 'loading' ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>{t('registration.submitting')}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span>{t('registration.submitButton')}</span>
                                                    <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submission Error Feedback */}
                    <AnimatePresence>
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-3 text-red-400 text-xs sm:text-sm"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{errorMessage}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={status === 'success'}
                onClose={() => {
                    setStatus('idle');
                    setStep(1);
                    setFormData({
                        fullName: '',
                        countryCode: '+251',
                        phoneNumber: '',
                        telegram: '',
                        photo: null,
                    });
                    setPhotoPreview(null);
                }}
                userData={{ ...formData, selectedPlan: selectedPlanSummary }}
            />
        </section>
    );
};

export default RegistrationForm;
