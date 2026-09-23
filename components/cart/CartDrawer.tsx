"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/context/CartContext";
import { X, Trash2, ShieldCheck, Info, CreditCard, Lock, CheckCircle, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getTradeLockLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, toggleCart, removeFromCart, clearCart, totalPrice } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<"CART" | "PAYMENT" | "SUCCESS">("CART");
  const [paymentMethod, setPaymentMethod] = useState<string>("CARD");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const listingIds = items.map(item => item.listingId || item.id);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingIds, paymentMethod }),
      });
      const data = await res.json();

      if (data.success) {
        setCheckoutStep("SUCCESS");
        clearCart();
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: "CARD", label: "Credit/Debit Card", icon: CreditCard },
    { id: "SEPA", label: "SEPA Bank Transfer", icon: CreditCard },
    { id: "ACH", label: "ACH Transfer", icon: CreditCard },
    { id: "PAYPAL", label: "PayPal", icon: CreditCard },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-black text-white flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-blue-500" />
            Your Cart {items.length > 0 && <span className="ml-2 text-zinc-500 font-medium">({items.length})</span>}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {items.length === 0 && checkoutStep === "CART" ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p>Your cart is empty.</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : checkoutStep === "CART" ? (
            <div className="space-y-4">
              {/* Trust badges */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-emerald-400 text-xs flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">0% Buyer Fees</div>
                  <div className="text-emerald-500/80 mt-0.5">You pay exactly the listed price. No hidden fees. No KYC required for buyers.</div>
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-3">
                {items.map((item) => {
                  const tradeInfo = getTradeLockLabel(item.tradableAfter || null, item.isTradable);

                  return (
                    <div key={item.listingId || item.id} className="flex items-center space-x-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl relative group">
                      <img src={item.iconUrl} alt={item.marketName} className="w-16 h-16 object-contain" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-white truncate">{item.marketName}</div>
                        <div className="font-mono text-blue-400 font-bold text-sm mt-1">{formatCurrency(item.currentPrice)}</div>
                        <div className="mt-1">
                          {tradeInfo.isTradable ? (
                            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Tradable</span>
                          ) : (
                            <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded flex-inline items-center space-x-1">
                              <Lock className="w-2.5 h-2.5 inline mr-1" />
                              {tradeInfo.label}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.listingId || item.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Warning about delivery */}
              <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-lg text-blue-300 text-xs flex items-start space-x-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  Items with a trade lock will be held securely in our custodial Steam bot and auto-delivered to your Steam account immediately after the 7-day hold expires.
                </div>
              </div>
            </div>
          ) : checkoutStep === "PAYMENT" ? (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Total Due</span>
                  <span className="text-xl font-mono font-black text-white">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="text-xs text-zinc-500 border-t border-zinc-800 pt-3">
                  Skinport balance is only for sellers and cannot be used for purchases.
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-bold text-white mb-2">Select Payment Method</div>
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      paymentMethod === method.id
                        ? "bg-blue-600/10 border-blue-500 text-white"
                        : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? "text-blue-400" : ""}`} />
                      <span className="font-semibold">{method.label}</span>
                    </div>
                    {paymentMethod === method.id && <CheckCircle className="w-4 h-4 text-blue-500" />}
                  </button>
                ))}
              </div>

              <div className="bg-zinc-900/50 p-3 rounded-lg flex items-center justify-center space-x-2 text-xs text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure Checkout powered by Adyen</span>
              </div>
            </div>
          ) : checkoutStep === "SUCCESS" ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-center py-10">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">Payment Successful!</h3>
                <p className="text-sm text-zinc-400 max-w-[280px]">
                  Your order has been processed securely.
                </p>
              </div>
              <div className="bg-blue-950/40 border border-blue-900/50 p-4 rounded-xl text-left w-full text-sm text-blue-200">
                <div className="font-bold text-blue-400 mb-1">What happens next?</div>
                <ul className="space-y-2 text-xs list-disc pl-4">
                  <li>Tradable items have been sent to your Steam account. Please accept the trade offer.</li>
                  <li>Trade-locked items remain in our custodial bot and will be auto-delivered once the hold expires.</li>
                </ul>
              </div>
              <Button className="w-full mt-4" onClick={() => { setIsCartOpen(false); setCheckoutStep("CART"); }}>
                Continue to Dashboard
              </Button>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {checkoutStep !== "SUCCESS" && items.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950">
            {checkoutStep === "CART" ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-xl font-mono text-white">{formatCurrency(totalPrice)}</span>
                </div>
                <Button
                  onClick={() => setCheckoutStep("PAYMENT")}
                  className="w-full py-6 text-base font-bold bg-blue-600 hover:bg-blue-500"
                >
                  Proceed to Checkout <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            ) : checkoutStep === "PAYMENT" ? (
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-6 text-base font-bold bg-blue-600 hover:bg-blue-500"
                >
                  {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalPrice)}`}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setCheckoutStep("CART")}
                  className="w-full text-zinc-400"
                >
                  Back to Cart
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
