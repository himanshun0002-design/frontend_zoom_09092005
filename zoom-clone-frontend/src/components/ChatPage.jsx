import React, { useState, useEffect, useRef } from "react";
import { getWebSocketUrl } from "../config/serverConfig";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(`${getWebSocketUrl()}/ws/chat/`);

      ws.current.onopen = () => console.log("WebSocket connected");

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected, retrying in 1s");
        setTimeout(connect, 1000);
      };
    };

    connect();
  }, []);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (input.trim() !== "" && username.trim() !== "") {
      ws.current.send(JSON.stringify({ username, message: input }));
      setInput("");
    }
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: "700px",
      margin: "20px auto",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      height: "90vh",
    },
    header: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid #ccc",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    usernameInput: {
      margin: "10px 0",
    },
    chatBox: {
      flex: 1,
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      overflowY: "auto",
      backgroundColor: "#f5f5f5",
    },
    chatInput: {
      display: "flex",
      padding: "20px 0",
      gap: "10px",
    },
    input: {
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      outline: "none",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#0084ff",
      color: "#fff",
      cursor: "pointer",
    },
    messageContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    message: {
      maxWidth: "60%",
      padding: "10px",
      borderRadius: "10px",
      wordBreak: "break-word",
    },
    myMessage: {
      backgroundColor: "#0084ff",
      color: "white",
      alignSelf: "flex-end",
      textAlign: "right",
    },
    otherMessage: {
      backgroundColor: "#e4e6eb",
      color: "black",
      alignSelf: "flex-start",
      textAlign: "left",
    },
    usernameLabel: {
      fontWeight: "bold",
      marginBottom: "3px",
      fontSize: "0.85rem",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <i className="fas fa-comments"></i>
          <h1>Zoom Clone Chat</h1>
        </div>
      </header>

      <div style={styles.usernameInput}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ ...styles.input, width: "100%" }}
        />
      </div>

      <div style={styles.chatBox}>
        <div style={styles.messageContainer}>
          {messages.map((msg, index) => {
            const isMe = msg.username === username;
            return (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(isMe ? styles.myMessage : styles.otherMessage),
                }}
              >
                {!isMe && <div style={styles.usernameLabel}>{msg.username}</div>}
                {msg.message}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div style={styles.chatInput}>
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.input}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
