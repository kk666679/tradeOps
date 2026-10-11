"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, FileText, Highlighter, MessageSquare, CheckCircle, X, Plus, Edit3, Save, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Annotation Types
export interface DocumentAnnotation {
  id: string;
  type: "highlight" | "comment" | "correction" | "approval";
  content: string;
  selection?: {
    start: number;
    end: number;
    text: string;
  };
  author: string;
  createdAt: Date;
  resolved?: boolean;
  replies?: Array<{
    id: string;
    content: string;
    author: string;
    createdAt: Date;
  }>;
}

export interface DocumentVersion {
  id: string;
  version: string;
  date: Date;
  author: string;
  changes: string;
  status: "draft" | "review" | "approved" | "published";
}

// Document Annotation Component
interface AIDocumentAnnotationProps {
  documentId: string;
  documentTitle: string;
  annotations: DocumentAnnotation[];
  versions?: DocumentVersion[];
  currentVersion?: string;
  onAddAnnotation?: (annotation: Omit<DocumentAnnotation, "id" | "createdAt">) => void;
  onResolveAnnotation?: (annotationId: string) => void;
  onDeleteAnnotation?: (annotationId: string) => void;
  onVersionChange?: (version: string) => void;
  className?: string;
}

export function AIDocumentAnnotation({
  documentId,
  documentTitle,
  annotations,
  versions,
  currentVersion,
  onAddAnnotation,
  onResolveAnnotation,
  onDeleteAnnotation,
  onVersionChange,
  className,
}: AIDocumentAnnotationProps) {
  const [selectedText, setSelectedText] = React.useState<string>("");
  const [annotationType, setAnnotationType] = React.useState<DocumentAnnotation["type"]>("comment");
  const [annotationContent, setAnnotationContent] = React.useState("");
  const [isAddingAnnotation, setIsAddingAnnotation] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"annotations" | "versions">("annotations");

  const unresolvedCount = annotations.filter(a => !a.resolved).length;

  const handleAddAnnotation = () => {
    if (!annotationContent.trim()) return;
    
    onAddAnnotation?.({
      type: annotationType,
      content: annotationContent,
      selection: selectedText ? { start: 0, end: selectedText.length, text: selectedText } : undefined,
      author: "Current User",
      resolved: false,
    });
    
    setAnnotationContent("");
    setSelectedText("");
    setIsAddingAnnotation(false);
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">{documentTitle}</CardTitle>
              <p className="text-xs text-muted-foreground">Document ID: {documentId}</p>
            </div>
          </div>
          <Button onClick={() => setIsAddingAnnotation(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <Button
            variant={activeTab === "annotations" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("annotations")}
          >
            Annotations
            {unresolvedCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {unresolvedCount}
              </Badge>
            )}
          </Button>
          {versions && (
            <Button
              variant={activeTab === "versions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("versions")}
            >
              Versions ({versions.length})
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {activeTab === "annotations" ? (
          <ScrollArea className="h-[400px] px-4 pb-4">
            <div className="space-y-3">
              {annotations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No annotations yet</p>
                  <p className="text-xs">Select text to add an annotation</p>
                </div>
              ) : (
                annotations.map((annotation, index) => (
                  <AnnotationItem
                    key={annotation.id}
                    annotation={annotation}
                    index={index}
                    onResolve={() => onResolveAnnotation?.(annotation.id)}
                    onDelete={() => onDeleteAnnotation?.(annotation.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        ) : versions && (
          <ScrollArea className="h-[400px] px-4 pb-4">
            <div className="space-y-3">
              {versions.map((version) => (
                <VersionItem
                  key={version.id}
                  version={version}
                  isCurrent={version.version === currentVersion}
                  onClick={() => onVersionChange?.(version.version)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Add Annotation Dialog */}
      <Dialog open={isAddingAnnotation} onOpenChange={setIsAddingAnnotation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Annotation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              {(["highlight", "comment", "correction", "approval"] as const).map((type) => (
                <Button
                  key={type}
                  variant={annotationType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAnnotationType(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
            
            {selectedText && (
              <div className="rounded bg-muted p-3 text-sm">
                <span className="text-muted-foreground">Selected: </span>
                <span className="italic">"{selectedText.slice(0, 100)}..."</span>
              </div>
            )}
            
            <Textarea
              placeholder="Enter your annotation..."
              value={annotationContent}
              onChange={(e) => setAnnotationContent(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAnnotation(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAnnotation}>
              <Save className="h-4 w-4 mr-1" />
              Save Annotation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Annotation Item
function AnnotationItem({
  annotation,
  index,
  onResolve,
  onDelete,
}: {
  annotation: DocumentAnnotation;
  index: number;
  onResolve: () => void;
  onDelete: () => void;
}) {
  const typeIcons = {
    highlight: Highlighter,
    comment: MessageSquare,
    correction: Edit3,
    approval: CheckCircle,
  };

  const typeColors = {
    highlight: "bg-yellow-500/10 border-yellow-500/30",
    comment: "bg-blue-500/10 border-blue-500/30",
    correction: "bg-red-500/10 border-red-500/30",
    approval: "bg-green-500/10 border-green-500/30",
  };

  const Icon = typeIcons[annotation.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "rounded-lg border p-4",
        typeColors[annotation.type],
        annotation.resolved && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded",
            annotation.type === "highlight" && "bg-yellow-500/20",
            annotation.type === "comment" && "bg-blue-500/20",
            annotation.type === "correction" && "bg-red-500/20",
            annotation.type === "approval" && "bg-green-500/20"
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs capitalize">
                {annotation.type}
              </Badge>
              {annotation.resolved && (
                <Badge variant="secondary" className="text-xs">Resolved</Badge>
              )}
            </div>
            <p className="text-sm">{annotation.content}</p>
            {annotation.selection && (
              <p className="text-xs text-muted-foreground italic">
                "{annotation.selection.text.slice(0, 50)}..."
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {annotation.author} • {annotation.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {!annotation.resolved && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-xs" onClick={onResolve}>
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={onDelete}>
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      {/* Replies */}
      {annotation.replies && annotation.replies.length > 0 && (
        <div className="mt-3 pl-11 space-y-2 border-l-2">
          {annotation.replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <span className="font-medium">{reply.author}: </span>
              <span className="text-muted-foreground">{reply.content}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Version Item
function VersionItem({
  version,
  isCurrent,
  onClick,
}: {
  version: DocumentVersion;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const statusColors = {
    draft: "bg-muted text-muted-foreground",
    review: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    approved: "bg-green-500/10 text-green-600 border-green-500/30",
    published: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50",
        isCurrent && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">v{version.version}</span>
          {isCurrent && <Badge variant="default">Current</Badge>}
        </div>
        <Badge className={statusColors[version.status]}>{version.status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{version.changes}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{version.author}</span>
        <span>{version.date.toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}

export default AIDocumentAnnotation;

