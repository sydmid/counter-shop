"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, LifeBuoy, Mail } from "lucide-react";

const FAQ_DATA = [
  {
    category: "Trade & Escrow",
    items: [
      {
        question: "How does the new trade protection affect skin trading?",
        answer: "Due to Valve's recent updates, all items traded to our custodial bots are subject to a mandatory 7-day trade hold. Once you purchase an item, it remains safely in our escrow system until the hold expires, at which point it is auto-delivered to your Steam account."
      },
      {
        question: "What does the remaining time and the 'Tradable' label mean?",
        answer: "The 'Tradable' label indicates whether an item can be instantly withdrawn to your Steam inventory. If it shows a countdown timer (e.g., 'Tradable in 3 days'), it is still under the mandatory Steam 7-day trade hold. You can buy the item now, but you will need to wait for the timer to reach zero before you can withdraw it."
      }
    ]
  },
  {
    category: "Payments & Balance",
    items: [
      {
        question: "Why was my payment declined?",
        answer: "Payments may be declined by your bank or our payment processor (Adyen) for various reasons, such as insufficient funds, strict fraud filters, or region locks. Please ensure your card supports international online transactions."
      },
      {
        question: "Can buyers use Skinport balance?",
        answer: "No, store balance is strictly an unspendable holding account for sellers awaiting bank payout. Buyers must checkout using direct payment methods like SEPA, ACH, PayPal, or Cards. We do not support topping up a wallet or spending sales proceeds directly on new items."
      },
      {
        question: "How do I change my currency?",
        answer: "You can change your display currency using the currency selector in the site navigation or footer. Note that all actual transactions are processed in EUR or USD depending on your region and payment method."
      }
    ]
  },
  {
    category: "Accounts & Policy",
    items: [
      {
        question: "What are the age requirements?",
        answer: "You must be at least 18 years old to use our marketplace. Sellers must pass a strict Adyen KYC identity verification process to list items, which requires proof of age and a linked bank account."
      }
    ]
  }
];

export default function SupportPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-400 mb-2">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-white">Support & FAQ</h1>
        <p className="text-zinc-400 max-w-lg mx-auto text-sm leading-relaxed">
          Find answers to common questions about trade protection, payments, and account requirements.
        </p>
      </div>

      {/* Contact Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Need more help?</h3>
            <p className="text-xs text-zinc-400">Our support team typically responds within 24 hours.</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-sm rounded-lg transition-colors">
          Contact Support
        </button>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {FAQ_DATA.map((section, catIdx) => (
          <div key={section.category} className="space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((item, itemIdx) => {
                const isOpen = openItems[`${catIdx}-${itemIdx}`];
                return (
                  <div
                    key={item.question}
                    className="border border-zinc-800 bg-zinc-900/30 rounded-xl overflow-hidden transition-colors hover:border-zinc-700"
                  >
                    <button
                      onClick={() => toggleItem(catIdx, itemIdx)}
                      className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                    >
                      <span className="text-sm font-semibold text-zinc-200">
                        {item.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50 mt-1 bg-zinc-900/10">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
