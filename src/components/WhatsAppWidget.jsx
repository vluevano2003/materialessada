import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";
import "../styles/WhatsAppWidget.css";

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); 
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Bienvenido a Materiales SADA. 👋 ¿En qué podemos ayudarte hoy?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        const docRef = doc(db, "empresa", "info");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.whatsappWidget && data.whatsappWidget.trim() !== "") {
            const rawNumber = data.whatsappWidget.trim();
            setPhoneNumber(`521${rawNumber}`);
          }
        }
      } catch (error) {
        console.error("Error obteniendo número de WhatsApp:", error);
      }
    };

    fetchWhatsAppNumber();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    
    const textToSend = inputValue;
    setInputValue("");

    setTimeout(() => {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
      window.open(url, "_blank");
      
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: "Te estamos redirigiendo a WhatsApp para continuar la conversación... 🚀",
        sender: "system",
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="whatsapp-widget-container">
      <div className={`whatsapp-chat-window ${isOpen ? "open" : ""}`}>
        
        <div className="chat-header">
          <div className="avatar-container">
            <div className="avatar">MS</div>
            <div className="online-badge"></div>
          </div>
          <div className="header-info">
            <h4>Soporte SADA</h4>
            <p>Normalmente responde en minutos</p>
          </div>
          <button className="close-btn" onClick={toggleChat}>&times;</button>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-btn-icon" onClick={handleSendMessage}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <button className="whatsapp-float-btn" onClick={toggleChat}>
        {isOpen ? (
           <span style={{fontSize: '24px', fontWeight: 'bold'}}>&times;</span>
        ) : (
           <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
             <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.21C10.43 20.21 8.92 19.78 7.62 19.02L7.29 18.82L4.06 19.66L4.93 16.5L4.72 16.16C3.9 14.86 3.47 13.39 3.47 11.91C3.47 7.18 7.32 3.33 12.05 3.33C14.36 3.33 16.53 4.23 18.17 5.86C19.8 7.5 20.7 9.66 20.7 11.92C20.7 16.65 16.85 20.21 12.05 20.21Z" />
           </svg>
        )}
      </button>
    </div>
  );
};

export default WhatsAppWidget;