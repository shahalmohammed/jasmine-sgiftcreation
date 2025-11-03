import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Facebook,
    Instagram,
    MessageCircle,
    CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
                        <MessageCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a question or a custom order? We'd love to hear from you!
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {/* Contact Information Cards */}
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <Phone className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground">Phone</h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                    Give us a call
                                </p>
                                <a
                                    href="tel:+447936761983"
                                    className="text-primary hover:text-primary/80 font-medium"
                                >
                                    +44 7936 761983
                                </a>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <Mail className="h-8 w-8 text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground">Email</h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                    Send us an email
                                </p>
                                <a
                                    href="mailto:info@jasminesgift.com"
                                    className="text-primary hover:text-primary/80 font-medium"
                                >
                                    info@jasminesgift.com
                                </a>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <MapPin className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground">Location</h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                    Our studio
                                </p>
                                <p className="text-foreground font-medium">
                                    Humberstone, United Kingdom
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <Clock className="h-8 w-8 text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground">Working Hours</h3>
                                <div className="text-foreground text-sm space-y-1">
                                    <p>Mon - Fri: 9am - 6pm</p>
                                    <p>Saturday: 10am - 4pm</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* WhatsApp CTA */}
                <div className="max-w-2xl mx-auto mt-12">
                    <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
                        <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                            Prefer WhatsApp?
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Get instant responses to your queries. Chat with us directly on WhatsApp for quick assistance with your orders.
                        </p>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => window.open('https://wa.me/+447936761983', '_blank')}
                        >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Chat on WhatsApp
                        </Button>
                    </Card>
                </div>

                {/* Social Media */}
                <div className="max-w-md mx-auto mt-8">
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                        <h3 className="font-semibold text-lg mb-4 text-foreground text-center">Follow Us on Social Media</h3>
                        <div className="flex gap-4 justify-center">
                            <a
                                href="https://www.facebook.com/jasminesgiftcreation"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                            >
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:from-purple-700 hover:to-pink-700 transition-colors"
                            >
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a
                                href="https://wa.me/+447936761983"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-colors"
                            >
                                <MessageCircle className="h-6 w-6" />
                            </a>
                        </div>
                    </Card>
                </div>
            </div>

            {/* FAQ Section */}
            <section className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            <Card className="p-6">
                                <h3 className="font-semibold text-lg mb-2 flex items-start gap-2 text-foreground">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                                    How long does it take to create a custom order?
                                </h3>
                                <p className="text-muted-foreground ml-7">
                                    Most custom orders take 3-5 business days to complete. Rush orders may be available for an additional fee.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="font-semibold text-lg mb-2 flex items-start gap-2 text-foreground">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                                    Do you ship internationally?
                                </h3>
                                <p className="text-muted-foreground ml-7">
                                    Yes! We ship to most countries worldwide. Shipping costs and delivery times vary by location.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="font-semibold text-lg mb-2 flex items-start gap-2 text-foreground">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                                    Can I request a specific design?
                                </h3>
                                <p className="text-muted-foreground ml-7">
                                    Absolutely! We love bringing your ideas to life. Contact us with your design concept and we'll work together to create something special.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="font-semibold text-lg mb-2 flex items-start gap-2 text-foreground">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                                    What is your return policy?
                                </h3>
                                <p className="text-muted-foreground ml-7">
                                    Due to the personalized nature of our products, we cannot accept returns unless the item is damaged or defective. Customer satisfaction is our priority.
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactUs;