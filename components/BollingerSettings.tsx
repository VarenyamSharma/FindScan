'use client';

import { useState } from 'react';
import { BollingerSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

interface BollingerSettingsProps {
  settings: BollingerSettings;
  onSettingsChange: (settings: BollingerSettings) => void;
}

export default function BollingerSettingsComponent({ settings, onSettingsChange }: BollingerSettingsProps) {
  const [localSettings, setLocalSettings] = useState<BollingerSettings>(settings);

  const updateSettings = (updates: Partial<BollingerSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const updateBandStyle = (band: 'middleBand' | 'upperBand' | 'lowerBand', updates: Partial<BollingerSettings[typeof band]>) => {
    const newSettings = {
      ...localSettings,
      [band]: { ...localSettings[band], ...updates }
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const updateBackgroundFill = (updates: Partial<BollingerSettings['backgroundFill']>) => {
    const newSettings = {
      ...localSettings,
      backgroundFill: { ...localSettings.backgroundFill, ...updates }
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <Tabs defaultValue="inputs" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="inputs">Inputs</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
      </TabsList>
      
      <TabsContent value="inputs" className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <Input
              id="length"
              type="number"
              min="1"
              max="200"
              value={localSettings.length}
              onChange={(e) => updateSettings({ length: parseInt(e.target.value) || 20 })}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maType">MA Type</Label>
            <Select value={localSettings.maType} onValueChange={(value: 'SMA') => updateSettings({ maType: value })}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMA">SMA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={localSettings.source} onValueChange={(value: any) => updateSettings({ source: value })}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="close">Close</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stdDev">StdDev Multiplier</Label>
            <Input
              id="stdDev"
              type="number"
              step="0.1"
              min="0.1"
              max="10"
              value={localSettings.stdDevMultiplier}
              onChange={(e) => updateSettings({ stdDevMultiplier: parseFloat(e.target.value) || 2 })}
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="offset">Offset</Label>
          <Input
            id="offset"
            type="number"
            min="-50"
            max="50"
            value={localSettings.offset}
            onChange={(e) => updateSettings({ offset: parseInt(e.target.value) || 0 })}
            className="bg-background"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="style" className="space-y-6">
        {/* Upper Band */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="upperBand">Upper Band</Label>
            <Switch
              id="upperBand"
              checked={localSettings.upperBand.show}
              onCheckedChange={(show) => updateBandStyle('upperBand', { show })}
            />
          </div>
          
          {localSettings.upperBand.show && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <input
                    type="color"
                    value={localSettings.upperBand.color}
                    onChange={(e) => updateBandStyle('upperBand', { color: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Line Width</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={localSettings.upperBand.lineWidth}
                    onChange={(e) => updateBandStyle('upperBand', { lineWidth: parseInt(e.target.value) || 1 })}
                    className="bg-background"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Line Style</Label>
                <Select 
                  value={localSettings.upperBand.lineStyle} 
                  onValueChange={(value: 'solid' | 'dashed') => updateBandStyle('upperBand', { lineStyle: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        {/* Middle Band */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="middleBand">Middle Band</Label>
            <Switch
              id="middleBand"
              checked={localSettings.middleBand.show}
              onCheckedChange={(show) => updateBandStyle('middleBand', { show })}
            />
          </div>
          
          {localSettings.middleBand.show && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <input
                    type="color"
                    value={localSettings.middleBand.color}
                    onChange={(e) => updateBandStyle('middleBand', { color: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Line Width</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={localSettings.middleBand.lineWidth}
                    onChange={(e) => updateBandStyle('middleBand', { lineWidth: parseInt(e.target.value) || 1 })}
                    className="bg-background"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Line Style</Label>
                <Select 
                  value={localSettings.middleBand.lineStyle} 
                  onValueChange={(value: 'solid' | 'dashed') => updateBandStyle('middleBand', { lineStyle: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        {/* Lower Band */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="lowerBand">Lower Band</Label>
            <Switch
              id="lowerBand"
              checked={localSettings.lowerBand.show}
              onCheckedChange={(show) => updateBandStyle('lowerBand', { show })}
            />
          </div>
          
          {localSettings.lowerBand.show && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <input
                    type="color"
                    value={localSettings.lowerBand.color}
                    onChange={(e) => updateBandStyle('lowerBand', { color: e.target.value })}
                    className="w-full h-10 rounded border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Line Width</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={localSettings.lowerBand.lineWidth}
                    onChange={(e) => updateBandStyle('lowerBand', { lineWidth: parseInt(e.target.value) || 1 })}
                    className="bg-background"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Line Style</Label>
                <Select 
                  value={localSettings.lowerBand.lineStyle} 
                  onValueChange={(value: 'solid' | 'dashed') => updateBandStyle('lowerBand', { lineStyle: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        {/* Background Fill */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="backgroundFill">Background Fill</Label>
            <Switch
              id="backgroundFill"
              checked={localSettings.backgroundFill.show}
              onCheckedChange={(show) => updateBackgroundFill({ show })}
            />
          </div>
          
          {localSettings.backgroundFill.show && (
            <>
              <div className="space-y-2">
                <Label>Color</Label>
                <input
                  type="color"
                  value={localSettings.backgroundFill.color}
                  onChange={(e) => updateBackgroundFill({ color: e.target.value })}
                  className="w-full h-10 rounded border"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Opacity: {Math.round(localSettings.backgroundFill.opacity * 100)}%</Label>
                <Slider
                  value={[localSettings.backgroundFill.opacity]}
                  onValueChange={([opacity]) => updateBackgroundFill({ opacity })}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}