import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BookOpen, CheckCircle, X, ChevronRight, Phone, Send, Instagram, Mail, Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const TermsModal = ({ isOpen: controlledIsOpen, onClose: controlledOnClose }) => {
    const { language } = useLanguage();
    const isAm = language === 'am';

    const [hasAgreed, setHasAgreed] = useState(true); // default true to avoid flash before effect
    const [isFullOpen, setIsFullOpen] = useState(false);

    useEffect(() => {
        const agreed = localStorage.getItem('enzira_terms_accepted') === 'true';
        setHasAgreed(agreed);

        const handleOpenTerms = () => {
            setIsFullOpen(true);
        };
        window.addEventListener('open-enzira-terms', handleOpenTerms);
        return () => window.removeEventListener('open-enzira-terms', handleOpenTerms);
    }, []);

    const isModalActive = controlledIsOpen !== undefined ? controlledIsOpen : isFullOpen;

    const handleAgree = () => {
        localStorage.setItem('enzira_terms_accepted', 'true');
        setHasAgreed(true);
        setIsFullOpen(false);
        controlledOnClose?.();
    };

    const handleCloseModal = () => {
        setIsFullOpen(false);
        controlledOnClose?.();
    };

    return (
        <>
            {/* Small Floating Banner (shows when user has not yet agreed) */}
            <AnimatePresence>
                {!hasAgreed && !isModalActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] p-5 sm:p-6 rounded-2xl bg-dark-900/95 backdrop-blur-2xl border border-brand-red/30 shadow-[0_12px_45px_rgba(0,0,0,0.85)]"
                    >
                        {/* Glow accent */}
                        <div className="absolute -top-10 -right-10 w-28 h-28 bg-brand-red/15 rounded-full blur-2xl pointer-events-none" />

                        <div className="relative z-10 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center shrink-0 text-brand-red">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <h4 className="font-heading text-sm font-bold text-white tracking-wide">
                                        {isAm ? 'የአገልግሎት ውሎች እና መመሪያዎች' : 'Terms of Service & Guidelines'}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-brand-red/15 text-brand-red border border-brand-red/25">
                                        Enzira
                                    </span>
                                </div>
                                <p className="text-white/60 text-xs leading-relaxed mb-4">
                                    {isAm
                                        ? 'እንኳን ወደ እንዚራ በገና በደኅና መጡ! ትምህርታችንን ከመጀመርዎ በፊት እባክዎ የአገልግሎት ውሎችንና መመሪያዎችን ይመልከቱ።'
                                        : 'Welcome to Enzira Begena! Learn the sacred art of the Begena. Please review and accept our terms & guidelines to proceed.'}
                                </p>

                                <div className="flex items-center gap-2.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsFullOpen(true)}
                                        className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <BookOpen className="w-3.5 h-3.5 text-brand-red" />
                                        <span>{isAm ? 'ሙሉውን አንብብ' : 'Read Full'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAgree}
                                        className="flex-1 py-2 px-3 rounded-lg bg-brand-red hover:bg-brand-red-light text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-brand-red/25 transition-all cursor-pointer"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span>{isAm ? 'እስማማለሁ' : 'I Agree'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Terms & Conditions Modal */}
            <AnimatePresence>
                {isModalActive && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10 w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-dark-900 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-white/[0.02]">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center shrink-0 text-brand-red">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
                                            {isAm ? 'የእንዚራ በገና ይፋዊ ደንብ' : 'Enzira Begena Official Code'}
                                        </span>
                                        <h3 className="font-heading text-lg sm:text-xl font-black text-white mt-0.5">
                                            {isAm ? 'እንኳን ወደ እንዚራ በገና (Enzira Begena) በደኅና መጡ!' : 'Welcome to Enzira Begena!'}
                                        </h3>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Scrollable Body */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7 custom-scrollbar text-white/85 text-sm sm:text-base leading-relaxed">
                                {/* Intro Banner */}
                                <div className="p-5 rounded-xl bg-brand-red/[0.07] border border-brand-red/20 space-y-2">
                                    <div className="flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-wider">
                                        <Sparkles className="w-4 h-4" />
                                        <span>{isAm ? 'መግቢያ' : 'Introduction'}</span>
                                    </div>
                                    <p className="text-white/80 leading-relaxed text-sm">
                                        {isAm
                                            ? 'እንዚራ በገና፤ መንፈሳዊውን የበገና ጥበብ እና ድርደራ በዓለም ዙሪያ ለሚገኙ ኢትዮጵያውያን ተደራሽ ለማድረግ የተመሠረተ የጥበብ ማዕከል ነው። ትምህርት ቤታችን ካካበተው ሰፊ የማስተማር ልምድ እና በዘርፉ ካለው ጥልቅ እውቀት በመነሳት፣ የበገናን ጥበብ ከመሠረቱ ጀምሮ እስከ ጥልቁ የዜማ ስልት ድረስ በዘመናዊ የዲጂታል ዘዴዎች ያስተምራል።'
                                            : 'Enzira Begena is a sacred art institute founded to make the spiritual art of the Begena accessible to devotees worldwide. Building upon extensive instructional experience and deep cultural mastery, our school teaches the Begena from foundational fingering up to advanced hymn accompaniment using modern digital methods.'}
                                    </p>
                                </div>

                                {/* Section 1 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 text-white font-heading font-bold text-base border-b border-white/5 pb-2">
                                        <span className="w-6 h-6 rounded-md bg-brand-red/20 text-brand-red text-xs font-black flex items-center justify-center">1</span>
                                        <span>{isAm ? 'የትምህርት ቤቱ ራዕይና ዓላማ' : 'Vision & Objectives'}</span>
                                    </div>
                                    <ul className="space-y-2.5 pl-2 text-sm text-white/75">
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'የጥበብ ትውፊት፦ ' : 'Preserving Sacred Tradition: '}</strong>
                                                <span>{isAm ? 'ጥንታዊውን የበገና ድርደራ ሳይበረዝ እና ሳይከለስ ለትውልድ ማስተላለፍ።' : 'Preserving and transmitting authentic ancient Begena traditions across generations without dilution.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ተደራሽነት፦ ' : 'Global Accessibility: '}</strong>
                                                <span>{isAm ? 'የቦታ እና የሰዓት ገደብ ሳይበግረው፣ ምእመናን ባሉበት ሆነው የበገናን ምስጢር እንዲረዱ ማስቻል።' : 'Overcoming time zone and geographic boundaries so students worldwide can master the Begena from home.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'መንፈሳዊ ዕርካታ፦ ' : 'Spiritual Fulfillment: '}</strong>
                                                <span>{isAm ? 'በገና የጸሎት መሣሪያ እንደመሆኑ፣ ተማሪዎች የቴክኒክ ብቃቱን ብቻ ሳይሆን መንፈሳዊውንም ለዛ እንዲቀስሙ ማድረግ።' : 'As the Begena is a sacred instrument of prayer, fostering profound spiritual depth alongside technical dexterity.'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Section 2 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 text-white font-heading font-bold text-base border-b border-white/5 pb-2">
                                        <span className="w-6 h-6 rounded-md bg-brand-red/20 text-brand-red text-xs font-black flex items-center justify-center">2</span>
                                        <span>{isAm ? 'የትምህርት አሰጣጥ ስልት' : 'Teaching Methodology'}</span>
                                    </div>
                                    <p className="text-xs text-white/50 italic">
                                        {isAm ? 'ትምህርቱ በቴክኖሎጂ የታገዘ እና የተማሪን የመረዳት አቅም መሠረት ያደረገ ነው፦' : 'Instruction is technology-assisted and customized to each student’s pace:'}
                                    </p>
                                    <ul className="space-y-2.5 pl-2 text-sm text-white/75">
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ቀጥታ ስርጭት (Live Sessions)፦ ' : 'Live Sessions: '}</strong>
                                                <span>{isAm ? 'በ Google Meet አማካኝነት ከመምህሩ ጋር በቅርበት የሚደረግ የልምምድ ክፍለ ጊዜ።' : 'Interactive one-on-one and small group practice via Google Meet with immediate instructor feedback.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ተከታታይ የድጋፍ ትምህርቶች፦ ' : 'Ongoing Learning Resources: '}</strong>
                                                <span>{isAm ? 'በ Telegram አማካኝነት የሚላኩ የበገና ድርደራ ቪዲዮዎች፣ የድምፅ መለማመጃዎች እና የንባብ ማስታወሻዎች።' : 'Curated Begena strumming video lessons, audio exercises, and study notes delivered through Telegram.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ቋንቋ፦ ' : 'Language: '}</strong>
                                                <span>{isAm ? 'ትምህርቱ በአማርኛ የሚሰጥ ሆኖ፣ መዝሙራቱ ኦሪጅናል ለዛቸውን በጠበቀ መልኩ በአማርኛ ይቀርባሉ።' : 'Instruction is delivered in Amharic, with hymns preserving their sacred traditional character.'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Section 3 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 text-white font-heading font-bold text-base border-b border-white/5 pb-2">
                                        <span className="w-6 h-6 rounded-md bg-brand-red/20 text-brand-red text-xs font-black flex items-center justify-center">3</span>
                                        <span>{isAm ? 'የሚሰጡ የትምህርት ዘርፎች' : 'Curriculum & Tracks'}</span>
                                    </div>
                                    <ul className="space-y-2.5 pl-2 text-sm text-white/75">
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'የመጀመሪያ ደረጃ፦ ' : 'Foundational Level: '}</strong>
                                                <span>{isAm ? 'የበገና ታሪክ፣ አውታሮችን ማስተካከል (Tuning)፣ የበገና አያያዝ እና መሠረታዊ የጣት እንቅስቃሴዎች።' : 'Begena sacred history, tuning (Tuning), proper handling, and fundamental finger strumming posture.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'መካከለኛ ደረጃ፦ ' : 'Intermediate Level: '}</strong>
                                                <span>{isAm ? 'በተለያዩ የዜማ ቅኝቶች የታጀቡ የድርደራ ስልቶች እና የታወቁ የበገና መዝሙራት ልምምድ።' : 'Strumming styles across diverse traditional tunings (Salamta, Wanyun, Silecherinetih) and recognized hymns.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ከፍተኛ ደረጃ፦ ' : 'Advanced Level: '}</strong>
                                                <span>{isAm ? 'ጥልቅ የበገና ድርደራ ምስጢራት፣ ቅኔያዊ አቀራረቦች እና የበገናን ድምፅ ከዜማ ጋር የማዋሃድ ጥበብ።' : 'Mastery of double strumming, sub-tunings, poetic nuances, and seamless vocal-instrumental harmony.'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Section 4 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 text-white font-heading font-bold text-base border-b border-white/5 pb-2">
                                        <span className="w-6 h-6 rounded-md bg-brand-red/20 text-brand-red text-xs font-black flex items-center justify-center">4</span>
                                        <span>{isAm ? 'የተማሪ መብትና ግዴታ' : 'Student Rights & Responsibilities'}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                            <h5 className="font-bold text-xs uppercase tracking-wider text-green-400">
                                                {isAm ? 'መብት' : 'Student Rights'}
                                            </h5>
                                            <ul className="space-y-1.5 text-xs text-white/70">
                                                <li>• {isAm ? 'ከመምህሩ ጋር የግል ግንኙነት በማድረግ የልምምድ ክፍተቶችን የመሙላት መብት።' : 'Right to direct one-on-one consultation with the instructor to resolve practice challenges.'}</li>
                                                <li>• {isAm ? 'ጥራታቸውን የጠበቁ እና ለቤት ልምምድ የሚረዱ የቪዲዮ ግብዓቶችን የማግኘት መብት።' : 'Full access to high-quality video recordings and study guides for home practice.'}</li>
                                            </ul>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                            <h5 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                                                {isAm ? 'ግዴታ' : 'Responsibilities'}
                                            </h5>
                                            <ul className="space-y-1.5 text-xs text-white/70">
                                                <li>• {isAm ? 'በተከታታይ ክፍለ ጊዜያት ላይ መገኘት እና የሚሰጡ የተግባር ልምምዶችን በወቅቱ ማጠናቀቅ።' : 'Consistent attendance at scheduled sessions and timely completion of assigned exercises.'}</li>
                                                <li>• {isAm ? 'የትምህርት ቤቱን ክብርና መንፈሳዊ ስርዓት ጠብቆ መማር።' : 'Respecting the sacred decorum and spiritual sanctity of the school.'}</li>
                                                <li>• {isAm ? 'ወርሃዊ ክፍያን በትምህርት ቤቱ መመሪያ መሠረት በወቅቱ ማጠናቀቅ።' : 'Settling monthly tuition fees promptly according to policy.'}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 5 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 text-white font-heading font-bold text-base border-b border-white/5 pb-2">
                                        <span className="w-6 h-6 rounded-md bg-brand-red/20 text-brand-red text-xs font-black flex items-center justify-center">5</span>
                                        <span>{isAm ? 'ምዝገባ እና ክፍያ' : 'Registration & Payment'}</span>
                                    </div>
                                    <ul className="space-y-2 pl-2 text-sm text-white/75">
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <span>{isAm ? 'ይህ የአዲሱ ዙር ምዝገባ ለ30 ቀናት ብቻ ክፍት ሆኖ ይቆያል።' : 'This enrollment cohort remains open for 30 days only.'}</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-brand-red font-bold shrink-0 mt-0.5">•</span>
                                            <span>{isAm ? 'የክፍያ ሁኔታዎች እንደ ትምህርት ዓይነትና እንደ ክፍለ ጊዜያቱ ብዛት የሚወሰኑ ይሆናል።' : 'Tuition fees vary depending on the chosen plan format (Individual or Group) and weekly session frequency.'}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Contact Card & Motto */}
                                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
                                    <h5 className="font-heading font-bold text-sm text-white">
                                        {isAm ? 'ለበለጠ መረጃ እና ለምዝገባ፦' : 'For Inquiries & Admissions:'}
                                    </h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        <a href="tel:+251920312156" className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors">
                                            <Phone className="w-4 h-4 text-brand-red" />
                                            <span>+251 920 312 156</span>
                                        </a>
                                        <a href="https://t.me/Enzira_Begena" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors">
                                            <Send className="w-4 h-4 text-brand-red" />
                                            <span>Telegram: @Enzira_Begena</span>
                                        </a>
                                        <a href="https://instagram.com/Enzira_begena" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors">
                                            <Instagram className="w-4 h-4 text-brand-red" />
                                            <span>Instagram: @Enzira_begena</span>
                                        </a>
                                        <a href="mailto:contact@enzirabegena.com" className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors">
                                            <Mail className="w-4 h-4 text-brand-red" />
                                            <span>contact@enzirabegena.com</span>
                                        </a>
                                    </div>
                                    <div className="text-center pt-2 border-t border-white/5">
                                        <p className="font-heading text-brand-red font-bold text-base tracking-wide italic">
                                            {isAm ? '"የበገናን ሰላም፣ በቤቶ ይማሩ!"' : '"Experience the peace of the Begena in your home!"'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-5 sm:p-6 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-xs text-white/40">
                                    {isAm ? 'ውሉን በመቀበል ወደ ምዝገባ ይቀጥሉ' : 'Accept terms to proceed with registration'}
                                </span>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-xs font-semibold transition-all cursor-pointer"
                                    >
                                        {isAm ? 'ዝጋ' : 'Close'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAgree}
                                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-light text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-red/25 transition-all cursor-pointer"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>{isAm ? 'እስማማለሁ እና እቀበላለሁ' : 'I Agree & Accept'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TermsModal;

