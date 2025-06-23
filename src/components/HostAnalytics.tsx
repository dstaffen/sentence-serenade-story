
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, CheckCircle, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GameAnalytics {
  completed_participants: number | null;
  created_at: string | null;
  current_turn: number | null;
  game_id: string | null;
  game_status_display: string | null;
  max_participants: number | null;
  sentences_written: number | null;
  status: string | null;
  title: string | null;
  total_participants: number | null;
}

interface HostAnalyticsProps {
  hostEmail: string;
}

const HostAnalytics = ({ hostEmail }: HostAnalyticsProps) => {
  const { data: games, isLoading } = useQuery({
    queryKey: ['host-games', hostEmail],
    queryFn: async () => {
      // Get games for this host email from the games table directly
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          title,
          status,
          created_at,
          max_participants,
          current_turn,
          completed_at
        `)
        .eq('host_email', hostEmail)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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

  if (!games || games.length === 0) {
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

  const totalGames = games.length;
  const completedGames = games.filter(game => game.status === 'completed').length;
  const activeGames = games.filter(game => game.status === 'active').length;
  const completionRate = totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;

  // Calculate average completion time for completed games
  const completedGamesWithTime = games.filter(game => 
    game.status === 'completed' && game.completed_at && game.created_at
  );
  
  const avgCompletionHours = completedGamesWithTime.length > 0
    ? Math.round(
        completedGamesWithTime.reduce((acc, game) => {
          const completedAt = new Date(game.completed_at!);
          const createdAt = new Date(game.created_at);
          const hours = (completedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          return acc + hours;
        }, 0) / completedGamesWithTime.length
      )
    : 0;

  return (
    <div className="space-y-6">
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
              <div className="text-2xl font-bold text-gray-800">{totalGames}</div>
              <div className="text-sm text-gray-600">Total Games</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{completedGames}</div>
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
              <div className="text-2xl font-bold text-gray-800">{avgCompletionHours}h</div>
              <div className="text-sm text-gray-600">Avg. Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Max Participants</TableHead>
                <TableHead>Current Turn</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.slice(0, 5).map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title || 'Untitled Game'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : game.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {game.status}
                    </span>
                  </TableCell>
                  <TableCell>{game.max_participants}</TableCell>
                  <TableCell>{game.current_turn}</TableCell>
                  <TableCell>{new Date(game.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostAnalytics;
