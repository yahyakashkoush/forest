// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  phoneNumber: "201097767079",
  
  // Helper function to create WhatsApp link
  createLink: (message = "") => {
    return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
  },
  
  // Helper function to open WhatsApp
  openChat: (message = "") => {
    const link = WHATSAPP_CONFIG.createLink(message);
    window.open(link, '_blank');
  }
};

export default WHATSAPP_CONFIG;