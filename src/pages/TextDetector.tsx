import { useState } from "react";
import { DetectorLayout } from "@/components/DetectorLayout";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Copy, Flag, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  score: number;
  label: string;
  explanation_short: string;
  explanation_long: string[];
  actions: string[];
  highlighted_phrases: string[];
}

const TextDetector = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Please enter text",
        description: "Enter text content to analyze for phishing patterns",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock analysis based on content
    const urgencyPatterns = /urgent|suspend|expire|immediate|2 hours|24 hours|act now|verify now/i;
    const credentialPatterns = /login|password|account|verify|confirm|click here|secure/i;
    const threatPatterns = /suspend|close|terminate|block|lock/i;
    const rewardPatterns = /win|won|prize|reward|congratulations|selected/i;
    
    let score = 70; // Base safe score
    const detectedPatterns: string[] = [];
    const highlights: string[] = [];
    
    if (urgencyPatterns.test(text)) {
      score -= 25;
      detectedPatterns.push("Urgency indicators detected");
      const matches = text.match(urgencyPatterns);
      if (matches) highlights.push(...matches);
    }
    
    if (credentialPatterns.test(text)) {
      score -= 20;
      detectedPatterns.push("Credential harvesting patterns");
      const matches = text.match(credentialPatterns);
      if (matches) highlights.push(...matches);
    }
    
    if (threatPatterns.test(text)) {
      score -= 20;
      detectedPatterns.push("Threat language detected");
      const matches = text.match(threatPatterns);
      if (matches) highlights.push(...matches);
    }
    
    if (rewardPatterns.test(text)) {
      score -= 15;
      detectedPatterns.push("Reward/prize language");
      const matches = text.match(rewardPatterns);
      if (matches) highlights.push(...matches);
    }

    // Check for suspicious URLs in text
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = text.match(urlPattern);
    if (urls) {
      urls.forEach(url => {
        if (url.includes('g00gle') || url.includes('paypa1') || url.includes('micr0soft')) {
          score -= 30;
          detectedPatterns.push("Suspicious URLs with homoglyphs");
          highlights.push(url);
        }
      });
    }

    const mockResult: AnalysisResult = {
      score: Math.max(0, score),
      label: "",
      explanation_short: "",
      explanation_long: detectedPatterns.length > 0 ? detectedPatterns : ["No obvious phishing indicators detected"],
      actions: [],
      highlighted_phrases: highlights,
    };

    // Determine label and actions based on score
    if (mockResult.score > 50) {
      mockResult.label = "Safe";
      mockResult.explanation_short = "Text appears to be legitimate communication";
      mockResult.actions = ["Proceed normally", "Verify sender if suspicious"];
    } else if (mockResult.score >= 35) {
      mockResult.label = "Warning";
      mockResult.explanation_short = "Some suspicious patterns detected - exercise caution";
      mockResult.actions = ["Verify with sender directly", "Do not click suspicious links", "Check sender reputation"];
    } else {
      mockResult.label = "Phishing";
      mockResult.explanation_short = "Multiple phishing indicators detected - likely malicious";
      mockResult.actions = ["Do not respond", "Do not click any links", "Report as phishing", "Delete message"];
    }

    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast({ title: "Text copied to clipboard" });
  };

  const reportPhishing = () => {
    toast({ title: "Reported as phishing", description: "Thank you for helping improve security" });
  };

  const highlightText = (originalText: string, highlights: string[]) => {
    if (highlights.length === 0) return originalText;
    
    let highlightedText = originalText;
    highlights.forEach(phrase => {
      const regex = new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-phishing/20 text-phishing">$1</mark>');
    });
    
    return highlightedText;
  };

  return (
    <DetectorLayout title="Text Detector">
      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter text content to analyze</label>
            <Textarea
              placeholder="Paste email content, message, or any text you want to analyze..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32"
            />
          </div>
          
          <Button onClick={analyzeText} disabled={isAnalyzing} size="lg">
            {isAnalyzing ? "Analyzing..." : "Analyze Text"}
          </Button>
          
          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            <Badge 
              variant="secondary" 
              className="cursor-pointer" 
              onClick={() => setText("⚠️ Urgent: Your account will be suspended in 2 hours. Click here to verify: http://verify-acc0unt-login.com")}
            >
              Urgent suspension threat
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer" 
              onClick={() => setText("Congratulations! You've won $1000. Click here to claim your prize before it expires in 24 hours.")}
            >
              Prize scam
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer" 
              onClick={() => setText("Hello, I hope this message finds you well. Please review the attached document when you have a moment.")}
            >
              Legitimate message
            </Badge>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <Separator />
            
            {/* Score Display */}
            <div className="flex items-start gap-6">
              <ScoreDisplay score={result.score} />
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Analysis Summary</h3>
                  <p className="text-muted-foreground">{result.explanation_short}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={copyText} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Text
                  </Button>
                  <Button variant="outline" size="sm" onClick={reportPhishing} className="gap-2">
                    <Flag className="h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Highlighted Text */}
            {result.highlighted_phrases.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Text with Highlighted Threats
                </h4>
                <div 
                  className="p-3 bg-muted/20 rounded text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightText(text, result.highlighted_phrases) 
                  }}
                />
              </Card>
            )}

            {/* Detailed Analysis */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Detailed Analysis
              </h4>
              <ul className="space-y-2">
                {result.explanation_long.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Recommended Actions */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Recommended Actions</h4>
              <ul className="space-y-2">
                {result.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </DetectorLayout>
  );
};

export default TextDetector;