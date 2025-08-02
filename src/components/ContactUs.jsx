import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [emailField, setEmailField] = useState("");
  const [message, setMessage] = useState("");

  const whatsappNumber = "46727753891"; // بدون +
  const handleSubmit = (e) => {
    e.preventDefault();

    // بسيط: تحقق من الحقول
    if (!name.trim() || !emailField.trim() || !message.trim()) {
      alert("Please fill in name, email and message.");
      return;
    }

    // نسق الرسالة
    const textLines = [
      "📩 New contact from Email Scraper Tool",
      `Name: ${name}`,
      `Email: ${emailField}`,
      `Message: ${message}`,
      "",
      "— End of message —",
    ];
    const text = textLines.join("\n");

    // بناء رابط WhatsApp
    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    // يفتح في تبويب جديد
    window.open(waUrl, "_blank");
  };

  return (
    <section id="contact-us" className="max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Contact Us
        </h2>
        <p className="mt-2 text-gray-700">
          Have questions, suggestions, or want to support the project? Reach out directly or choose your preferred channel below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">Email</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>mohdpay.il@gmail.com</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText("mohdpay.il@gmail.com");
                    // optional: toast feedback
                  }}
                  aria-label="Copy email"
                  className="ml-2"
                >
                  📋
                </Button>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">WhatsApp</h4>
              <p className="text-sm text-muted-foreground">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  +46 727 753 891
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">Location</h4>
              <p className="text-sm text-muted-foreground">Malmö, Sweden</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="http://buymeacoffee.com/devismail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow"
            >
              ☕ Support on BuyMeACoffee
            </a>
            <a
              href="https://khamsat.com/user/mismail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded"
            >
              🛠 Khamsat Profile
            </a>
          </div>
        </div>

        {/* Form that sends to WhatsApp */}
        <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-background/20">
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Whether you need help optimizing your scraping workflow, want to request a feature, or just say hi—fill the form and send it via WhatsApp.
          </p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border/50 bg-white/10 px-4 py-2 text-sm"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={emailField}
              onChange={(e) => setEmailField(e.target.value)}
              className="w-full rounded-md border border-border/50 bg-white/10 px-4 py-2 text-sm"
              required
            />
            <textarea
              placeholder="Message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border border-border/50 bg-white/10 px-4 py-2 text-sm resize-none"
              required
            />
            <Button type="submit" className="w-full">
              Send via WhatsApp
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            After pressing the button, WhatsApp will open with a prefilled message. Just press Enter to send. No data is stored unless you choose to.
          </p>
        </div>
      </div>

      {/* Optional extra suggestions */}
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>
          ⚡ <strong>Suggestion:</strong> Add a short FAQ below or testimonials from early users to build trust. Consider adding a copyable prewritten search query example for each niche.
        </p>
      </div>
    </section>
  );
};

export default ContactUs;
