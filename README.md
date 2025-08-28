# Bollinger Bands Trading Chart

A professional Next.js 14 application implementing Bollinger Bands indicator using KLineCharts, designed to replicate TradingView's functionality and appearance with full light/dark theme support.

## Features

### Core Functionality
- **Interactive Bollinger Bands**: Fully customizable indicator with real-time updates
- **Professional Chart Interface**: Light/dark theme support optimized for financial data visualization
- **Theme Toggle**: Seamless switching between light and dark modes with system preference detection
- **Crosshair Tooltip**: Shows current Basis, Upper, and Lower band values
- **Settings Modal**: Tabbed interface for Inputs and Style configuration
- **Real-time Updates**: Instant visualization of setting changes

### Bollinger Bands Configuration

#### Inputs (with defaults)
- **Length**: 20 (period for SMA calculation)
- **MA Type**: SMA (Simple Moving Average - only option implemented)
- **Source**: Close (also supports Open, High, Low)
- **StdDev Multiplier**: 2.0 (standard deviation multiplier)
- **Offset**: 0 (shift bands forward/backward)

#### Style Options
- **Middle Band**: Color, line width, line style (solid/dashed), visibility toggle
- **Upper Band**: Color, line width, line style (solid/dashed), visibility toggle  
- **Lower Band**: Color, line width, line style (solid/dashed), visibility toggle
- **Background Fill**: Color, opacity (0-100%), visibility toggle

### Technical Implementation

#### Bollinger Bands Calculation
- **Basis** = SMA(source, length)
- **Standard Deviation** = Population standard deviation of last N source values
- **Upper Band** = Basis + (StdDev × multiplier)
- **Lower Band** = Basis - (StdDev × multiplier)
- **Offset** = Shift bands by specified number of periods

**Note on Standard Deviation**: This implementation uses population standard deviation (dividing by N) rather than sample standard deviation (dividing by N-1), which is consistent with most trading platforms including TradingView.

## Technology Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **next-themes** for theme management
- **KLineCharts 9.x** for candlestick charts and overlays
- **shadcn/ui** components for professional UI elements

## Setup & Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
/app
  page.tsx                     # Main page with chart + controls
  layout.tsx                   # Root layout
  globals.css                  # Global styles
/components
  Chart.tsx                    # KLineCharts wrapper component
  BollingerSettings.tsx        # Settings modal with tabs
  ThemeProvider.tsx            # Theme context provider
  ThemeToggle.tsx              # Light/dark mode toggle button
  /ui                          # shadcn/ui components
/lib
  /indicators
    bollinger.ts               # Bollinger Bands calculation logic
  types.ts                     # TypeScript type definitions
  utils.ts                     # Utility functions
/public
  /data
    ohlcv.json                 # Demo OHLCV data (200+ candles)
```

## Demo Data

The application includes 200+ candles of realistic OHLCV (Open, High, Low, Close, Volume) data spanning several months. Data is loaded from `/public/data/ohlcv.json` and represents Bitcoin price movements with realistic volatility patterns.

## Performance

- Optimized for smooth rendering of 200-1000 candles
- Efficient indicator calculations using typed algorithms
- Minimal re-renders through proper React optimization
- Responsive design works across all device sizes

## KLineCharts Version

This project uses KLineCharts version ^9.x, which provides:
- Modern candlestick chart rendering
- Custom overlay support for indicators
- Built-in crosshair and tooltip functionality
- Comprehensive styling and theming options

## Screenshots

The application features:
- Light and dark professional themes similar to TradingView
- Automatic theme switching with system preference detection
- Real-time crosshair with Bollinger values
- Tabbed settings modal for easy configuration
- Responsive design optimized for trading workflows
- Clean, modern UI with proper contrast ratios in both themes

## Development Notes

- Built with production-ready code standards
- Fully typed TypeScript implementation
- Modular architecture for easy extension
- Proper separation of concerns between UI and business logic
- Optimized for both development and production environments

## License

This is a demonstration project showcasing professional-grade financial charting implementation.