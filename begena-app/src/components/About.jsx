import { motion } from 'framer-motion';
import { History, GraduationCap, Music, PlayCircle, Calendar, Globe, Clock, User } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const About = () => {
    const { t } = useLanguage();
    const features = [
        {
            icon: History,
            title: t('about.feature1Title'),
            description: t('about.feature1Desc'),
            color: "brand-red"
        },
        {
            icon: Music,
            title: t('about.feature2Title'),
            description: t('about.feature2Desc'),
            color: "brand-red"
        },
        {
            icon: GraduationCap,
            title: t('about.feature3Title'),
            description: t('about.feature3Desc'),
            color: "brand-red"
        },
        {
            icon: PlayCircle,
            title: t('about.feature4Title'),
            description: t('about.feature4Desc'),
            color: "brand-red"
        }
    ];

    const scheduleHighlights = [
        {
            icon: Calendar,
            title: t('about.scheduleItem1Title'),
            description: t('about.scheduleItem1Desc'),
        },
        {
            icon: Globe,
            title: t('about.scheduleItem2Title'),
            description: t('about.scheduleItem2Desc'),
        },
        {
            icon: Clock,
            title: t('about.scheduleItem3Title'),
            description: t('about.scheduleItem3Desc'),
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section id="about" className="section-container relative overflow-hidden bg-dark-950">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-red/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <h4 className="text-brand-red font-bold tracking-[0.3em] uppercase text-xs mb-6">{t('about.subtitle')}</h4>
                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                            {t('about.titleLine1')} <br />
                            <span className="italic text-white">{t('about.titleLine2')}</span>
                        </h2>
                        <p className="text-white/40 text-lg leading-relaxed max-w-2xl">
                            {t('about.description')}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="glass-card p-8 group relative overflow-hidden"
                        >
                            {/* Hover glow */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-red/0 group-hover:bg-brand-red/10 rounded-full blur-2xl transition-all duration-700 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-red/20 to-brand-red/5 border border-brand-red/20 flex items-center justify-center mb-6 group-hover:from-brand-red group-hover:to-brand-red-light group-hover:border-brand-red transition-all duration-500">
                                    <feature.icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="font-heading text-lg font-bold text-white mb-3 relative overflow-hidden">
                                    <span className="relative z-10">
                                        {feature.title}
                                    </span>
                                </h3>
                                <p className="text-white/30 text-sm leading-relaxed font-light group-hover:text-white/50 transition-colors duration-500">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-linear-to-r from-brand-red to-transparent group-hover:w-full transition-all duration-700" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Individual Plan & Schedule Highlight */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mt-8 rounded-xl bg-linear-to-br from-[#140502]/60 to-[#0a0201]/80 backdrop-blur-xl border border-brand-red/20 p-6 md:p-8 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                >
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="lg:max-w-xs">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-red/10 border border-brand-red/20 mb-3">
                                <User className="w-3.5 h-3.5 text-brand-red" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">
                                    {t('about.scheduleBadge')}
                                </span>
                            </div>
                            <h3 className="font-heading text-xl font-bold text-white mb-1.5">
                                {t('about.scheduleTitle')}
                            </h3>
                            <p className="text-white/40 text-xs leading-relaxed font-light">
                                {t('about.scheduleSubtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:flex-1 lg:pl-8 lg:border-l lg:border-white/10">
                            {scheduleHighlights.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-red/30 hover:bg-white/[0.04] transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-300">
                                        <item.icon className="w-4.5 h-4.5 text-brand-red group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-sm font-bold text-white mb-0.5">
                                            {item.title}
                                        </h4>
                                        <p className="text-white/40 text-xs leading-relaxed font-light group-hover:text-white/60 transition-colors">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
