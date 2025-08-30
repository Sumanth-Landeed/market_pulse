// Chart configuration constants
export const CHART_CONFIG = {
  height: 96, // h-96 class equivalent
  contentHeight: 80, // h-80 class equivalent
  margins: { top: 5, right: 30, left: 20, bottom: 5 },
  strokeWidth: {
    line: 2.5,
    referenceLine: 1.5
  },
  dots: {
    radius: 4,
    activeRadius: 6,
    strokeWidth: 2
  },
  gridStroke: "3 3",
  referenceLineStroke: "8 4"
} as const;

// Chart styling constants
export const CHART_STYLES = {
  tooltip: {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 'var(--radius)',
    fontSize: '12px'
  },
  tick: { fontSize: 12 },
  label: { 
    fontSize: '11px',
    fill: 'hsl(var(--muted-foreground))'
  }
} as const;

// Date formatting options
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric'
} as const;