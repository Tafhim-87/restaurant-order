"use client";

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { 
  CreditCard, 
  Utensils, 
  Receipt, 
  Printer, 
  ArrowRight,
  Star,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const navbarRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Animation for hero section
    gsap.fromTo(titleRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    
    gsap.fromTo(subtitleRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
    );
    
    gsap.fromTo(ctaRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" }
    );
    
    gsap.fromTo(".scroll-indicator", 
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.5, ease: "power2.out" }
    );

    // Animation for features
      gsap.utils.toArray(".feature-item").forEach((feature) => {
      gsap.fromTo(feature as Element, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: feature as Element,
            start: "top 85%",
            end: "bottom 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animation for screens
    gsap.utils.toArray(".screen-item").forEach((screen, i) => {
      gsap.fromTo(screen as Element, 
        { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: screen as Element,
            start: "top 85%",
            end: "bottom 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animation for navbar on scroll
    gsap.to(navbarRef.current, {
      height: 60,
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      backdropFilter: "blur(10px)",
      scrollTrigger: {
        trigger: document.body,
        start: "100px top",
        end: "max",
        toggleActions: "play reverse play reverse"
      }
    });

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-950 text-white">
      <Head>
        <title>NexusPOS | Modern Restaurant Management System</title>
        <meta name="description" content="Advanced POS system for restaurant management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav 
        ref={navbarRef} 
        className="fixed w-full z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            NexusPOS
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#screens" className="text-gray-300 hover:text-white transition-colors">Screens</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
          </div>
          
          <Link href="/signin" className="hidden md:flex items-center bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
            Get Started <ArrowRight size={16} className="ml-2" />
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#screens" className="text-gray-300 hover:text-white transition-colors">Screens</Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link>
              <Link href="/signin" className="flex items-center coursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all">
                Get Started <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-center items-center relative pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center z-10">
          <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-6">
            Modern <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Restaurants</span> for Modern <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>People</span>
          </h1>
          <p ref={subtitleRef} className="text-xl text-gray-300 max-w-6xl mx-auto mb-10">
            Streamline your restaurant operations with our all-in-one point of sale system. 
            Manage orders, payments, and bills effortlessly with beautiful dark interface.
          </p>
          <div ref={ctaRef} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signin" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg transform hover:-translate-y-1">
              View Demo
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 scroll-indicator animate-bounce">
          <ChevronDown size={32} className="text-gray-400" />
        </div>
      </section>

      {/* Animated Feature Showcase */}
      <section id="features" className="py-20 relative">
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-slate-950 to-transparent z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Everything you need to run your restaurant efficiently in one beautiful system
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Menu Management", 
                description: "Easily manage your restaurant menu with categories, prices, and descriptions",
                icon: <Utensils size={32} className="text-blue-400" />
              },
              { 
                title: "Order Tracking", 
                description: "Track orders in real-time from kitchen to table with live updates",
                icon: <Receipt size={32} className="text-purple-400" />
              },
              { 
                title: "Payment Processing", 
                description: "Accept multiple payment methods with secure transaction processing",
                icon: <CreditCard size={32} className="text-green-400" />
              },
              { 
                title: "Bill Printing", 
                description: "Generate and print detailed bills with tax calculations automatically",
                icon: <Printer size={32} className="text-yellow-400" />
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="feature-item p-6 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-400 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screens Preview */}
      <section id="screens" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Beautiful Dark Interface</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Designed for clarity and ease of use during long shifts
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="screen-item p-8 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Menu Management</h3>
              <p className="text-gray-400 mb-6">
                Our intuitive menu management allows you to easily add, edit, and organize your restaurant offerings.
              </p>
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 shadow-inner">
                <div className="flex items-center mb-4 p-2 border-b border-slate-700">
                  <div className="h-2 w-2 rounded-full bg-red-400 mr-2"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                  <div className="flex-1 text-center text-sm text-slate-400 font-mono">Menu Management</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-800 rounded border border-slate-700">
                    <span className="font-medium text-slate-200">Kacchi</span>
                    <span className="text-blue-400">$230.00</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800 rounded border border-slate-700">
                    <span className="font-medium text-slate-200">Naili Nihari</span>
                    <span className="text-blue-400">$180.00</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800 rounded border border-slate-700">
                    <span className="font-medium text-slate-200">Salad</span>
                    <span className="text-blue-400">$60.00</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm mt-4 hover:bg-blue-700 transition-colors">
                    Add to Order
                  </button>
                </div>
              </div>
            </div>
            
            <div className="screen-item p-8 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Order & Payment</h3>
              <p className="text-gray-400 mb-6">
                Streamline the ordering process and accept multiple payment methods with our integrated system.
              </p>
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 shadow-inner">
                <div className="flex items-center mb-4 p-2 border-b border-slate-700">
                  <div className="h-2 w-2 rounded-full bg-red-400 mr-2"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                  <div className="flex-1 text-center text-sm text-slate-400 font-mono">Order Summary</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Hamburger x2</span>
                    <span>$22.00</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>$22.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Tax (8%):</span>
                    <span>$1.76</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 flex justify-between font-semibold text-slate-100">
                    <span>TOTAL:</span>
                    <span className="text-green-400">$23.76</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button className="bg-slate-700 text-slate-200 py-2 rounded text-sm hover:bg-slate-600 transition-colors">
                      Clear Order
                    </button>
                    <button className="bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700 transition-colors">
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4">Loved by Restaurants</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            See what our customers have to say about NexusPOS
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  &quot;NexusPOS has transformed how we manage our restaurant. The dark interface is easy on the eyes during long shifts, and the features are incredibly intuitive.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-700 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-400">Owner, Bella Cucina</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Restaurant?</h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8">
            Join hundreds of restaurants that have streamlined their operations with our POS system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg transform hover:-translate-y-1">
              Get Started Now
            </button>
            <button className="border border-slate-700 text-slate-200 px-8 py-4 rounded-lg text-lg font-medium hover:bg-slate-800/50 transition-all">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                NexusPOS
              </div>
              <p className="text-gray-500 mt-2">© 2023 All rights reserved</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        body { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}