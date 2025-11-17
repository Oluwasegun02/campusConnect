import React from 'react';
import { AcademicCapIcon, ClipboardListIcon, ShoppingCartIcon, ChatBubbleLeftRightIcon, BuildingOfficeIcon, CreditCardIcon, BookOpenIcon, CheckCircleIcon } from '../constants';

interface LandingPageProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
}

const FeatureCard: React.FC<{ icon: React.FC<{ className?: string }>, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignupClick }) => {

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <AcademicCapIcon className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-slate-800">CampusConnect</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <button onClick={() => scrollTo('features')} className="text-slate-600 hover:text-primary-600 font-medium">Features</button>
                        <button onClick={() => scrollTo('for-students')} className="text-slate-600 hover:text-primary-600 font-medium">For Students</button>
                        <button onClick={() => scrollTo('for-teachers')} className="text-slate-600 hover:text-primary-600 font-medium">For Teachers</button>
                    </nav>
                    <div className="flex items-center gap-2">
                        <button onClick={onLoginClick} className="px-4 py-2 text-sm font-semibold text-primary-600 bg-white border border-primary-500 rounded-full hover:bg-primary-50">Log In</button>
                        <button onClick={onSignupClick} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-full hover:bg-primary-700">Sign Up</button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                            Your Entire Campus, <span className="text-primary-600">Connected</span>.
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                            Streamline your academic life with an all-in-one platform for assignments, communication, and campus services.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <button onClick={onSignupClick} className="px-8 py-3 font-semibold text-white bg-primary-600 rounded-full hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition">
                                Get Started for Free
                            </button>
                            <button onClick={() => scrollTo('features')} className="px-8 py-3 font-semibold text-slate-700 bg-slate-200 rounded-full hover:bg-slate-300 transition">
                                Explore Features
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Everything You Need in One Place</h2>
                            <p className="mt-2 text-slate-600">From academics to social life, we've got you covered.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard icon={ClipboardListIcon} title="Seamless Academics" description="Manage assignments, take exams, and track your grades with an intuitive and powerful academic toolkit." />
                            <FeatureCard icon={ChatBubbleLeftRightIcon} title="Integrated Communication" description="Stay connected with classmates and teachers through real-time chat, group discussions, and event channels." />
                            <FeatureCard icon={ShoppingCartIcon} title="Campus Marketplace" description="Buy and sell textbooks, electronics, and more with a secure marketplace built for students." />
                            <FeatureCard icon={BuildingOfficeIcon} title="Accommodation Portal" description="Find and book on-campus or private housing, manage applications, and settle in with ease." />
                            <FeatureCard icon={CreditCardIcon} title="Effortless Payments" description="Handle tuition fees, deposits, and marketplace purchases with your integrated student wallet." />
                            <FeatureCard icon={BookOpenIcon} title="Digital Library" description="Access a vast collection of e-books and course materials right from your dashboard, anytime, anywhere." />
                        </div>
                    </div>
                </section>
                
                {/* For Students Section */}
                <section id="for-students" className="py-20 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470" alt="Students studying" className="rounded-lg shadow-2xl" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">Empowering Your Student Journey</h2>
                                <p className="mt-4 text-slate-600">Focus on what matters most—your education and your experience. CampusConnect handles the rest.</p>
                                <ul className="mt-6 space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Never miss a deadline</h4>
                                            <p className="text-slate-600">Keep track of all your assignments and exams with automatic reminders and a centralized dashboard.</p>
                                        </div>
                                    </li>
                                     <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Collaborate effortlessly</h4>
                                            <p className="text-slate-600">Work on group projects and discuss lectures in dedicated course channels with file and media sharing.</p>
                                        </div>
                                    </li>
                                     <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Live smarter, not harder</h4>
                                            <p className="text-slate-600">Find affordable textbooks, book campus services, and manage your finances all in one app.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* For Teachers Section */}
                <section id="for-teachers" className="py-20 bg-slate-50 overflow-hidden">
                     <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="lg:order-2">
                                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1470" alt="Teacher in a classroom" className="rounded-lg shadow-2xl" />
                            </div>
                            <div className="lg:order-1">
                                <h2 className="text-3xl font-bold text-slate-800">Tools to Inspire and Educate</h2>
                                <p className="mt-4 text-slate-600">Spend less time on administration and more time engaging with your students.</p>
                                <ul className="mt-6 space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Streamline course management</h4>
                                            <p className="text-slate-600">Create assignments, upload materials, and manage exam schedules with just a few clicks.</p>
                                        </div>
                                    </li>
                                     <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Enhance class communication</h4>
                                            <p className="text-slate-600">Send announcements, answer questions in dedicated chats, and foster a collaborative online environment.</p>
                                        </div>
                                    </li>
                                     <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Simplify grading & feedback</h4>
                                            <p className="text-slate-600">Grade submissions digitally, provide feedback, and track student performance with insightful overviews.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="bg-primary-600 text-white py-20">
                     <div className="container mx-auto px-6 text-center">
                         <h2 className="text-3xl lg:text-4xl font-bold">Ready to Join the Future of Campus Life?</h2>
                         <p className="mt-2 max-w-xl mx-auto text-primary-200">Sign up in minutes and transform your university experience today.</p>
                         <div className="mt-8">
                             <button onClick={onSignupClick} className="px-10 py-4 font-semibold text-primary-600 bg-white rounded-full hover:bg-slate-100 shadow-2xl hover:shadow-xl transform hover:-translate-y-0.5 transition">
                                Sign Up Now
                            </button>
                         </div>
                     </div>
                </section>
            </main>
            
            <footer className="bg-slate-800 text-slate-400 py-6">
                 <div className="container mx-auto px-6 text-center text-sm">
                    &copy; {new Date().getFullYear()} CampusConnect. All rights reserved.
                 </div>
            </footer>
        </div>
    );
};