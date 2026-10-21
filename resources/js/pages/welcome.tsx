import { Link, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, Clock3, HeartHandshake, HeartPulse, MapPin, MessageCircle, ShieldCheck, Sparkles, Stethoscope, UsersRound } from 'lucide-react';
import type { SharedData } from '@/types';

const carePrinciples = [
    { number: '01', icon: HeartHandshake, title: 'Care that starts with listening', text: 'Every visit begins with understanding your concerns, answering questions, and treating you with dignity.' },
    { number: '02', icon: ShieldCheck, title: 'Information you can understand', text: 'We believe people should feel informed about their care and confident about the next step.' },
    { number: '03', icon: UsersRound, title: 'A team around your wellbeing', text: 'Healthcare is a partnership. We aim to make each interaction respectful, thoughtful, and clear.' },
];

const visitSteps = [
    { icon: MessageCircle, title: 'Tell us what you need', text: 'Contact our team with a question or to ask about the services available.' },
    { icon: CalendarDays, title: 'Plan your visit', text: 'Check the latest contact and location information before you come in.' },
    { icon: HeartPulse, title: 'Take the next step', text: 'Our team will help you understand the appropriate way forward.' },
];

export default function Welcome() {
    const { site } = usePage<SharedData>().props;

    return (
        <div className="iwc-home">
            <section className="iwc-hero">
                <div className="iwc-hero-media" aria-hidden="true">
                    <video className="iwc-hero-video iwc-hero-video-light" autoPlay muted loop playsInline preload="metadata">
                        <source src="/videos/clinic-hero.mp4" type="video/mp4" />
                    </video>
                    <video className="iwc-hero-video iwc-hero-video-dark" autoPlay muted loop playsInline preload="metadata">
                        <source src="/videos/clinic-hero-dark.mp4" type="video/mp4" />
                    </video>
                    <div className="iwc-hero-scrim" />
                    <div className="iwc-hero-orb iwc-hero-orb-one" />
                    <div className="iwc-hero-orb iwc-hero-orb-two" />
                </div>
                <div className="site-container iwc-hero-inner">
                    <div className="iwc-hero-copy iwc-reveal">
                        <span className="iwc-kicker"><span className="iwc-kicker-dot" /> Care centred on you</span>
                        <h1>Healthcare that sees <span>the whole you.</span></h1>
                        <p className="iwc-hero-lead">{site.tagline || `At ${site.name}, we believe good healthcare begins with compassion, clear communication, and respect for every person.`}</p>
                        <div className="iwc-hero-actions">
                            <Link href="/services" className="iwc-button iwc-button-primary">Explore our services <ArrowUpRight className="size-4" /></Link>
                            <Link href="/about" className="iwc-button iwc-button-glass">Discover our approach <ArrowRight className="size-4" /></Link>
                        </div>
                        <div className="iwc-trust-row">
                            <div className="iwc-avatar-stack" aria-hidden="true">
                                <span className="iwc-avatar iwc-avatar-one"><HeartPulse /></span>
                                <span className="iwc-avatar iwc-avatar-two"><Stethoscope /></span>
                                <span className="iwc-avatar iwc-avatar-three"><ShieldCheck /></span>
                            </div>
                            <div className="iwc-trust-copy"><strong>A more personal care experience</strong><span>Respectful care. Clear information. A team that listens.</span></div>
                        </div>
                    </div>
                    <a href="#our-approach" className="iwc-scroll-cue"><span>Discover our approach</span><ArrowDown className="size-4" /></a>
                </div>
                <div className="iwc-hero-bottom-fade" />
            </section>

            <section className="iwc-intro site-section" id="our-approach">
                <div className="site-container iwc-intro-grid">
                    <div className="iwc-intro-heading iwc-reveal"><span className="iwc-section-label">A different kind of experience</span><h2>Care should feel <em>human.</em></h2><span className="iwc-heading-rule" /></div>
                    <div className="iwc-intro-body iwc-reveal iwc-delay-1"><p className="iwc-intro-large">When you need healthcare, you deserve to feel heard—not hurried. We want every person who connects with {site.name} to find a welcoming team, clear information, and a respectful path forward.</p><p className="iwc-muted">{site.description || `${site.name} is committed to supporting health and wellbeing through compassionate service, thoughtful communication, and care that respects each individual.`}</p><Link href="/about" className="iwc-text-link">Learn more about us <ArrowRight /></Link></div>
                </div>
            </section>

            <section className="iwc-principles site-section">
                <div className="site-container">
                    <div className="iwc-section-heading iwc-reveal"><div><span className="iwc-section-label">What guides us</span><h2>Small details.<br /><em>A meaningful difference.</em></h2></div><p>Our approach is grounded in the way people should be treated: with care, honesty, and consideration at every stage.</p></div>
                    <div className="iwc-principle-grid">
                        {carePrinciples.map(({ number, icon: Icon, title, text }, index) => <article key={number} className={`iwc-principle-card iwc-reveal iwc-delay-${index + 1}`}><div className="iwc-principle-top"><span className="iwc-principle-number">{number}</span><span className="iwc-principle-icon"><Icon /></span></div><h3>{title}</h3><p>{text}</p><span className="iwc-card-line" /></article>)}
                    </div>
                </div>
            </section>

            <section className="iwc-services-band">
                <div className="site-container iwc-services-grid">
                    <div className="iwc-services-copy iwc-reveal"><span className="iwc-section-label iwc-label-light">Find the information you need</span><h2>Clear next steps.<br /><em>Care with purpose.</em></h2><p>Explore the information available on our website, learn about our services, or contact our team if you need help finding the right place to start.</p><Link href="/services" className="iwc-button iwc-button-white">Explore services <ArrowUpRight /></Link></div>
                    <div className="iwc-service-links iwc-reveal iwc-delay-2">
                        <Link href="/services" className="iwc-service-link"><span className="iwc-service-link-icon"><HeartPulse /></span><span><strong>Our services</strong><small>Learn about available care and support.</small></span><ArrowUpRight /></Link>
                        <Link href="/about" className="iwc-service-link"><span className="iwc-service-link-icon"><UsersRound /></span><span><strong>About our clinic</strong><small>Understand our approach and values.</small></span><ArrowUpRight /></Link>
                        <Link href="/contact" className="iwc-service-link"><span className="iwc-service-link-icon"><MapPin /></span><span><strong>Contact and location</strong><small>Find our contact details and directions.</small></span><ArrowUpRight /></Link>
                    </div>
                </div>
            </section>

            <section className="iwc-journey site-section">
                <div className="site-container">
                    <div className="iwc-section-heading iwc-reveal"><div><span className="iwc-section-label">Getting started</span><h2>Your next step,<br /><em>made clearer.</em></h2></div><p>Whether you are looking for information or preparing to visit, start with what you need and reach out if something is unclear.</p></div>
                    <div className="iwc-journey-grid">
                        {visitSteps.map(({ icon: Icon, title, text }, index) => <article className={`iwc-journey-step iwc-reveal iwc-delay-${index + 1}`} key={title}><span className="iwc-journey-icon"><Icon /></span><span className="iwc-journey-index">STEP 0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
                    </div>
                </div>
            </section>

            <section className="iwc-contact-cta">
                <div className="site-container iwc-cta-inner iwc-reveal"><div className="iwc-cta-mark"><HeartHandshake /></div><div className="iwc-cta-copy"><span className="iwc-section-label iwc-label-light">We are here to help</span><h2>Let’s start with a conversation.</h2><p>For questions about our clinic, services, or how to reach us, get in touch with our team.</p>{site.address && <span className="iwc-cta-address"><MapPin /> {site.address}</span>}</div><Link href="/contact" className="iwc-button iwc-button-white">Contact us <ArrowUpRight /></Link></div>
            </section>
        </div>
    );
}
