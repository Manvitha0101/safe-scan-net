import { useState, useEffect } from "react";
import { DetectorLayout } from "@/components/DetectorLayout";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Filter, Globe, MessageSquare, Image, Clock, ExternalLink, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonitoringEvent {
  id: string;
  timestamp: Date;
  type: 'url' | 'text' | 'image';
  source_preview: string;
  score: number;
  label: string;
  explanation: string;
  source_ip?: string;
  user_agent?: string;
}

const Monitoring = () => {
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<MonitoringEvent[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterScore, setFilterScore] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Generate mock events
  useEffect(() => {
    const generateMockEvents = () => {
      const mockEvents: MonitoringEvent[] = [];
      const types: ('url' | 'text' | 'image')[] = ['url', 'text', 'image'];
      const sources = [
        'https://g00gle.com/login',
        'Urgent: Account suspended',
        'modified-paypal-logo.png',
        'https://microsoft-support.net',
        'Congratulations! You won!',
        'https://google.com',
        'Meeting tomorrow at 3pm',
        'apple-logo.png',
        'https://paypa1-secure.com',
        'Your package is ready'
      ];

      for (let i = 0; i < 15; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        let score = Math.floor(Math.random() * 100);
        
        // Bias some events to be more suspicious
        if (source.includes('g00gle') || source.includes('paypa1') || source.includes('modified')) {
          score = Math.floor(Math.random() * 30);
        } else if (source.includes('Urgent') || source.includes('Congratulations')) {
          score = Math.floor(Math.random() * 40);
        }

        mockEvents.push({
          id: `event-${i}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
          type,
          source_preview: source,
          score,
          label: score > 50 ? 'Safe' : score >= 35 ? 'Warning' : 'Phishing',
          explanation: score <= 35 ? 'Multiple threat indicators detected' : 
                      score < 50 ? 'Some suspicious patterns found' : 
                      'No obvious threats detected',
          source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          user_agent: Math.random() > 0.5 ? 'Chrome/91.0' : 'Firefox/89.0'
        });
      }

      return mockEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    const initialEvents = generateMockEvents();
    setEvents(initialEvents);
    setFilteredEvents(initialEvents);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newEvent: MonitoringEvent = {
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        type: ['url', 'text', 'image'][Math.floor(Math.random() * 3)] as any,
        source_preview: ['New suspicious URL detected', 'Phishing email intercepted', 'Fake logo uploaded'][Math.floor(Math.random() * 3)],
        score: Math.floor(Math.random() * 100),
        label: '',
        explanation: '',
        source_ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      };
      
      newEvent.label = newEvent.score > 50 ? 'Safe' : newEvent.score >= 35 ? 'Warning' : 'Phishing';
      newEvent.explanation = newEvent.score <= 35 ? 'High-risk threat detected' : 
                            newEvent.score < 50 ? 'Potential threat identified' : 
                            'Routine scan completed';

      setEvents(prev => [newEvent, ...prev.slice(0, 19)]); // Keep only 20 events
    }, 5000); // New event every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = events;

    if (filterType !== "all") {
      filtered = filtered.filter(event => event.type === filterType);
    }

    if (filterScore !== "all") {
      filtered = filtered.filter(event => {
        if (filterScore === "safe") return event.score > 50;
        if (filterScore === "warning") return event.score >= 35 && event.score <= 50;
        if (filterScore === "phishing") return event.score < 35;
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.source_preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.explanation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, filterType, filterScore, searchTerm]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url': return <Globe className="h-4 w-4" />;
      case 'text': return <MessageSquare className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const reportEvent = (eventId: string) => {
    toast({ title: "Event reported", description: "Thank you for helping improve security" });
  };

  const blockSource = (eventId: string) => {
    toast({ title: "Source blocked", description: "Future requests will be automatically blocked" });
  };

  return (
    <DetectorLayout title="Real-time Monitoring">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-phishing" />
              <div>
                <p className="text-sm text-muted-foreground">Threats Blocked</p>
                <p className="text-2xl font-bold">{events.filter(e => e.score < 35).length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold">{events.filter(e => e.score >= 35 && e.score <= 50).length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-safe" />
              <div>
                <p className="text-sm text-muted-foreground">Safe</p>
                <p className="text-2xl font-bold">{events.filter(e => e.score > 50).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterScore} onValueChange={setFilterScore}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="phishing">Phishing</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Events ({filteredEvents.length})</h3>
          
          {filteredEvents.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(event.type)}
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium truncate">{event.source_preview}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.explanation}</p>
                    {event.source_ip && (
                      <p className="text-xs text-muted-foreground">IP: {event.source_ip}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ScoreDisplay score={event.score} className="p-3" />
                  
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => reportEvent(event.id)}
                      className="gap-1"
                    >
                      <Flag className="h-3 w-3" />
                      Report
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => blockSource(event.id)}
                      className="gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Block
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredEvents.length === 0 && (
            <Card className="p-8 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No events found</p>
              <p className="text-muted-foreground">Try adjusting your filters or wait for new events</p>
            </Card>
          )}
        </div>
      </div>
    </DetectorLayout>
  );
};

export default Monitoring;