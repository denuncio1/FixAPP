"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Menu, Bot, ArrowLeft, Send } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

const VirtualAssistant = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "assistant", text: "Olá! Sou seu assistente virtual. Como posso ajudar com as ordens de serviço hoje?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newUserMessage: ChatMessage = { sender: "user", text: inputMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const lowerCaseMessage = newUserMessage.text.toLowerCase();
      let assistantResponseText = "Desculpe, não entendi. Você pode reformular sua pergunta?";

      if (lowerCaseMessage.includes("os") || lowerCaseMessage.includes("ordem de serviço")) {
        assistantResponseText = "Para criar uma nova ordem de serviço, você pode ir para a seção 'Ordens de Serviço' e clicar em 'Nova OS'.";
      } else if (lowerCaseMessage.includes("técnico") || lowerCaseMessage.includes("equipe")) {
        assistantResponseText = "Precisa de informações sobre um técnico? Posso te direcionar para a página de 'Técnicos'.";
      } else if (lowerCaseMessage.includes("ajuda") || lowerCaseMessage.includes("suporte")) {
        assistantResponseText = "Você pode visitar a 'Central de Ajuda' para FAQs e tutoriais, ou 'Solicitar Suporte' para falar com nossa equipe.";
      } else if (lowerCaseMessage.includes("olá") || lowerCaseMessage.includes("oi")) {
        assistantResponseText = "Olá! Em que posso ser útil?";
      }

      setMessages((prev) => [...prev, { sender: "assistant", text: assistantResponseText }]);
    }, 1000);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Assistente Virtual</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Assistente Virtual para Triagem de Problemas</h2>
            <p className="text-muted-foreground">
              Utilize o assistente virtual para auxiliar na triagem inicial de problemas e direcionamento de ordens de serviço.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto h-[70vh] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" /> Chat com Assistente
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-3",
                        msg.sender === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {msg.sender === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3 text-sm",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {msg.text}
                      </div>
                      {msg.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            Você
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <div className="border-t p-4 flex items-center gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={inputMessage.trim() === ""}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VirtualAssistant;