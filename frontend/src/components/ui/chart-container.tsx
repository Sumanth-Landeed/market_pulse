import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Switch } from './switch';
import { Label } from './label';
import { LucideIcon } from 'lucide-react';
import { CHART_CONFIG } from '../../constants/chartConstants';

interface ChartContainerProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  showAverage: boolean;
  onAverageToggle: (checked: boolean) => void;
  toggleId: string;
  isLoading?: boolean;
  hasData?: boolean;
  children: React.ReactNode;
}

export function ChartContainer({
  title,
  icon: Icon,
  iconColor,
  showAverage,
  onAverageToggle,
  toggleId,
  isLoading = false,
  hasData = true,
  children
}: ChartContainerProps) {
  if (isLoading) {
    return (
      <Card className={`h-${CHART_CONFIG.height}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`h-${CHART_CONFIG.contentHeight} flex items-center justify-center`}>
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${iconColor.replace('text-', 'border-')}`}></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card className={`h-${CHART_CONFIG.height}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`h-${CHART_CONFIG.contentHeight} flex items-center justify-center`}>
            <p className="text-muted-foreground">No {title.toLowerCase()} data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-${CHART_CONFIG.height}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <span>{title}</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            id={toggleId}
            checked={showAverage}
            onCheckedChange={onAverageToggle}
          />
          <Label htmlFor={toggleId} className="text-sm text-muted-foreground">
            30-day avg
          </Label>
        </div>
      </CardHeader>
      <CardContent className={`h-${CHART_CONFIG.contentHeight}`}>
        {children}
      </CardContent>
    </Card>
  );
}