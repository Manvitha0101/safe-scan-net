import { useState, useRef } from "react";
import { DetectorLayout } from "@/components/DetectorLayout";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Upload, Copy, Flag, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  score: number;
  label: string;
  explanation_short: string;
  explanation_long: string[];
  actions: string[];
  detected_brand?: string;
  similarity_score?: number;
  tampering_detected?: string[];
}

const ImageDetector = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "Please select an image",
        description: "Upload an image to analyze for logo tampering",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis - in reality this would use image comparison algorithms
    const filename = selectedImage.name.toLowerCase();
    const detectedBrand = filename.includes('google') ? 'Google' : 
                         filename.includes('paypal') ? 'PayPal' :
                         filename.includes('microsoft') ? 'Microsoft' :
                         filename.includes('apple') ? 'Apple' : 'Unknown';

    let score = 80; // Base score
    const tamperingFlags: string[] = [];
    
    // Simulate tampering detection based on filename patterns
    if (filename.includes('fake') || filename.includes('modified')) {
      score -= 40;
      tamperingFlags.push("Visual modifications detected");
    }
    
    if (filename.includes('phish') || filename.includes('scam')) {
      score -= 50;
      tamperingFlags.push("Known phishing variant");
    }

    // Random variation for demo
    const similarity = Math.random() * 100;
    if (similarity < 70) {
      score -= 20;
      tamperingFlags.push("Low similarity to canonical logo");
    }

    const mockResult: AnalysisResult = {
      score: Math.max(0, Math.min(100, score)),
      label: "",
      explanation_short: "",
      explanation_long: [],
      actions: [],
      detected_brand: detectedBrand,
      similarity_score: similarity,
      tampering_detected: tamperingFlags,
    };

    // Determine results based on score
    if (mockResult.score > 50) {
      mockResult.label = "Safe";
      mockResult.explanation_short = detectedBrand !== 'Unknown' 
        ? `Image appears to be legitimate ${detectedBrand} logo`
        : "Image appears legitimate with no obvious tampering";
      mockResult.explanation_long = [
        `High similarity to canonical ${detectedBrand} logo`,
        "No obvious visual modifications detected",
        "Color palette matches expected values",
        "Aspect ratio is within expected bounds"
      ];
      mockResult.actions = ["Image appears safe to use", "Verify source if suspicious"];
    } else if (mockResult.score >= 35) {
      mockResult.label = "Warning";
      mockResult.explanation_short = "Some inconsistencies detected - verify authenticity";
      mockResult.explanation_long = [
        "Moderate similarity to known brand logos",
        "Minor visual inconsistencies detected",
        ...tamperingFlags
      ];
      mockResult.actions = ["Verify image source", "Compare with official brand assets", "Use caution"];
    } else {
      mockResult.label = "Phishing";
      mockResult.explanation_short = "Logo tampering detected - likely impersonation attempt";
      mockResult.explanation_long = [
        "Significant differences from canonical logo",
        "Visual modifications detected",
        ...tamperingFlags,
        "Potential brand impersonation"
      ];
      mockResult.actions = ["Do not trust", "Report as fraudulent", "Block source", "Warn others"];
    }

    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const reportPhishing = () => {
    toast({ title: "Reported as phishing", description: "Thank you for helping improve security" });
  };

  return (
    <DetectorLayout title="Image Detector">
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Upload image to analyze</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-xs max-h-48 mx-auto rounded-lg shadow-sm"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{selectedImage?.name}</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Choose Different Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Upload an image</p>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to select logos, brand images, or screenshots
                    </p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select Image
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          
          {selectedImage && (
            <Button onClick={analyzeImage} disabled={isAnalyzing} size="lg">
              {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
          )}
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
                  {result.detected_brand && result.detected_brand !== 'Unknown' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Detected brand: <span className="font-medium">{result.detected_brand}</span>
                      {result.similarity_score && (
                        <span className="ml-2">
                          (Similarity: {Math.round(result.similarity_score)}%)
                        </span>
                      )}
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={reportPhishing} className="gap-2">
                    <Flag className="h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Tampering Detection */}
            {result.tampering_detected && result.tampering_detected.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Tampering Analysis
                </h4>
                <ul className="space-y-2">
                  {result.tampering_detected.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-phishing mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
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

export default ImageDetector;