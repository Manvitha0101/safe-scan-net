import { useState } from "react";
import { DetectorLayout } from "@/components/DetectorLayout";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { NetworkGraph } from "@/components/NetworkGraph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ExternalLink, Shield, Copy, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  score: number;
  label: string;
  explanation_short: string;
  explanation_long: string[];
  actions: string[];
  redirect_chain?: string[];
  graph_data?: {
    nodes: Array<{ id: string; label: string; color: string; title: string }>;
    edges: Array<{ from: string; to: string; label: string }>;
  };
}

const UrlDetector = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a URL",
        description: "Enter a URL to analyze for phishing threats",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis - in real implementation, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const mockResult: AnalysisResult = {
      score: url.includes("g00gle") ? 15 : url.includes("paypa1") ? 20 : Math.random() > 0.5 ? 75 : 25,
      label: "",
      explanation_short: "",
      explanation_long: [],
      actions: [],
      redirect_chain: [url, "redirected-domain.com", "final-destination.com"],
      graph_data: {
        nodes: [
          { id: "1", label: new URL(url).hostname, color: "#ef4444", title: "Original URL" },
          { id: "2", label: "intermediate.com", color: "#f59e0b", title: "Redirect" },
          { id: "3", label: "final.com", color: "#10b981", title: "Final destination" },
        ],
        edges: [
          { from: "1", to: "2", label: "302 redirect" },
          { from: "2", to: "3", label: "301 redirect" },
        ],
      },
    };

    // Determine label and explanations based on score
    if (mockResult.score > 50) {
      mockResult.label = "Safe";
      mockResult.explanation_short = "URL appears legitimate with no obvious phishing indicators";
      mockResult.explanation_long = [
        "Domain has valid SSL certificate",
        "No homoglyph characters detected",
        "Domain age appears legitimate",
        "No suspicious redirect patterns"
      ];
      mockResult.actions = ["Proceed with caution", "Verify sender if from email"];
    } else if (mockResult.score >= 35) {
      mockResult.label = "Warning";
      mockResult.explanation_short = "Some suspicious indicators found - exercise caution";
      mockResult.explanation_long = [
        "Unusual domain structure detected",
        "Multiple redirects in chain",
        "Domain registration is recent"
      ];
      mockResult.actions = ["Verify legitimacy", "Contact sender directly", "Avoid entering credentials"];
    } else {
      mockResult.label = "Phishing";
      mockResult.explanation_short = url.includes("g00gle") 
        ? "Homoglyph detected: uses zeros instead of o's in 'google'"
        : "Multiple phishing indicators detected";
      mockResult.explanation_long = [
        url.includes("g00gle") ? "Character substitution: '00' instead of 'oo'" : "Suspicious domain pattern",
        "Domain age is very recent",
        "SSL certificate from untrusted issuer",
        "Contains credential harvesting keywords"
      ];
      mockResult.actions = ["Do not click", "Report as phishing", "Block domain", "Warn others"];
    }

    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  };

  const reportPhishing = () => {
    toast({ title: "Reported as phishing", description: "Thank you for helping improve security" });
  };

  return (
    <DetectorLayout title="URL Detector">
      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter URL to analyze</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={analyzeUrl} disabled={isAnalyzing} size="lg">
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>
          
          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            <Badge 
              variant="secondary" 
              className="cursor-pointer" 
              onClick={() => setUrl("https://g00gle.com/login")}
            >
              g00gle.com (homoglyph)
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer" 
              onClick={() => setUrl("https://paypa1.secure-login.net")}
            >
              paypa1.secure-login.net
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer" 
              onClick={() => setUrl("https://google.com")}
            >
              google.com (safe)
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
                  <Button variant="outline" size="sm" onClick={copyUrl} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy URL
                  </Button>
                  <Button variant="outline" size="sm" onClick={reportPhishing} className="gap-2">
                    <Flag className="h-4 w-4" />
                    Report
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>

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

            {/* Network Graph */}
            {result.graph_data && (
              <Card className="p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Redirect Chain Analysis
                </h4>
                <NetworkGraph 
                  nodes={result.graph_data.nodes}
                  edges={result.graph_data.edges}
                />
              </Card>
            )}

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

export default UrlDetector;