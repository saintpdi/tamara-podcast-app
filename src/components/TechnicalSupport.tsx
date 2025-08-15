
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, HelpCircle, Mail, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TechnicalSupportProps {
  onBack: () => void;
}

const TechnicalSupport = ({ onBack }: TechnicalSupportProps) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: "How do I create a video podcast?",
      answer: "Go to the Create tab, toggle the switch to 'Video Podcast', fill in your details, and either record directly or upload a video file. Maximum duration is 59 minutes."
    },
    {
      question: "What's the difference between short videos and podcasts?",
      answer: "Short videos are limited to 1 minute and appear in the main feed. Podcasts can be up to 59 minutes long and are subscription-based content."
    },
    {
      question: "How do I set up subscriptions for my podcast?",
      answer: "When creating a podcast, enter your desired monthly subscription fee. Leave blank for free podcasts. Users can subscribe to access your content."
    },
    {
      question: "Can I upload both audio and video files?",
      answer: "Yes! You can create both audio-only and video podcasts. Toggle between the two modes when creating your podcast."
    },
    {
      question: "How do I search for specific content?",
      answer: "Use the Search tab to find videos, podcasts, users, and hashtags. Switch between 'Videos' and 'Podcasts' tabs to filter your search results."
    },
    {
      question: "My video won't upload. What should I do?",
      answer: "Ensure your video is under the maximum duration (1 minute for shorts, 59 minutes for podcasts) and in a supported format (MP4, MOV, AVI)."
    }
  ];

  const handleSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Support Request Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-pink-600 hover:bg-pink-50"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold pink-text">Technical Support</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* FAQ Section */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 pink-text">
              <HelpCircle size={20} />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-pink-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 pink-text">
              <MessageSquare size={20} />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Name *
                </label>
                <Input
                  placeholder="Your full name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="border-gray-300 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="border-gray-300 focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Subject
              </label>
              <Input
                placeholder="Brief description of your issue"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                className="border-gray-300 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Message *
              </label>
              <Textarea
                placeholder="Please describe your issue in detail..."
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="border-gray-300 focus:border-pink-500"
                rows={5}
              />
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Mail size={16} className="mr-2" />
              Send Support Request
            </Button>
          </CardContent>
        </Card>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <Mail size={32} className="mx-auto text-pink-500 mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">Get help via email</p>
              <Button size="sm" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                support@shetalks.com
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <MessageSquare size={32} className="mx-auto text-pink-500 mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-3">Chat with our team</p>
              <Button size="sm" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupport;
