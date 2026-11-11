import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, User, Calendar, Clock, Globe, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../lib/LanguageContext';

const Pricing = () => {
    const { t, language, toggleLanguage } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedPlan = searchParams.get('plan') === 'individual' ? 'individual' : 'group';

    const handleSelectPlan = (planKey) => {
        setSearchParams({ plan: planKey }, { replace: true });
    };

    const planOptions = [
        {
            key: 'group',
            icon: Users,
            data: t('pricing.plans.group'),
        },
        {
            key: 'individual',
            icon: User,
            data: t('pricing.plans.individual'),
        },
    ];

    const activePlan = t(`pricing.plans.${selectedPlan}`);
    const tiers = Array.isArray(activePlan?.tiers) ? activePlan.tiers : [];
    const FormatIcon = selectedPlan === 'group' ? Users : User;

    return (
        <div className="min-h-screen bg-dark-950 flex flex-col">
            <Navbar />

            <main className="flex-1 section-container pt-32 lg:pt-40 relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-brand-red/8 rounded-full blur-[130px] pointer-events-none -z-10" />
                <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-brand-red/5 rounded-full blur-[130px] pointer-events-none -z-10" />

                <div className="max-w-6xl mx-auto">
                    {/* Top Utility Row */}
                    <div className="flex items-center justify-between gap-4 mb-10">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{t('pricing.backToHome')}</span>
                        </Link>

                        <button
                            type="button"
                            onClick={toggleLanguage}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-brand-red/40 text-white/70 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                        >
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold">
                                {t('nav.languageBadge')}
                            </span>
                            <span>{t('nav.language')}</span>
                        </button>
                    </div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-14"
                    >
                        <h4 className="text-brand-red font-bold tracking-[0.3em] uppercase text-xs mb-5">
                            {t('pricing.badge')}
                        </h4>
                        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            {t('pricing.titleLine1')}{' '}
                            <span className="italic text-white">{t('pricing.titleLine2')}</span>
                        </h1>
                        <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                            {t('pricing.description')}
                        </p>
                    </motion.div>

                    {/* Step 1: Plan Selector (Group vs Individual) */}
                    <div className="max-w-3xl mx-auto mb-14">
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-5">
                            {t('pricing.step1Label')}
                        </p>

                        <div
                            role="radiogroup"
                            aria-label={t('pricing.step1Label')}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {planOptions.map((option) => {
                                const isActive = selectedPlan === option.key;
                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        role="radio"
                                        aria-checked={isActive}
                                        onClick={() => handleSelectPlan(option.key)}
                                        className={`text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                                            isActive
                                                ? 'bg-brand-red/10 border-brand-red shadow-[0_0_35px_rgba(152,28,0,0.2)]'
                                                : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                                                        isActive
                                                            ? 'bg-brand-red border-brand-red text-white'
                                                            : 'bg-white/5 border-white/10 text-brand-red group-hover:border-brand-red/40'
                                                    }`}
                                                >
                                                    <option.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="font-heading text-lg font-bold text-white">
                                                        {option.data.name}
                                                    </h2>
                                                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-red">
                                                        {option.data.badge}
                                                    </span>
                                                </div>
                                            </div>

                                            {isActive && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {t('pricing.selectedBadge')}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-white/45 text-xs leading-relaxed font-light">
                                            {option.data.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Pricing Tiers for Selected Plan */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 px-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                                {t('pricing.step2Label')}
                            </p>
                            <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                                <FormatIcon className="w-4 h-4 text-brand-red" />
                                <span>{activePlan.name}</span>
                                <span className="text-white/30">·</span>
                                <span className="text-brand-red">{activePlan.badge}</span>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${selectedPlan}-${language}`}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {tiers.map((tier, index) => {
                                    const isHighlighted = index === 1;
                                    return (
                                        <div
                                            key={tier.id}
                                            className={`glass-card p-8 flex flex-col justify-between relative overflow-hidden group ${
                                                isHighlighted ? 'border-brand-red/35!' : ''
                                            }`}
                                        >
                                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-red/0 group-hover:bg-brand-red/12 rounded-full blur-2xl transition-all duration-700 pointer-events-none" />

                                            <div className="relative z-10">
                                                {/* Duration & Tag */}
                                                <div className="flex items-center justify-between gap-3 mb-6">
                                                    <h3 className="font-heading text-2xl font-black text-white">
                                                        {tier.duration}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                                            isHighlighted
                                                                ? 'bg-brand-red/15 border-brand-red/30 text-brand-red'
                                                                : 'bg-white/5 border-white/10 text-white/50'
                                                        }`}
                                                    >
                                                        {tier.tag}
                                                    </span>
                                                </div>

                                                {/* Monthly Price */}
                                                <div className="pb-6 mb-6 border-b border-white/10">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-heading text-4xl font-black text-white tracking-tight">
                                                            {tier.price}
                                                        </span>
                                                        <span className="text-sm font-bold text-white/70">
                                                            {t('pricing.currency')}
                                                        </span>
                                                        <span className="text-xs text-white/40">
                                                            {t('pricing.perMonth')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Schedule Details */}
                                                <ul className="space-y-4 mb-8">
                                                    <li className="flex items-center gap-3 text-sm text-white/80">
                                                        <div className="w-8 h-8 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
                                                            <Calendar className="w-4 h-4 text-brand-red" />
                                                        </div>
                                                        <span>{tier.daysPerWeek}</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 text-sm text-white/80">
                                                        <div className="w-8 h-8 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
                                                            <Clock className="w-4 h-4 text-brand-red" />
                                                        </div>
                                                        <span>{tier.hoursPerDay}</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 text-sm text-white/80">
                                                        <div className="w-8 h-8 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
                                                            <FormatIcon className="w-4 h-4 text-brand-red" />
                                                        </div>
                                                        <span>{activePlan.formatLabel}</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 text-sm text-white/60">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                            <Globe className="w-4 h-4 text-brand-red" />
                                                        </div>
                                                        <span>{t('pricing.onlineLabel')}</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <Link
                                                to="/#register"
                                                className={`relative z-10 w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                                                    isHighlighted
                                                        ? 'bg-brand-red hover:bg-brand-red-light text-white shadow-lg shadow-brand-red/25'
                                                        : 'bg-white/5 hover:bg-brand-red text-white border border-white/10 hover:border-brand-red'
                                                }`}
                                            >
                                                <span>{t('pricing.enrollAction')}</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>

                                            {/* Bottom accent line */}
                                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-linear-to-r from-brand-red to-transparent group-hover:w-full transition-all duration-700" />
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
