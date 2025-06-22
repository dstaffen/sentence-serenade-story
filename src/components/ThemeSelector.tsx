
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Palette, Shuffle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Theme {
  id: string;
  name: string;
  description: string;
  starting_prompts: string[];
}

interface ThemeSelectorProps {
  selectedThemeId?: string;
  onThemeChange: (themeId: string | undefined) => void;
  onPromptSelect: (prompt: string) => void;
}

const ThemeSelector = ({ selectedThemeId, onThemeChange, onPromptSelect }: ThemeSelectorProps) => {
  const { data: themes, isLoading } = useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Theme[];
    }
  });

  const selectedTheme = themes?.find(theme => theme.id === selectedThemeId);

  const getRandomPrompt = () => {
    if (!selectedTheme || !selectedTheme.starting_prompts.length) return;
    
    const randomIndex = Math.floor(Math.random() * selectedTheme.starting_prompts.length);
    const prompt = selectedTheme.starting_prompts[randomIndex];
    onPromptSelect(prompt);
  };

  const handleThemeChange = (value: string) => {
    if (value === "no-theme") {
      onThemeChange(undefined);
    } else {
      onThemeChange(value);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Story Theme (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <span>Story Theme (Optional)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedThemeId || "no-theme"} onValueChange={handleThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a theme for inspiration..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-theme">No theme (Custom story)</SelectItem>
            {themes?.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                <div>
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm text-gray-500">{theme.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTheme && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <strong>Theme:</strong> {selectedTheme.description}
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Suggested starting prompts:</div>
              <div className="space-y-2">
                {selectedTheme.starting_prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="p-3 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => onPromptSelect(prompt)}
                  >
                    <p className="text-sm text-purple-800 italic">"{prompt}"</p>
                  </div>
                ))}
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getRandomPrompt}
                className="w-full"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Use Random Prompt
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
