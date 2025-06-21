
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, CheckCircle, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  host_email: string;
  total_games: number;
  completed_games: number;
  active_games: number;
  avg_completion_hours: number;
  last_game_created: string;
}

interface HostAnalyticsProps {
  hostEmail: string;
}

const HostAnalytics = ({ hostEmail }: HostAnalyticsProps) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['host-analytics', hostEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('host_analytics')
        .select('*')
        .eq('host_email', hostEmail)
        .single();
      
      if (error) throw error;
      return data as AnalyticsData;
    },
    enabled: !!hostEmail
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Your Game Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Your Game Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No games created yet. Start your first collaborative story!</p>
        </CardContent>
      </Card>
    );
  }

  const completionRate = analytics.total_games > 0 
    ? Math.round((analytics.completed_games / analytics.total_games) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span>Your Game Statistics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{analytics.total_games}</div>
            <div className="text-sm text-gray-600">Total Games</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{analytics.completed_games}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{completionRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {analytics.avg_completion_hours ? Math.round(analytics.avg_completion_hours) : 0}h
            </div>
            <div className="text-sm text-gray-600">Avg. Time</div>
          </div>
        </div>
        
        {analytics.last_game_created && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Last game created: {new Date(analytics.last_game_created).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HostAnalytics;
