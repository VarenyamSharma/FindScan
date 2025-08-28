'use client';

import { useState, useEffect } from 'react';
import Chart from '@/components/Chart';
import BollingerSettings from '@/components/BollingerSettings';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OHLCV, BollingerSettings as BollingerSettingsType, defaultBollingerSettings } from '@/lib/types';
import { computeBollingerBands } from '@/lib/indicators/bollinger';
import { Settings, TrendingUp } from 'lucide-react';

export default function Home() {
  const [ohlcvData, setOhlcvData] = useState<OHLCV[]>([]);
  const [settings, setSettings] = useState<BollingerSettingsType>(defaultBollingerSettings);
  const [crosshairData, setCrosshairData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load OHLCV data
  useEffect(() => {
    fetch('/data/ohlcv.json')
      .then(res => res.json())
      .then(data => {
        setOhlcvData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load OHLCV data:', err);
        setLoading(false);
      });
  }, []);

  const handleSettingsChange = (newSettings: BollingerSettingsType) => {
    setSettings(newSettings);
  };

  const handleCrosshairChange = (data: any) => {
    setCrosshairData(data);
  };

  const getCrosshairBollingerValues = () => {
    if (!crosshairData?.dataIndex || !ohlcvData.length) return null;
    
    const bollingerData = computeBollingerBands(ohlcvData, settings);
    const currentIndex = crosshairData.dataIndex;
    
    // Find the corresponding Bollinger band data
    const bollingerPoint = bollingerData.find((_, index) => 
      index + settings.length - 1 === currentIndex
    );
    
    return bollingerPoint;
  };

  const crosshairBollinger = getCrosshairBollingerValues();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-96 bg-muted rounded"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-muted rounded w-32"></div>
              <div className="h-10 bg-muted rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-foreground">Bollinger Bands Chart</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              KLineCharts • {ohlcvData.length} candles loaded
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {/* Chart Section */}
        <div className="space-y-6">
          {/* Tooltip/Info Bar */}
          {crosshairBollinger && (
            <div className="bg-card border rounded-lg p-4">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: settings.upperBand.color }}></div>
                  <span className="text-muted-foreground">Upper:</span>
                  <span className="font-mono text-green-400">{crosshairBollinger.upper.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: settings.middleBand.color }}></div>
                  <span className="text-muted-foreground">Basis:</span>
                  <span className="font-mono text-blue-400">{crosshairBollinger.middle.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: settings.lowerBand.color }}></div>
                  <span className="text-muted-foreground">Lower:</span>
                  <span className="font-mono text-red-400">{crosshairBollinger.lower.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          <Chart 
            data={ohlcvData} 
            settings={settings} 
            onCrosshairChange={handleCrosshairChange}
          />

          {/* Controls */}
          <div className="flex gap-4">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-card hover:bg-accent"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Add Indicator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bollinger Bands Settings</DialogTitle>
                </DialogHeader>
                <BollingerSettings
                  settings={settings}
                  onSettingsChange={handleSettingsChange}
                />
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Length: {settings.length}</span>
              <span>StdDev: {settings.stdDevMultiplier}</span>
              <span>Source: {settings.source}</span>
            </div>
          </div>

          {/* Settings Summary */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Current Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Length:</span> {settings.length}
              </div>
              <div>
                <span className="text-muted-foreground">MA Type:</span> {settings.maType}
              </div>
              <div>
                <span className="text-muted-foreground">Source:</span> {settings.source}
              </div>
              <div>
                <span className="text-muted-foreground">StdDev Multiplier:</span> {settings.stdDevMultiplier}
              </div>
              <div>
                <span className="text-muted-foreground">Offset:</span> {settings.offset}
              </div>
              <div>
                <span className="text-muted-foreground">Background Fill:</span> {settings.backgroundFill.show ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t p-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>Built with Next.js 14, TypeScript, TailwindCSS, and KLineCharts</p>
          <p className="mt-2">Professional Bollinger Bands implementation with real-time updates</p>
        </div>
      </footer>
    </div>
  );
}