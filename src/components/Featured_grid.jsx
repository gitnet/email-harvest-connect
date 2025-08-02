import React from "react";
import { Mail, Send, Database, ChevronLeft, ChevronRight } from "lucide-react";

// هذا ممكن تحطه في نفس الملف أو تفصّله إذا عندك ملف مستقل
const features = [
  {
    title: "Smart Email Extraction",
    description: "Advanced regex patterns to find all email addresses on any public website",
    Icon: Mail,
    imageUrl: "../../public/images/extractEmails.png",
    linkHref: "#Home",
    target: ""
  },
  {
    title: "GetResponse Integration",
    description: "Direct API connection to send scraped emails to your marketing lists",
    Icon: Send,
    imageUrl: "../../public/images/api_connect.png",
    linkHref: "https://www.getresponse.com?a=WNXT7tMYMJ",
    target: "_blank"
  },
  {
    title: "Export Emails",
    description: "Easily export and organize your collected emails for future campaigns.",
    Icon: Database,
    imageUrl: "../../public/images/export_emails.png",
    linkHref: "#exportxlsx",
    target: ""
  },
];

const FeatureSlider = () => {
  const containerRef = React.useRef(null);

  const scrollBy = (offset) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-background">Features</h2>
          <div className="flex gap-2">
            <button
              aria-label="Previous"
              onClick={() => {
                if (containerRef.current) {
                  scrollBy(-containerRef.current.clientWidth * 0.8);
                }
              }}
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition"
            >
              <ChevronLeft className="h-5 w-5 text-background" />
            </button>
            <button
              aria-label="Next"
              onClick={() => {
                if (containerRef.current) {
                  scrollBy(containerRef.current.clientWidth * 0.8);
                }
              }}
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition"
            >
              <ChevronRight className="h-5 w-5 text-background" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {features.map(({ title, description, Icon, imageUrl , linkHref, target }, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] snap-start bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-background/20 flex flex-col items-center text-center
                         transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {imageUrl && (
                <div className="mb-4 w-full">
                <a href={linkHref} className="block mb-2" target={target} rel="noopener noreferrer">
                  <img
                    src={imageUrl}
                    alt={`${title} illustration`}
                    className="h-25 object-cover rounded-md"
                  />
                </a>
                </div>
              )}
              <Icon className="h-8 w-8 text-background mb-4" />
              <h3 className="text-lg font-semibold text-background mb-2">{title}</h3>
              <p className="text-background/80 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSlider;