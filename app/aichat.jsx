import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
} from "react-native-gifted-chat";
import Colors from "@/constants/Colors";
import axios from "axios"; 
import { CHAT_API_KEY }from "@env"
export default function aichat() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(""); 

  const handleSend = async (newMessages = []) => {
    try {
      const userMessage = newMessages[0];
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, userMessage)
      );
      const messageText = userMessage.text.toLowerCase();
      const keywords = [
        "dance",
        "music",
        "dance style",
        "training",
        "moves",
        "choreography",
        "events",
        "party",
        "parties",
        "latino",
        "styles",
      ];
      if (!keywords.some((keyword) => messageText.includes(keyword))) {
        const botMessage = {
          _id: new Date().getTime() + 1,
          text: "I am your dance bot, ask me anything you want to find out about dance.",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Dance bot",
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, botMessage)
        );
        return;
      }
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          prompt: `User asked: ${userMessage.text}`,
          max_tokens: 600, // Reduced max_tokens
          temperature: 0.2,
          n: 1,
          model: "gpt-3.5-turbo-instruct", // Include the model parameter
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CHAT_API_KEY}`,
          },
        }
      );
      console.log(response.data);
      const dance = response.data.choices[0].text.trim();
      const botMessage = {
        _id: new Date().getTime() + 1,
        text: dance,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Dance bot",
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, botMessage)
      );
    } catch (err) {
      console.log("error calling  ", err);
      console.log(err.response);
      if (
        err.response?.status === 429 ||
        err.response?.data?.error?.code === "insufficient_quota"
      ) {
        setError(
          "You have exceeded your API quota. Please check your usage limits or upgrade your plan."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
          padding: 6,
          borderTopWidth: 1,
          borderTopColor: Colors.PRIMARY,
          borderWidth: 1,
          borderColor: Colors.PRIMARY,
          borderRadius: 20,
          marginBottom: 10,
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={{ borderWidth: 0 }}>
        <View style={styles.sendingContainer}>
          <Text style={styles.sendText}>Send</Text>
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.PRIMARY_LIGHT,
          },
          right: {
            backgroundColor: Colors.PRIMARY,
          },
        }}
        textStyle={{
          right: {
            color: Colors.WHITE,
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Dance AI</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => handleSend(newMessages)}
        user={{ _id: 1 }}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderBubble={renderBubble}
        alwaysShowSend
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.BLACK,
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: "column",
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    width: 55,
    height: 35,
    marginRight: 5,
    marginBottom: 5,
  },
  sendText: {
    color: Colors.WHITE,
    fontWeight: "bold",
    fontSize: 16,
  },
});
