import { Link } from "react-router-dom";
import { Shield, Globe, MessageSquare, Image, Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/phishcheck-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">PhishCheck</h1>
            </div>
            <Link to="/monitoring">
              <Button variant="outline" className="gap-2">
                <Activity className="h-4 w-4" />
                Live Monitoring
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Real-time Phishing Detection
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Protect yourself and your organization with AI-powered analysis of URLs, text, and images. 
            Get instant threat scores and actionable insights.
          </p>
        </div>
      </section>

      {/* Main Detectors */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Choose Your Analysis Type</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* URL Detector */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-4">URL Detector</h4>
                <p className="text-muted-foreground mb-6">
                  Analyze suspicious links, detect homoglyphs, trace redirects, and visualize connection networks.
                </p>
                <Link to="/detector/url">
                  <Button variant="detector" size="lg" className="w-full gap-2">
                    Analyze URL
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Text Detector */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Text Detector</h4>
                <p className="text-muted-foreground mb-6">
                  Identify social engineering tactics, urgency patterns, and credential harvesting attempts.
                </p>
                <Link to="/detector/text">
                  <Button variant="detector" size="lg" className="w-full gap-2">
                    Analyze Text
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Image Detector */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Image className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Image Detector</h4>
                <p className="text-muted-foreground mb-6">
                  Compare logos against canonical versions and detect visual tampering or impersonation.
                </p>
                <Link to="/detector/image">
                  <Button variant="detector" size="lg" className="w-full gap-2">
                    Analyze Image
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">Advanced Detection Features</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6">
              <h4 className="font-semibold mb-2">Real-time Analysis</h4>
              <p className="text-muted-foreground">Instant threat detection with sub-second response times</p>
            </div>
            <div className="p-6">
              <h4 className="font-semibold mb-2">Interactive Graphs</h4>
              <p className="text-muted-foreground">Visualize redirect chains and domain relationships</p>
            </div>
            <div className="p-6">
              <h4 className="font-semibold mb-2">Plain English Explanations</h4>
              <p className="text-muted-foreground">Clear, actionable insights without technical jargon</p>
            </div>
            <div className="p-6">
              <h4 className="font-semibold mb-2">Homoglyph Detection</h4>
              <p className="text-muted-foreground">Catch character substitution attacks like g00gle.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
