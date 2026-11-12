export const translations = {
    en: {
        // Navbar
        nav: {
            home: 'Home',
            about: 'Our Service',
            pricing: 'Pricing',
            training: 'Training',
            contact: 'Contact',
            checkStatus: 'Check Status',
            adminLogin: 'Admin Login',
            enrollNow: 'Enroll Now',
            language: 'አማርኛ',
            languageBadge: 'EN',
        },
        // Hero
        hero: {
            badge: 'Enzira',
            headingLine1: 'Regular',
            headingLine2: 'Begena Training',
            description:
                'Have you ever wondered when you will finally be able to play the Begena fluently? In this regular Enzira training, we are designed to help you play the Begena with complete dexterity and ease.',
            startLearning: 'Start Learning',
            ourService: 'Our Service',
            watchJourney: 'Our Service',
            stat1Value: '85%',
            stat1Label: 'Teaching Success',
            stat2Value: '12+',
            stat2Label: 'Course Modules',
            stat3Value: '50+',
            stat3Label: 'Training Hours',
        },
        // About / Our Service
        about: {
            subtitle: 'Our Services',
            titleLine1: 'Begena',
            titleLine2: 'I too shall praise like David!',
            description:
                "The main goal of Enzira Online Begena School is to enable devotees at home and abroad to learn the ancient Begena instrument and pass it on to the next generation, expanding the reach of the service by producing qualified successor teachers.",
            feature1Title: 'Master the Three Tunings',
            feature1Desc:
                'You will learn to play the Begena perfectly in the three main tunings: Salamta, Wanyun, and Silecherinetih.',
            feature2Title: 'Double Strumming Mastery',
            feature2Desc:
                "We train your fingers to master double strumming techniques in harmony with sacred hymns.",
            feature3Title: 'Identify Sub-Tunings',
            feature3Desc:
                'Beyond the main tunings, you will learn to identify and master various sub-tunings for deeper expression.',
            feature4Title: 'Extensive Hymn Practice',
            feature4Desc:
                'We provide extensive practice with a wide range of hymns, ensuring you have the skill to play with complete mastery.',
        },
        // Pricing
        pricing: {
            badge: 'Training Plans',
            titleLine1: 'Choose Your',
            titleLine2: 'Begena Plan',
            description:
                'First select between our 1-on-1 Individual Plan or Group Plan (5 people), then choose the duration and schedule that fits you best.',
            step1Label: 'Step 1 · Select Plan Type',
            step2Label: 'Step 2 · Available Packages',
            perMonth: '/ month',
            currency: 'Birr',
            onlineLabel: '100% Online Live Classes',
            enrollAction: 'Enroll with This Plan',
            selectedBadge: 'Selected',
            plans: {
                individual: {
                    name: 'Individual Plan',
                    badge: '1-on-1',
                    description: 'Dedicated one-on-one coaching tailored to your pace and schedule.',
                    formatLabel: '1-on-1 Private Coaching',
                    tiers: [
                        {
                            id: 'individual-3m',
                            duration: '3 Months',
                            tag: 'Intensive',
                            daysPerWeek: '5 Days / Week',
                            hoursPerDay: '1 hr 30 min / Day',
                            price: '10,000',
                        },
                        {
                            id: 'individual-6m',
                            duration: '6 Months',
                            tag: 'Balanced',
                            daysPerWeek: '3 Days / Week',
                            hoursPerDay: '1 hr 30 min / Day',
                            price: '7,500',
                        },
                        {
                            id: 'individual-9m',
                            duration: '9 Months',
                            tag: 'Steady Pace',
                            daysPerWeek: '2 Days / Week',
                            hoursPerDay: '1 hr 30 min / Day',
                            price: '5,000',
                        },
                    ],
                },
                group: {
                    name: 'Group Plan',
                    badge: '5 People',
                    description: 'Learn online in an interactive small group of 5 students.',
                    formatLabel: 'Group of 5 Students',
                    tiers: [
                        {
                            id: 'group-unified',
                            duration: '6 Months',
                            tag: 'Unified Program',
                            daysPerWeek: '3 Days / Week',
                            hoursPerDay: '1 hr 30 min / Day',
                            price: '1,833',
                        },
                    ],
                },
            },
        },
        // Registration
        registration: {
            sectionSubtitle: 'Where to Pay',
            sectionTitle: 'Payment Methods',
            sectionDesc: 'Please choose your preferred method to complete your payment, and upload the receipt screenshot.',
            pathTitle1: 'Payment',
            pathTitle2: 'Details & Options',
            pathDesc: 'Please transfer the fee for your selected plan to one of the official accounts below. Make sure to capture a screenshot/receipt of the transaction to upload with your registration form.',
            step1: 'Personal Details',
            step2: 'Payment & Receipt',
            proceedToPayment: 'Proceed to Payment',
            backToDetails: 'Back to Details',
            amountToPay: 'Selected Plan Fee',
            selectedPlanLabel: 'Training Plan',
            choosePlanPrompt: 'Select your plan type & duration:',
            changePlan: 'Change',
            planPaymentNote: 'Transfer this monthly fee to one of the official accounts and upload your receipt screenshot.',
            formTitle: 'Registration Form',
            formDesc: 'Please fill in your details accurately.',
            fullName: 'Full Name',
            fullNamePlaceholder: 'Enter your full name',
            phoneNumber: 'Phone Number',
            phonePlaceholder: 'Phone number',
            telegram: 'Telegram Username',
            telegramPlaceholder: '@username',
            proofOfPayment: 'Proof of Payment (Screenshot)',
            uploadText: 'Click to upload payment screenshot',
            uploadHint: 'PNG, JPG up to 5MB',
            submitButton: 'Submit Registration',
            submitting: 'Submitting...',
            validation: {
                fullName: 'Full name is required',
                phoneNumber: 'Phone number is required',
                validPhone: 'Enter a valid phone number',
                telegram: 'Telegram username is required',
                plan: 'Please select a training plan',
                photo: 'Please upload your photo',
                fileSize: 'File size must be less than 5MB',
            },
            success: {
                registrationSecured: 'Registration Secured',
                welcome: 'Welcome to the Path,',
                journeyBegun: 'Your journey into the sacred art of the Begena has officially begun. Check your Telegram',
                forDetails: 'for details.',
                saveReceipt: 'Save Receipt',
                shareJourney: 'Share Journey',
                linkCopied: 'Link copied to clipboard!',
                shareText: 'I just registered for the sacred art of the Begena training with Enzira! Join me on this spiritual journey.',
            }
        },
        // Check Status
        checkStatus: {
            backToHome: 'Back to Home',
            title: 'Check Registration Status',
            desc: 'Enter your phone number to see your payment approval status.',
            inputLabel: 'Phone Number',
            button: 'Check Status',
            registeredOn: 'Registered on',
            verifiedTitle: 'Payment Verified ✓',
            verifiedDesc: 'Your registration has been approved. Welcome aboard!',
            declinedTitle: 'Payment Declined ✗',
            declinedDesc: 'The payment screenshot was deemed invalid. Please try registering again or contact support.',
            pendingTitle: 'Payment Pending',
            pendingDesc: 'Your payment is being reviewed. Please check back later.',
            notFound: 'No registration found with this phone number. Make sure you entered the correct number.',
            error: 'Something went wrong. Please try again.',
        },
        // Footer
        footer: {
            tagline: 'Preserving the sacred art of Ethiopian music through dedicated training and spiritual devotion.',
            quickLinks: 'Quick Links',
            aboutArt: 'About the Art',
            pricing: 'Pricing Plans',
            trainingModules: 'Training Modules',
            globalAdmissions: 'Global Admissions',
            sacredHistory: 'Sacred History',
            connect: 'Connect',
            emailUs: 'Email Us',
            callCenter: 'Call Center',
            copyright: 'Enzira Fast Track. All rights reserved.',
            handcraftedBy: 'Handcrafted by',
        },
    },
    am: {
        // Navbar
        nav: {
            home: 'ዋና',
            about: 'አገልግሎታችን',
            pricing: 'ክፍያ',
            training: 'ስልጠና',
            contact: 'ያግኙን',
            checkStatus: 'ሁኔታ ይፈልጉ',
            adminLogin: 'የአስተዳዳሪ መግቢያ',
            enrollNow: 'ይመዝገቡ',
            language: 'English',
            languageBadge: 'አማ',
        },
        // Hero
        hero: {
            badge: 'እንዚራ',
            headingLine1: 'መደበኛ',
            headingLine2: 'የበገና ስልጠና',
            description:
                'በመጨረሻ በገናን በቅልጥፍና መቼ መጫወት እንደምትችል አስበህ ታውቃለህ? በዚህ መደበኛ የእንዚራ ስልጠና፣ በገናን በተሟላ ክህሎት እና በከፍተኛ ቅለት እንድትጫወት ለመርዳት ተዘጋጅተናል።',
            startLearning: 'ይጀምሩ',
            ourService: 'አገልግሎታችን',
            watchJourney: 'አገልግሎታችን',
            stat1Value: '85%',
            stat1Label: 'የማስተማር ስኬት ',
            stat2Value: '12+',
            stat2Label: 'የትምህርት ይዘቶች',
            stat3Value: '50+',
            stat3Label: 'የስልጠና ሰዓታት',
        },
        // About / Our Service
        about: {
            subtitle: 'የምንሰጣቸው አገልግሎቶች',
            titleLine1: 'በገና',
            titleLine2: 'እኔም እንደ ዳዊት እደረድራለሁ!',
            description: 'የእንዚራ ኦንላይን የበገና ትምህርት ቤት ዋና ዓላማ ምዕመናን በሀገር ውስጥና በውጭ ሆነው ጥንታዊውን የበገና መሣሪያ እንዲማሩና ለትውልድ እንዲያስተላልፉ ማስቻል ሲሆን፣ ብቁ ተተኪ መምህራንን በማፍራትም የአገልግሎቱን ተደራሽነት ማስፋፋት ነው።',
            feature1Title: 'ሶስቱን ቅኝቶች ማስተማር',
            feature1Desc:
                'ማለትም ሰላምታ ፣ ዋንየን እና ስለቸርነትህ በሚገባ አውቀው በገና መድርደር ይችላሉ።',
            feature2Title: 'የድርብ ድርደራ ስልጠና',
            feature2Desc:
                "ጣቶት ድርብ ድርደራ ከመዝሙራት ጋር እንዲችል እናደርጋለን።",
            feature3Title: 'ነዑስ ቅኝቶችን ማስተማር',
            feature3Desc:
                'ከዋና ቅኝቶች ባሻገር ነዑስ ቅኝቶችን መለየት ይችላሉ።',
            feature4Title: 'በቂ የመዝሙራት ልምምድ',
            feature4Desc:
                'በቂ የመዝሙራት ልምምድ ይኖረናል፤ ይህም በገናን በተሟላ ክህሎት ለደርደር የሚያስችላችሁ ትምህርት አዘጋጅተናል።',
        },
        // Pricing
        pricing: {
            badge: 'የክፍያ እቅዶች',
            titleLine1: 'የስልጠና',
            titleLine2: 'እቅድዎን ይምረጡ',
            description:
                'በመጀመሪያ የግል (1 ለ 1) ወይም የቡድን (5 ሰው) ስልጠና ይምረጡ፤ በመቀጠል ከፕሮግራምዎ ጋር የሚስማማውን የጊዜና የክፍያ አማራጭ ይመልከቱ።',
            step1Label: 'ደረጃ 1 · የስልጠና ዓይነት ይምረጡ',
            step2Label: 'ደረጃ 2 · የጊዜና የክፍያ አማራጮች',
            perMonth: '/ በወር',
            currency: 'ብር',
            onlineLabel: 'ሙሉ በሙሉ በኦንላይን',
            enrollAction: 'በዚህ እቅድ ይመዝገቡ',
            selectedBadge: 'የተመረጠ',
            plans: {
                individual: {
                    name: 'የግል እቅድ',
                    badge: '1 ለ 1',
                    description: 'ከእርስዎ የጊዜ ሰሌዳና ፍጥነት ጋር የተጣጣመ የግል (1 ለ 1) ስልጠና።',
                    formatLabel: 'የግል (1 ለ 1) ስልጠና',
                    tiers: [
                        {
                            id: 'individual-3m',
                            duration: 'የ3 ወር',
                            tag: 'ፈጣን',
                            daysPerWeek: 'በሳምንት 5 ቀን',
                            hoursPerDay: 'በቀን 1:30',
                            price: '10,000',
                        },
                        {
                            id: 'individual-6m',
                            duration: 'የ6 ወር',
                            tag: 'መካከለኛ',
                            daysPerWeek: 'በሳምንት 3 ቀን',
                            hoursPerDay: 'በቀን 1:30',
                            price: '7,500',
                        },
                        {
                            id: 'individual-9m',
                            duration: 'የ9 ወር',
                            tag: 'ረጋ ያለ',
                            daysPerWeek: 'በሳምንት 2 ቀን',
                            hoursPerDay: 'በቀን 1:30',
                            price: '5,000',
                        },
                    ],
                },
                group: {
                    name: 'የቡድን እቅድ',
                    badge: '5 ሰው',
                    description: '5 ተማሪዎችን በሚይዝ አነስተኛ ቡድን ውስጥ በኦንላይን በጋራ ይማሩ።',
                    formatLabel: 'የ5 ሰው ቡድን ስልጠና',
                    tiers: [
                        {
                            id: 'group-unified',
                            duration: 'የ6 ወር',
                            tag: 'የተጠቃለለ',
                            daysPerWeek: 'በሳምንት 3 ቀን',
                            hoursPerDay: 'በቀን 1:30',
                            price: '1,833',
                        },
                    ],
                },
            },
        },
        // Registration
        registration: {
            sectionSubtitle: 'የክፍያ መንገዶች',
            sectionTitle: 'የመክፈያ አማራጮች',
            sectionDesc: 'እባክዎ ተመራጭ የክፍያ መንገድ በመምረጥ ክፍያዎን ይፈጽሙና ደረሰኙን ይስቀሉ።',
            pathTitle1: 'የክፍያ',
            pathTitle2: 'አማራጮችና ዝርዝሮች',
            pathDesc: 'እባክዎ ለመረጡት እቅድ ክፍያውን ከታች ባሉት ይፋዊ ሂሳቦች በአንዱ ይክፈሉ። ክፍያውን ከፈጸሙ በኋላ የክፍያውን ማረጋገጫ (ስክሪንሾት) በመያዝ በቀኝ በኩል ባለው የምዝገባ ፎርም ላይ ያያይዙ።',
            step1: 'የግል መረጃ',
            step2: 'ክፍያ እና ደረሰኝ',
            proceedToPayment: 'ወደ ክፍያ ይቀጥሉ',
            backToDetails: 'ወደ ኋላ ተመለስ',
            amountToPay: 'የተመረጠው እቅድ ክፍያ',
            selectedPlanLabel: 'የስልጠና እቅድ',
            choosePlanPrompt: 'የስልጠና ዓይነትና ጊዜ ይምረጡ፦',
            changePlan: 'ቀይር',
            planPaymentNote: 'ይህንን ወርሃዊ ክፍያ በግራ በኩል ባሉት ይፋዊ ሂሳቦች ከፍለው የክፍያውን ስክሪንሾት ይስቀሉ።',
            formTitle: 'የምዝገባ ቅጽ',
            formDesc: 'መረጃዎን በትክክል ይሙሉ።',
            fullName: 'ሙሉ ስም',
            fullNamePlaceholder: 'ሙሉ ስምዎን ያስገቡ',
            phoneNumber: 'ስልክ ቁጥር',
            phonePlaceholder: 'ስልክ ቁጥር',
            telegram: 'የቴሌግራም ስም',
            telegramPlaceholder: '@ስም',
            proofOfPayment: 'የክፍያ ማስረጃ (ስክሪንሾት)',
            uploadText: 'የክፍያ ስክሪንሾት ይስቀሉ',
            uploadHint: 'PNG, JPG እስከ 5MB',
            submitButton: 'ምዝገባ ያስገቡ',
            submitting: 'እየተላከ...',
            validation: {
                fullName: 'ሙሉ ስም ያስፈልጋል',
                phoneNumber: 'ስልክ ቁጥር ያስፈልጋል',
                validPhone: 'ትክክለኛ ስልክ ቁጥር ያስገቡ',
                telegram: 'የቴሌግራም መለያ ያስፈልጋል',
                plan: 'እባክዎ የስልጠና እቅድ ይምረጡ',
                photo: 'እባክዎ ፎቶዎን ያስገቡ',
                fileSize: 'የፋይሉ መጠን ከ 5MB በታች መሆን አለበት',
            },
            success: {
                registrationSecured: 'ምዝገባ ተረጋግጧል',
                welcome: 'ወደ መንገዱ እንኳን በደህና መጡ፣',
                journeyBegun: 'የበገና ቅዱስ ጥበብ ጉዞዎ በይፋ ተጀምሯል። ለዝርዝሩ ቴሌግራምዎን',
                forDetails: 'ይመልከቱ።',
                saveReceipt: 'ደረሰኝ ያስቀምጡ',
                shareJourney: 'ጉዞውን ያጋሩ',
                linkCopied: 'ሊንኩ ተገልብጧል!',
                shareText: 'በእንዚራ አማካኝነት በበገና ቅዱስ ጥበብ ስልጠና ላይ ተመዝግቤያለሁ! በዚህ መንፈሳዊ ጉዞ ላይ አብረውኝ ይሁኑ።',
            }
        },
        // Check Status
        checkStatus: {
            backToHome: 'ወደ ዋና ገጽ ተመለስ',
            title: 'የምዝገባ ሁኔታን ይፈትሹ',
            desc: 'የክፍያ ማረጋገጫ ሁኔታዎን ለማየት ስልክ ቁጥርዎን ያስገቡ።',
            inputLabel: 'ስልክ ቁጥር',
            button: 'ሁኔታን ይፈትሹ',
            registeredOn: 'ተመዝግበዋል በ',
            verifiedTitle: 'ክፍያ ተረጋግጧል ✓',
            verifiedDesc: 'ምዝገባዎ ጸድቋል። እንኳን ደህና መጡ!',
            declinedTitle: 'ክፍያ ተቀባይነት አላገኘም ✗',
            declinedDesc: 'የክፍያ ስክሪንሾቱ ተቀባይነት አላገኘም። እባክዎ እንደገና ለመመዝገብ ይሞክሩ ወይም ድጋፍን ያግኙ።',
            pendingTitle: 'ክፍያ በመጠባበቅ ላይ',
            pendingDesc: 'የእርስዎ ክፍያ በመገምገም ላይ ነው። እባክዎ ቆይተው እንደገና ያረጋግጡ።',
            notFound: 'በዚህ ስልክ ቁጥር የተገኘ ምዝገባ የለም። ትክክለኛውን ቁጥር ማስገባትዎን ያረጋግጡ።',
            error: 'ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
        },
        // Footer
        footer: {
            tagline: 'የኢትዮጵያን ቅዱስ የሙዚቃ ጥበብ በቁርጠኝነት ስልጠናና መንፈሳዊ ጽናት በመጠበቅ ላይ።',
            quickLinks: 'ፈጣን አገናኞች',
            aboutArt: 'ስለ ጥበቡ',
            pricing: 'የክፍያ እቅዶች',
            trainingModules: 'የስልጠና ሞጁሎች',
            globalAdmissions: 'አለም አቀፍ ምዝገባ',
            sacredHistory: 'ቅዱስ ታሪክ',
            connect: 'ያግኙን',
            emailUs: 'ኢሜይል ይላኩልን',
            callCenter: 'የጥሪ ማእከል',
            copyright: 'እንዚራ ፈጣን መንገድ። ሁሉም መብቶች የተጠበቁ ናቸው።',
            handcraftedBy: 'የተሰራው በ',
        },
    },
};

export const findPricingTier = (lang, tierId) => {
    const pricingPlans = translations[lang]?.pricing?.plans || translations.en.pricing.plans;
    if (!pricingPlans || !tierId) return null;
    for (const planKey of ['individual', 'group']) {
        const plan = pricingPlans[planKey];
        const tier = plan?.tiers?.find((item) => item.id === tierId);
        if (tier) {
            return { planKey, plan, tier };
        }
    }
    // Fallback for legacy group tier IDs
    if (typeof tierId === 'string' && tierId.startsWith('group-')) {
        const groupPlan = pricingPlans.group;
        const fallbackTier = groupPlan?.tiers?.[0];
        if (fallbackTier) {
            return { planKey: 'group', plan: groupPlan, tier: fallbackTier };
        }
    }
    return null;
};
