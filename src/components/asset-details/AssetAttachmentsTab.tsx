"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paperclip, Image as ImageIcon, Video, FileText, Plus } from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  type: "document" | "image" | "video";
  url: string;
}

interface AssetAttachmentsTabProps {
  attachments: Attachment[];
}

const AssetAttachmentsTab: React.FC<AssetAttachmentsTabProps> = ({ attachments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" /> Documentos e Mídias
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attachments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="border rounded-md p-3 flex items-center gap-3">
                {attachment.type === "image" && <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                {attachment.type === "video" && <Video className="h-6 w-6 text-muted-foreground" />}
                {attachment.type === "document" && <FileText className="h-6 w-6 text-muted-foreground" />}
                <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                  {attachment.name}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Nenhum anexo ou documento disponível.</p>
        )}
        <Button variant="outline" className="mt-4 w-full">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Anexo
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssetAttachmentsTab;