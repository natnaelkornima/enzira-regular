import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Check, X, Phone, Send, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const TermsModal = ({ isOpen: controlledIsOpen, onClose: controlledOnClose }) => {
    const { language } = useLanguage();
    const isAm = language === 'am';

    const [hasAgreed, setHasAgreed] = useState(true);
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

    const handleDismissBanner = () => {
        // Allow user to temporarily dismiss the small box without permanently accepting
        setHasAgreed(true);
    };

    const handleCloseModal = () => {
        setIsFullOpen(false);
        controlledOnClose?.();
    };

    return (
        <>
            {/* Small UI Box (Initial Consent Prompt) */}
            <AnimatePresence>
                {!hasAgreed && !isModalActive && (
                    <motion.aside
                        aria-label="Terms and Agreement Notice"
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 p-5 rounded-2xl bg-dark-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80"
                    >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red shrink-0">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-white tracking-wide">
                                    {isAm ? 'የአገልግሎት ውሎች እና መመሪያዎች' : 'Terms of Service'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleDismissBanner}
                                className="text-white/40 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                                aria-label="Dismiss notice"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-white/60 leading-relaxed mb-4 pl-0.5">
                            {isAm
                                ? 'እንኳን ወደ እንዚራ በገና በደኅና መጡ! ስልጠና ከመጀመርዎ በፊት እባክዎ የትምህርት ቤቱን ደንቦችና መመሪያዎች ይመልከቱ።'
                                : 'Welcome to Enzira Begena! Please review our training guidelines and code of conduct before getting started.'}
                        </p>

                        <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsFullOpen(true)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:text-brand-red-light transition-colors cursor-pointer"
                            >
                                <span>{isAm ? 'ሙሉውን አንብብ' : 'Read details'}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                                type="button"
                                onClick={handleAgree}
                                className="py-2 px-4 rounded-xl bg-brand-red hover:bg-brand-red-light text-white text-xs font-bold transition-all shadow-md shadow-brand-red/20 cursor-pointer flex items-center gap-1.5"
                            >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isAm ? 'እስማማለሁ' : 'I Agree'}</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Full Terms & Conditions Modal */}
            <AnimatePresence>
                {isModalActive && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 16 }}
                            transition={{ duration: 0.25 }}
                            className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-dark-900 border border-white/10 shadow-2xl overflow-hidden my-auto"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red block mb-1">
                                        {isAm ? 'የእንዚራ በገና ትምህርት ቤት ደንብ' : 'Enzira Begena School Guidelines'}
                                    </span>
                                    <h2 className="text-lg sm:text-xl font-bold text-white">
                                        {isAm ? 'እንኳን ወደ እንዚራ በገና በደኅና መጡ!' : 'Welcome to Enzira Begena!'}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                    aria-label="Close dialog"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-8 custom-scrollbar text-white/80 text-sm sm:text-base leading-loose">
                                {/* Intro Block */}
                                <div className="border-l-2 border-brand-red bg-white/[0.02] pl-4 pr-3 py-3 rounded-r-lg">
                                    <p className="text-white/85 leading-relaxed text-sm">
                                        {isAm
                                            ? 'እንዚራ በገና፤ መንፈሳዊውን የበገና ጥበብ እና ድርደራ በዓለም ዙሪያ ለሚገኙ ኢትዮጵያውያን ተደራሽ ለማድረግ የተመሠረተ የጥበብ ማዕከል ነው። ትምህርት ቤታችን ካካበተው ሰፊ የማስተማር ልምድ እና በዘርፉ ካለው ጥልቅ እውቀት በመነሳት፣ የበገናን ጥበብ ከመሠረቱ ጀምሮ እስከ ጥልቁ የዜማ ስልት ድረስ በዘመናዊ የዲጂታል ዘዴዎች ያስተምራል።'
                                            : 'Enzira Begena is a cultural academy dedicated to making the spiritual art of the Begena accessible to Ethiopians worldwide. With extensive instructional experience and deep mastery, we teach the Begena from foundational finger techniques up to advanced hymn accompaniment using modern digital methods.'}
                                    </p>
                                </div>

                                {/* Section 1 */}
                                <section className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
                                        <span className="text-xs font-mono font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">01</span>
                                        <h3>{isAm ? 'የትምህርት ቤቱ ራዕይና ዓላማ' : 'Vision & Objectives'}</h3>
                                    </div>
                                    <ul className="space-y-3 pl-1 text-sm text-white/75 leading-relaxed">
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-brand-red mt-1 font-bold">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'የጥበብ ትውፊት፦ ' : 'Tradition Preservation: '}</strong>
                                                <span>{isAm ? 'ጥንታዊውን የበገና ድርደራ ሳይበረዝ እና ሳይከለስ ለትውልድ ማስተላለፍ።' : 'Preserving and passing on the authentic ancient Begena tradition to the next generation.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-brand-red mt-1 font-bold">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ተደራሽነት፦ ' : 'Accessibility: '}</strong>
                                                <span>{isAm ? 'የቦታ እና የሰዓት ገደብ ሳይበግረው፣ ምእመናን ባሉበት ሆነው የበገናን ምስጢር እንዲረዱ ማስቻል።' : 'Overcoming location and schedule barriers so devotees can learn from anywhere in the world.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-brand-red mt-1 font-bold">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'መንፈሳዊ ዕርካታ፦ ' : 'Spiritual Depth: '}</strong>
                                                <span>{isAm ? 'በገና የጸሎት መሣሪያ እንደመሆኑ፣ ተማሪዎች የቴክኒክ ብቃቱን ብቻ ሳይሆን መንፈሳዊውንም ለዛ እንዲቀስሙ ማድረግ።' : 'As the Begena is an instrument of prayer, enabling students to gain spiritual depth alongside technical skill.'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </section>

                                {/* Section 2 */}
                                <section className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
                                        <span className="text-xs font-mono font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">02</span>
                                        <h3>{isAm ? 'የትምህርት አሰጣጥ ስልት' : 'Teaching Methodology'}</h3>
                                    </div>
                                    <p className="text-xs text-white/50">
                                        {isAm ? 'ትምህርቱ በቴክኖሎጂ የታገዘ እና የተማሪን የመረዳት አቅም መሠረት ያደረገ ነው፦' : 'Instruction is technology-supported and customized to each student:'}
                                    </p>
                                    <ul className="space-y-3 pl-1 text-sm text-white/75 leading-relaxed">
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-brand-red mt-1 font-bold">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ቀጥታ ስርጭት (Live Sessions)፦ ' : 'Live Sessions: '}</strong>
                                                <span>{isAm ? 'በ Google Meet አማካኝነት ከመምህሩ ጋር በቅርበት የሚደረግ የልምምድ ክፍለ ጊዜ።' : 'Close-up practice sessions with the instructor via Google Meet.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-brand-red mt-1 font-bold">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ተከታታይ የድጋፍ ትምህርቶች፦ ' : 'Support Materials: '}</strong>
                                                <span>{isAm ? 'በ Telegram አማካኝነት የሚላኩ የበገና ድርደራ ቪዲዮዎች፣ የድምፅ መለማመጃዎች እና የንባብ ማስታወሻዎች።' : 'Regular video demonstrations, audio exercises, and reading notes sent via Telegram.'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-brand-red mt-1 font-bold">•</span>
                                            <div>
                                                <strong className="text-white font-semibold">{isAm ? 'ቋንቋ፦ ' : 'Language: '}</strong>
                                                <span>{isAm ? 'ትምህርቱ በአማርኛ የሚሰጥ ሆኖ፣ መዝሙራቱ ኦሪጅናል ለዛቸውን በጠበቀ መልኩ በአማርኛ ይቀርባሉ።' : 'Instruction is conducted in Amharic, maintaining the authentic spiritual essence of hymns.'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </section>

                                {/* Section 3 */}
                                <section className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
                                        <span className="text-xs font-mono font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">03</span>
                                        <h3>{isAm ? 'የሚሰጡ የትምህርት ዘርፎች' : 'Curriculum Levels'}</h3>
                                    </div>
                                    <p className="text-xs text-white/50">
                                        {isAm ? 'ትምህርቱ በሥርዓተ ትምህርት የተቀረጸ ሆኖ የሚከተሉትን ዋና ዋና ነጥቦች ያካትታል፦' : 'Structured in three clear developmental tiers:'}
                                    </p>
                                    <div className="space-y-2.5 pt-1">
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                                            <span className="text-xs font-bold text-brand-red uppercase tracking-wide block mb-1">
                                                {isAm ? 'የመጀመሪያ ደረጃ (Foundational)' : 'Level 1: Foundational'}
                                            </span>
                                            <p className="text-xs text-white/70 leading-relaxed">
                                                {isAm ? 'የበገና ታሪክ፣ አውታሮችን ማስተካከል (Tuning)፣ የበገና አያያዝ እና መሠረታዊ የጣት እንቅስቃሴዎች።' : 'Begena history, string tuning, instrument handling, and fundamental finger strumming posture.'}
                                            </p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                                            <span className="text-xs font-bold text-brand-red uppercase tracking-wide block mb-1">
                                                {isAm ? 'መካከለኛ ደረጃ (Intermediate)' : 'Level 2: Intermediate'}
                                            </span>
                                            <p className="text-xs text-white/70 leading-relaxed">
                                                {isAm ? 'በተለያዩ የዜማ ቅኝቶች የታጀቡ የድርደራ ስልቶች እና የታወቁ የበገና መዝሙራት ልምምድ።' : 'Strumming techniques across major tunings (Salamta, Wanyun, Silecherinetih) and popular hymn practice.'}
                                            </p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                                            <span className="text-xs font-bold text-brand-red uppercase tracking-wide block mb-1">
                                                {isAm ? 'ከፍተኛ ደረጃ (Advanced)' : 'Level 3: Advanced'}
                                            </span>
                                            <p className="text-xs text-white/70 leading-relaxed">
                                                {isAm ? 'ጥልቅ የበገና ድርደራ ምስጢራት፣ ቅኔያዊ አቀራረቦች እና የበገናን ድምፅ ከዜማ ጋር የማዋሃድ ጥበብ።' : 'Advanced strumming, sub-tunings, poetic nuances, and harmonizing instrument with vocal melodies.'}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 4 */}
                                <section className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
                                        <span className="text-xs font-mono font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">04</span>
                                        <h3>{isAm ? 'የተማሪ መብትና ግዴታ' : 'Rights & Responsibilities'}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                                                {isAm ? 'መብት (Rights)' : 'Student Rights'}
                                            </h4>
                                            <ul className="space-y-2 text-xs text-white/70 leading-relaxed">
                                                <li>• {isAm ? 'ከመምህሩ ጋር የግል ግንኙነት በማድረግ የልምምድ ክፍተቶችን የመሙላት መብት።' : 'Right to one-on-one consultation to address individual practice needs.'}</li>
                                                <li>• {isAm ? 'ጥራታቸውን የጠበቁ እና ለቤት ልምምድ የሚረዱ የቪዲዮ ግብዓቶችን የማግኘት መብት።' : 'Right to access high-quality video resources for home practice.'}</li>
                                            </ul>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                                                {isAm ? 'ግዴታ (Responsibilities)' : 'Responsibilities'}
                                            </h4>
                                            <ul className="space-y-2 text-xs text-white/70 leading-relaxed">
                                                <li>• {isAm ? 'በተከታታይ ክፍለ ጊዜያት ላይ መገኘት እና የሚሰጡ የተግባር ልምምዶችን በወቅቱ ማጠናቀቅ።' : 'Attending scheduled sessions regularly and completing assignments promptly.'}</li>
                                                <li>• {isAm ? 'የትምህርት ቤቱን ክብርና መንፈሳዊ ስርዓት ጠብቆ መማር።' : 'Respecting the spiritual decorum and values of the school.'}</li>
                                                <li>• {isAm ? 'ወርሃዊ ክፍያን በትምህርት ቤቱ መመሪያ መሠረት በወቅቱ ማጠናቀቅ።' : 'Settling monthly tuition fees on time according to guidelines.'}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 5 */}
                                <section className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
                                        <span className="text-xs font-mono font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">05</span>
                                        <h3>{isAm ? 'ምዝገባ እና ክፍያ' : 'Enrollment & Tuition'}</h3>
                                    </div>
                                    <ul className="space-y-2 pl-1 text-sm text-white/75 leading-relaxed">
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-brand-red mt-1 font-bold">•</span>
                                            <span>{isAm ? 'ይህ የአዲሱ ዙር ምዝገባ ለ30 ቀናት ብቻ ክፍት ሆኖ ይቆያል።' : 'This enrollment cohort remains open for 30 days only.'}</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-brand-red mt-1 font-bold">•</span>
                                            <span>{isAm ? 'የክፍያ ሁኔታዎች እንደ ትምህርት ዓይነትና እንደ ክፍለ ጊዜያቱ ብዛት የሚወሰኑ ይሆናል።' : 'Tuition fees vary depending on chosen course plan and weekly session count.'}</span>
                                        </li>
                                    </ul>
                                </section>

                                {/* Contact & Motto */}
                                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-white/90">
                                        {isAm ? 'ለበለጠ መረጃ እና ለምዝገባ፦' : 'Inquiries & Contact:'}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-white/70">
                                        <a href="tel:+251920312156" className="flex items-center gap-2 hover:text-white transition-colors">
                                            <Phone className="w-3.5 h-3.5 text-brand-red" />
                                            <span>+251 920 312 156</span>
                                        </a>
                                        <a href="https://t.me/Enzira_Begena" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                            <Send className="w-3.5 h-3.5 text-brand-red" />
                                            <span>Telegram: @Enzira_Begena</span>
                                        </a>
                                        <a href="https://instagram.com/Enzira_begena" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                            <Instagram className="w-3.5 h-3.5 text-brand-red" />
                                            <span>Instagram: @Enzira_begena</span>
                                        </a>
                                        <a href="mailto:contact@enzirabegena.com" className="flex items-center gap-2 hover:text-white transition-colors">
                                            <Mail className="w-3.5 h-3.5 text-brand-red" />
                                            <span>contact@enzirabegena.com</span>
                                        </a>
                                    </div>
                                    <div className="pt-2 border-t border-white/5 text-center">
                                        <p className="text-sm font-semibold text-brand-red italic">
                                            {isAm ? '"የበገናን ሰላም፣ በቤቶ ይማሩ!"' : '"Experience the peace of the Begena in your home!"'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                >
                                    {isAm ? 'ዝጋ' : 'Close'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAgree}
                                    className="px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-light text-white text-xs font-bold transition-all shadow-md shadow-brand-red/25 cursor-pointer flex items-center gap-1.5"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{isAm ? 'ተስማምቻለሁ' : 'I Agree & Accept'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TermsModal;
