import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

interface Message {
    id: number;
    sender: "customer" | "owner";
    content: string;
}

const filePath = FileSystem.documentDirectory + "messages.json";

const ChatScreen: React.FC = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const fileInfo = await FileSystem.getInfoAsync(filePath);
                if (fileInfo.exists) {
                    const content = await FileSystem.readAsStringAsync(filePath);
                    setMessages(JSON.parse(content));
                } else {
                    const defaultMessages: Message[] = [
                        { id: 1, sender: "customer", content: "Hello, I have a question about my order." },
                        { id: 2, sender: "owner", content: "Hi! How can I assist you?" }
                    ];
                    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(defaultMessages));
                    setMessages(defaultMessages);
                }
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        };

        loadMessages();
    }, []);

    const saveMessages = async (messagesToSave: Message[]) => {
        try {
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify(messagesToSave));
        } catch (error) {
            console.error("Error saving messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const newMessageObj: Message = {
                id: messages.length + 1,
                sender: "owner",
                content: newMessage,
            };
            const updatedMessages = [...messages, newMessageObj];
            setMessages(updatedMessages);
            setNewMessage("");
            await saveMessages(updatedMessages); // Save to JSON file
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Image source={{ uri: "https://www.shareicon.net/data/512x512/2016/05/24/770137_man_512x512.png" }} style={styles.avatar} />
                <Text style={styles.headerTitle}>Customer</Text>
            </View>

            {/* Chat Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageContainer, item.sender === "owner" ? styles.ownerMessage : styles.customerMessage]}>
                        <Text style={styles.messageText}>{item.content}</Text>
                    </View>
                )}
                style={styles.chatList}
            />

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Type your message..." value={newMessage} onChangeText={setNewMessage} />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    marginTop: 20,
  },
  backButton: { marginRight: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  chatList: { flex: 1, marginBottom: 10 },
  messageContainer: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
    maxWidth: "75%",
    backgroundColor: "#e6f7ff",
    alignSelf: "flex-start",
  },
  ownerMessage: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  customerMessage: {
    backgroundColor: "#a9a9a9",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  messageText: { color: "#F8F9FA", fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
});

export { ChatScreen };
