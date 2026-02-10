import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

interface PerformanceMetrics {
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    cls: null,
    inp: null,
    fcp: null,
    lcp: null,
    ttfb: null,
  };

  private listeners: Set<(metrics: PerformanceMetrics) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    onCLS(this.handleMetric.bind(this, 'cls'));
    onINP(this.handleMetric.bind(this, 'inp'));
    onFCP(this.handleMetric.bind(this, 'fcp'));
    onLCP(this.handleMetric.bind(this, 'lcp'));
    onTTFB(this.handleMetric.bind(this, 'ttfb'));
  }

  private handleMetric(name: keyof PerformanceMetrics, metric: Metric): void {
    this.metrics[name] = metric.value;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getMetrics()));
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public subscribe(listener: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public logMetrics(): void {
    const metrics = this.getMetrics();
    console.table({
      'Cumulative Layout Shift (CLS)': metrics.cls?.toFixed(3) || 'pending',
      'Interaction to Next Paint (INP)': metrics.inp ? `${metrics.inp.toFixed(2)}ms` : 'pending',
      'First Contentful Paint (FCP)': metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'pending',
      'Largest Contentful Paint (LCP)': metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'pending',
      'Time to First Byte (TTFB)': metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'pending',
    });
  }

  public getScores(): { metric: string; value: string; rating: string }[] {
    const metrics = this.getMetrics();
    return [
      {
        metric: 'CLS',
        value: metrics.cls?.toFixed(3) || 'pending',
        rating: this.rateMetric('cls', metrics.cls),
      },
      {
        metric: 'INP',
        value: metrics.inp ? `${metrics.inp.toFixed(0)}ms` : 'pending',
        rating: this.rateMetric('inp', metrics.inp),
      },
      {
        metric: 'FCP',
        value: metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'pending',
        rating: this.rateMetric('fcp', metrics.fcp),
      },
      {
        metric: 'LCP',
        value: metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'pending',
        rating: this.rateMetric('lcp', metrics.lcp),
      },
      {
        metric: 'TTFB',
        value: metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'pending',
        rating: this.rateMetric('ttfb', metrics.ttfb),
      },
    ];
  }

  private rateMetric(name: keyof PerformanceMetrics, value: number | null): string {
    if (value === null) return 'pending';

    const thresholds = {
      cls: { good: 0.1, needsImprovement: 0.25 },
      inp: { good: 200, needsImprovement: 500 },
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      ttfb: { good: 800, needsImprovement: 1800 },
    };

    const threshold = thresholds[name];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }
}

export const performanceMonitor = new PerformanceMonitor();

export function reportWebVitals(): void {
  setTimeout(() => {
    performanceMonitor.logMetrics();
  }, 3000);
}
