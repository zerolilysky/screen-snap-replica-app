
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

// Import our pages
import Match from "./pages/Match";
import Friends from "./pages/Friends";
import Messages from "./pages/Messages";
import Community from "./pages/Community";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ProfileViews from "./pages/ProfileViews";
import UserPosts from "./pages/UserPosts";
import Customization from "./pages/Customization";
import Wallet from "./pages/Wallet";
import Leaderboard from "./pages/Leaderboard";
import CpSpace from "./pages/CpSpace";
import PersonalityTest from "./pages/PersonalityTest";
import CreatePost from "./pages/CreatePost";
import MessageDetail from "./pages/MessageDetail";
import MatchDetail from "./pages/MatchDetail";
import UserProfile from "./pages/UserProfile";
import Chat from "./pages/Chat";
import DiscussionTopic from "./pages/DiscussionTopic";
import Concepts from "./pages/Concepts";
import ConceptDetail from "./pages/ConceptDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/match" element={<Match />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:type" element={<MessageDetail />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/post" element={<CreatePost />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/discover/discussions" element={<DiscussionTopic />} />
            <Route path="/discover/discussion/:id" element={<DiscussionTopic />} />
            <Route path="/discover/concepts" element={<Concepts />} />
            <Route path="/discover/concept/:id" element={<ConceptDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/views" element={<ProfileViews />} />
            <Route path="/profile/posts" element={<UserPosts />} />
            <Route path="/profile/customization" element={<Customization />} />
            <Route path="/profile/wallet" element={<Wallet />} />
            <Route path="/profile/leaderboard" element={<Leaderboard />} />
            <Route path="/profile/cp-space" element={<CpSpace />} />
            <Route path="/personality-test" element={<PersonalityTest />} />
            <Route path="/match/:type" element={<MatchDetail />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
