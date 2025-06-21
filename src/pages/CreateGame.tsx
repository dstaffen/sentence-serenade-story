import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, Users, Mail, Plus, Minus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  gameTitle: string;
  numParticipants: number;
  hostEmail: string;
  participantEmails: string[];
  openingSentence: string;
}

interface FormErrors {
  gameTitle?: string;
  hostEmail?: string;
  participantEmails?: string[];
  openingSentence?: string;
  general?: string;
}

const CreateGame = () => {
  const [formData, setFormData] = useState<FormData>({
    gameTitle: "",
    numParticipants: 8,
    hostEmail: "",
    participantEmails: [""],
    openingSentence: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate game title
    if (!formData.gameTitle.trim()) {
      newErrors.gameTitle = "Game title is required";
    }

    // Validate host email
    if (!formData.hostEmail.trim()) {
      newErrors.hostEmail = "Host email is required";
    } else if (!validateEmail(formData.hostEmail)) {
      newErrors.hostEmail = "Please enter a valid email address";
    }

    // Validate opening sentence
    if (!formData.openingSentence.trim()) {
      newErrors.openingSentence = "Opening sentence is required";
    } else if (formData.openingSentence.length > 200) {
      newErrors.openingSentence = "Opening sentence must be 200 characters or less";
    }

    // Validate participant emails
    const participantEmailErrors: string[] = [];
    const validEmails = formData.participantEmails.filter(email => email.trim());
    const allEmails = [...validEmails, formData.hostEmail].filter(email => email.trim());

    formData.participantEmails.forEach((email, index) => {
      if (email.trim() && !validateEmail(email)) {
        participantEmailErrors[index] = "Invalid email format";
      }
    });

    // Check for duplicate emails
    const emailCounts = allEmails.reduce((acc, email) => {
      acc[email.toLowerCase()] = (acc[email.toLowerCase()] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicates = Object.keys(emailCounts).filter(email => emailCounts[email] > 1);
    if (duplicates.length > 0) {
      newErrors.general = "All participant emails must be unique";
    }

    // Check if host email is included in participants
    const participantEmailsLower = validEmails.map(email => email.toLowerCase());
    if (!participantEmailsLower.includes(formData.hostEmail.toLowerCase())) {
      newErrors.general = "Host email must be included in the participants list";
    }

    // Check if we have enough participants
    if (validEmails.length < formData.numParticipants - 1) {
      newErrors.general = `Please add ${formData.numParticipants - validEmails.length} more participant email(s)`;
    }

    if (participantEmailErrors.length > 0) {
      newErrors.participantEmails = participantEmailErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleParticipantEmailChange = (index: number, value: string) => {
    const newEmails = [...formData.participantEmails];
    newEmails[index] = value;
    setFormData({ ...formData, participantEmails: newEmails });
    
    // Clear specific error for this field
    if (errors.participantEmails) {
      const newEmailErrors = [...errors.participantEmails];
      newEmailErrors[index] = "";
      setErrors({ ...errors, participantEmails: newEmailErrors });
    }
  };

  const addParticipantEmail = () => {
    if (formData.participantEmails.length < formData.numParticipants - 1) {
      setFormData({
        ...formData,
        participantEmails: [...formData.participantEmails, ""]
      });
    }
  };

  const removeParticipantEmail = (index: number) => {
    if (formData.participantEmails.length > 1) {
      const newEmails = formData.participantEmails.filter((_, i) => i !== index);
      setFormData({ ...formData, participantEmails: newEmails });
    }
  };

  const handleNumParticipantsChange = (value: string) => {
    const num = parseInt(value);
    const currentEmails = formData.participantEmails.filter(email => email.trim());
    const newEmails = [...currentEmails];
    
    // Adjust the number of email fields
    while (newEmails.length < num - 1) {
      newEmails.push("");
    }
    while (newEmails.length > num - 1) {
      newEmails.pop();
    }

    setFormData({
      ...formData,
      numParticipants: num,
      participantEmails: newEmails
    });
  };

  const sendTurnNotification = async (gameData: any, participantData: any, previousSentence: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-turn-notification', {
        body: {
          gameId: gameData.id,
          participantEmail: participantData.email,
          participantId: participantData.id,
          gameTitle: gameData.title,
          previousSentence: previousSentence,
          turnNumber: participantData.turn_order,
          maxParticipants: gameData.max_participants
        }
      });

      if (error) {
        console.error('Failed to send turn notification email:', error);
      }
    } catch (error) {
      console.error('Error sending turn notification:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Starting game creation...");

      // Create game record
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({
          title: formData.gameTitle,
          max_participants: formData.numParticipants,
          host_email: formData.hostEmail,
          status: 'active',
          current_turn: 1
        })
        .select()
        .single();

      if (gameError) {
        console.error("Error creating game:", gameError);
        throw new Error("Failed to create game");
      }

      console.log("Game created:", gameData);

      // Prepare all participant emails (including host)
      const allParticipantEmails = [
        formData.hostEmail,
        ...formData.participantEmails.filter(email => email.trim())
      ];

      // Create participant records with turn order
      const participantRecords = allParticipantEmails.map((email, index) => ({
        game_id: gameData.id,
        email: email.toLowerCase(),
        turn_order: index + 1,
        has_completed: false
      }));

      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .insert(participantRecords)
        .select();

      if (participantsError) {
        console.error("Error creating participants:", participantsError);
        throw new Error("Failed to create participants");
      }

      console.log("Participants created:", participantsData);

      // Create initial sentence record
      const { error: sentenceError } = await supabase
        .from('sentences')
        .insert({
          game_id: gameData.id,
          turn_number: 1,
          sentence_text: formData.openingSentence,
          participant_email: formData.hostEmail.toLowerCase()
        });

      if (sentenceError) {
        console.error("Error creating initial sentence:", sentenceError);
        throw new Error("Failed to create opening sentence");
      }

      console.log("Initial sentence created");

      // Find the first participant (turn_order = 1)
      const firstParticipant = participantsData.find(p => p.turn_order === 1);
      
      // Send email notification to first participant
      if (firstParticipant) {
        await sendTurnNotification(gameData, firstParticipant, formData.openingSentence);
      }
      
      toast({
        title: "Game Created Successfully!",
        description: "Game created! The first participant will receive an email shortly to continue the story."
      });
      
      // Navigate to the game page for the first participant
      setTimeout(() => {
        navigate(`/game/${gameData.id}/${firstParticipant?.id}`);
      }, 1500);

    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        title: "Error Creating Game",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Exquisite Corpse</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Create a New Story</h2>
            <p className="text-slate-600">Set up your collaborative storytelling game and invite others to join the creative journey.</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span>Game Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errors.general}</span>
                  </div>
                )}

                {/* Game Title */}
                <div className="space-y-2">
                  <Label htmlFor="game-title">Story Title *</Label>
                  <Input
                    id="game-title"
                    placeholder="Give your story a compelling title..."
                    value={formData.gameTitle}
                    onChange={(e) => {
                      setFormData({ ...formData, gameTitle: e.target.value });
                      if (errors.gameTitle) setErrors({ ...errors, gameTitle: undefined });
                    }}
                    className={`text-lg ${errors.gameTitle ? 'border-red-500' : ''}`}
                  />
                  {errors.gameTitle && (
                    <p className="text-sm text-red-600">{errors.gameTitle}</p>
                  )}
                </div>

                {/* Number of Participants */}
                <div className="space-y-2">
                  <Label htmlFor="num-participants">Number of Participants *</Label>
                  <Select value={formData.numParticipants.toString()} onValueChange={handleNumParticipantsChange}>
                    <SelectTrigger className="text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 participants</SelectItem>
                      <SelectItem value="10">10 participants</SelectItem>
                      <SelectItem value="12">12 participants</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Including yourself as the host</span>
                  </div>
                </div>

                {/* Host Email */}
                <div className="space-y-2">
                  <Label htmlFor="host-email">Your Email (Host) *</Label>
                  <Input
                    id="host-email"
                    type="email"
                    placeholder="host@example.com"
                    value={formData.hostEmail}
                    onChange={(e) => {
                      setFormData({ ...formData, hostEmail: e.target.value });
                      if (errors.hostEmail) setErrors({ ...errors, hostEmail: undefined });
                    }}
                    className={`text-lg ${errors.hostEmail ? 'border-red-500' : ''}`}
                  />
                  {errors.hostEmail && (
                    <p className="text-sm text-red-600">{errors.hostEmail}</p>
                  )}
                </div>

                {/* Participant Emails */}
                <div className="space-y-2">
                  <Label>Participant Emails *</Label>
                  <p className="text-sm text-slate-500">Add {formData.numParticipants - 1} participant email addresses</p>
                  
                  <div className="space-y-3">
                    {formData.participantEmails.map((email, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <Input
                          placeholder={`participant${index + 1}@example.com`}
                          value={email}
                          onChange={(e) => handleParticipantEmailChange(index, e.target.value)}
                          className={`flex-1 ${errors.participantEmails?.[index] ? 'border-red-500' : ''}`}
                        />
                        {formData.participantEmails.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeParticipantEmail(index)}
                            className="shrink-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {formData.participantEmails.length < formData.numParticipants - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addParticipantEmail}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Participant Email
                      </Button>
                    )}
                  </div>
                  
                  {errors.participantEmails && (
                    <div className="space-y-1">
                      {errors.participantEmails.map((error, index) => (
                        error && (
                          <p key={index} className="text-sm text-red-600">
                            Participant {index + 1}: {error}
                          </p>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Opening Sentence */}
                <div className="space-y-2">
                  <Label htmlFor="opening-sentence">Opening Sentence *</Label>
                  <Textarea
                    id="opening-sentence"
                    placeholder="Start your story with an intriguing first sentence..."
                    value={formData.openingSentence}
                    onChange={(e) => {
                      setFormData({ ...formData, openingSentence: e.target.value });
                      if (errors.openingSentence) setErrors({ ...errors, openingSentence: undefined });
                    }}
                    rows={3}
                    className={`text-lg resize-none ${errors.openingSentence ? 'border-red-500' : ''}`}
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">This will be the first sentence of your collaborative story.</p>
                    <p className="text-sm text-slate-500">{formData.openingSentence.length}/200</p>
                  </div>
                  {errors.openingSentence && (
                    <p className="text-sm text-red-600">{errors.openingSentence}</p>
                  )}
                </div>

                {/* How it works info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">How it works:</h4>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        Each participant will receive an email invitation to join. When it's their turn, 
                        they'll see only the previous sentence and add their own. Once everyone has contributed, 
                        the complete story will be revealed to all participants!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  {isSubmitting ? "Creating Game..." : "Create Game & Send Invitations"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
