import React, { useEffect } from "react";
import { baseURL } from "../utils/constant/Constant";
import { useLocation } from "react-router-dom";

export default function RazorpayCheckout() {
  const location = useLocation();
  const amount = location.state?.amount || 500;
  const participants = location.state?.participants;
  const username = location.state?.username || "";
  const userGotra = location.state?.userGotra || "";
  const mobile = location.state?.mobile || "";
  const id = location.state?.id || "";
  const packageType = location.state?.pkg || ""; // "single", "couple", "family" for Pooja, empty for Chadhava
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  console.log("location data----> ", location);
  
  // Function to create CRM contact using public endpoint
  const createPublicContact = async (contactData) => {
    try {
      const response = await fetch(`${baseURL}/api/crm/public/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating CRM contact:", error);
      throw error;
    }
  };
  
  const handlePayment = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      const result = await fetch(`${baseURL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          username,
          userGotra,
          mobile,
          pooja: id,
          participants: participants,
        }),
      });
      const data = await result.json();
      const options = {
        key: "rzp_live_RHWbkMMBTyv7oi",
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "Dev Yogam",
        description: "Transaction",
        order_id: data?.order?.id,
        handler: async function (response) {
          const verifyRes = await fetch(
            `${baseURL}/api/payment/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: amount,
                username,
                userGotra,
                mobile,
                pooja: id,
                participants: participants,
              }),
            }
          );
          const verifyData = await verifyRes.json();
          // alert(verifyData.message);
          if (verifyData.message === "Payment verified successfully") {
            
            // Create CRM contact after successful payment using public endpoint
            try {
              // Determine if it's Pooja or Chadhava based on packageType
              const source = packageType ? "Pooja Booking" : "Chadhava Booking";
              const serviceType = packageType ? `Pooja (${packageType})` : "Chadhava";
              
              await createPublicContact({
                name: username,
                phone: mobile,
                status: "interested",
                source: source,
                interestedService: id,
                notes: `${serviceType} booking - Amount: ₹${amount}, Participants: ${participants?.length || 1}`,
              });
              console.log("CRM contact created successfully");
            } catch (crmError) {
              console.error("Failed to create CRM contact:", crmError);
              // Continue even if CRM contact creation fails
            }
            
            if (
              window.confirm(
                "✅ Payment successful! Click OK to go to homepage."
              )
            ) {
              window.location.href = "/"; 
            }
          } else {
            alert(`${verifyData.message || "Payment verification failed"}`);
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed");
    }
  };

  useEffect(() => {
    handlePayment();
  }, []);

  return null;
}
